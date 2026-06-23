"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import type { LifeDNA, LifeEvent, LifeChoice, ChosenChoice } from "@/types";

/** 缓存事件到 localStorage，防止刷新后重新生成（选项变化） */
function saveEventsCache(mode: string, events: LifeEvent[], choices: ChosenChoice[], index: number) {
  try {
    localStorage.setItem(`${mode}-sim-cache`, JSON.stringify({ events, choices, index }));
  } catch { /* quota */ }
}

function loadEventsCache(mode: string): { events: LifeEvent[]; choices: ChosenChoice[]; index: number } | null {
  try {
    const raw = localStorage.getItem(`${mode}-sim-cache`);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch { return null; }
}

function clearEventsCache(mode: string) {
  try { localStorage.removeItem(`${mode}-sim-cache`); } catch { /* ignore */ }
}

// ---- 类型 ----

export type SimStatus =
  | "loading"
  | "generating"
  | "narrative"
  | "choosing"
  | "pending"
  | "selected"
  | "completed"
  | "error";

export interface SimulationConfig {
  mode: "restart" | "future";
  totalEvents: number;
  summaryRoute: string;
  progressLabel: string;
  progressColor: string;

  /** 分岔前叙事模式（仅 restart=true） */
  hasNarrativeMode: boolean;

  /** 确认选择时是否需要标记 isDivergence */
  markDivergence: boolean;

  /** 构建 API 请求体 */
  buildAPIRequest: (params: APIRequestParams) => Record<string, unknown>;

  /** 持久化 session —— 每次状态变更时调用 */
  persistSession?: (
    events: LifeEvent[],
    choices: ChosenChoice[],
    currentIndex: number,
    isComplete: boolean
  ) => void;
}

export interface APIRequestParams {
  dna: LifeDNA;
  formData: Record<string, string>;
  eventIndex: number;
  previousChoices: ChosenChoice[];
  narrativeState: string;
  characterName: string;
}

export interface SimulationState {
  status: SimStatus;
  currentEvent: LifeEvent | null;
  eventIndex: number;
  previousChoices: ChosenChoice[];
  narrativeState: string;
  characterName: string;
  pendingChoiceId: string | null;
  selectedChoiceLabel: string | null;
  isTransitioning: boolean;
  hasUndone: boolean;
  error: string | null;
  dna: LifeDNA | null;
  formData: Record<string, string>;
}

export function useSimulation(config: SimulationConfig) {
  // ---- 基础数据 ----
  const [dna, setDna] = useState<LifeDNA | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [initialized, setInitialized] = useState(false);

  // ---- 事件状态 ----
  const [status, setStatus] = useState<SimStatus>("loading");
  const [currentEvent, setCurrentEvent] = useState<LifeEvent | null>(null);
  const [events, setEvents] = useState<LifeEvent[]>([]);
  const [eventIndex, setEventIndex] = useState(0);
  const [previousChoices, setPreviousChoices] = useState<ChosenChoice[]>([]);
  const [narrativeState, setNarrativeState] = useState("");
  const [characterName, setCharacterName] = useState("");

  // ---- 选择动画 ----
  const [selectedChoiceLabel, setSelectedChoiceLabel] = useState<string | null>(null);
  const [pendingChoiceId, setPendingChoiceId] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [hasUndone, setHasUndone] = useState(false);
  const transitionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ---- 错误 ----
  const [error, setError] = useState<string | null>(null);

  // ---- 初始化 ----
  useEffect(() => {
    const dnaRaw = localStorage.getItem("parallel-life-dna");
    const formRaw = localStorage.getItem("parallel-life-form");
    if (!dnaRaw) return;
    try {
      setDna(JSON.parse(dnaRaw));
      setFormData(formRaw ? JSON.parse(formRaw) : {});
      setInitialized(true);
    } catch { /* ignore */ }
  }, []);

  // ---- 生成事件 ----
  const generateEvent = useCallback(
    async (index: number, prevChoices: ChosenChoice[]) => {
      if (!dna) return;
      setStatus("generating");
      setError(null);

      try {
        const response = await fetch("/api/generate-life-event", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(
            config.buildAPIRequest({
              dna,
              formData,
              eventIndex: index,
              previousChoices: prevChoices,
              narrativeState,
              characterName,
            })
          ),
        });

        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "生成事件失败");

        setCurrentEvent(result);
        setHasUndone(false);
        setEvents((prev) => {
          const updated = [...prev];
          updated[index] = result;
          // 缓存到 localStorage，刷新后恢复
          saveEventsCache(config.mode, updated, prevChoices, index);
          return updated;
        });
        if (result.narrativeState) setNarrativeState(result.narrativeState);
        if (result.characterName) setCharacterName(result.characterName);

        if (result.choices && result.choices.length > 0) {
          setStatus("choosing");
        } else if (config.hasNarrativeMode) {
          setStatus("narrative");
        } else {
          setStatus("choosing"); // 未来模式无叙事
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "未知错误");
        setStatus("error");
      }
    },
    [dna, narrativeState, characterName, formData, config]
  );

  // ---- 首次生成或恢复 ----
  useEffect(() => {
    if (dna && initialized && status === "loading") {
      // 尝试从缓存恢复已有事件
      const cached = loadEventsCache(config.mode);
      if (cached && cached.events.length > 0 && cached.events[0]) {
        setEvents(cached.events);
        setPreviousChoices(cached.choices);
        setEventIndex(cached.index);
        setCurrentEvent(cached.events[cached.index] || cached.events[0]);
        const ce = cached.events[cached.index] || cached.events[0];
        if (ce?.choices?.length > 0) {
          setStatus("choosing");
        } else {
          setStatus("narrative");
        }
        if (ce?.narrativeState) setNarrativeState(ce.narrativeState);
        if (ce?.characterName) setCharacterName(ce.characterName);
      } else {
        generateEvent(0, []);
      }
    }
  }, [dna, initialized, status, generateEvent, config.mode]);

  // ---- 预选 ----
  function handleChoice(choice: LifeChoice) {
    if (status !== "choosing" || isTransitioning || !currentEvent) return;
    setPendingChoiceId(choice.id);
    setStatus("pending");
  }

  // ---- 取消预选 ----
  function handleCancelPending() {
    if (status !== "pending") return;
    setPendingChoiceId(null);
    setStatus("choosing");
  }

  // ---- 确认选择 ----
  function handleConfirm() {
    if (status !== "pending" || !pendingChoiceId || !currentEvent) return;

    const choice = currentEvent.choices.find((c) => c.id === pendingChoiceId);
    if (!choice) return;

    setSelectedChoiceLabel(choice.label);
    setPendingChoiceId(null);
    setIsTransitioning(true);
    setStatus("selected");

    const newChoice: ChosenChoice = {
      eventId: currentEvent.id,
      eventTitle: currentEvent.title,
      age: currentEvent.age,
      chosenId: choice.id,
      chosenLabel: choice.label,
      isDivergence: config.markDivergence && !previousChoices.some((c) => c.isDivergence),
    };

    const updatedChoices = [...previousChoices, newChoice];
    setPreviousChoices(updatedChoices);

    // 持久化
    setEvents((currentEvents) => {
      const evts = [...currentEvents];
      evts[eventIndex] = currentEvent;
      config.persistSession?.(evts, updatedChoices, eventIndex, false);
      saveEventsCache(config.mode, evts, updatedChoices, eventIndex);
      return evts;
    });

    transitionTimerRef.current = setTimeout(() => {
      const nextIndex = eventIndex + 1;
      if (nextIndex >= config.totalEvents) {
        setStatus("completed");
        setIsTransitioning(false);
        config.persistSession?.([], updatedChoices, eventIndex, true);
        clearEventsCache(config.mode);
        return;
      }
      setEventIndex(nextIndex);
      setSelectedChoiceLabel(null);
      setIsTransitioning(false);
      generateEvent(nextIndex, updatedChoices);
    }, 1800);
  }

  // ---- 撤销（每个事件仅一次） ----
  function handleUndo() {
    if (status !== "selected" || hasUndone || !currentEvent) return;

    if (transitionTimerRef.current) {
      clearTimeout(transitionTimerRef.current);
      transitionTimerRef.current = null;
    }

    const reverted = previousChoices.slice(0, -1);
    setPreviousChoices(reverted);
    setHasUndone(true);
    setSelectedChoiceLabel(null);
    setIsTransitioning(false);
    setStatus("choosing");
    config.persistSession?.([], reverted, eventIndex, false);
  }

  // ---- 叙事继续（仅 restart 的 hasNarrativeMode） ----
  function handleContinue() {
    if (status !== "narrative" || isTransitioning || !currentEvent) return;

    setIsTransitioning(true);
    const updatedChoices = [
      ...previousChoices,
      {
        eventId: currentEvent.id,
        eventTitle: currentEvent.title,
        age: currentEvent.age,
        chosenId: "auto",
        chosenLabel: "真实人生",
      },
    ];
    setPreviousChoices(updatedChoices);

    setTimeout(() => {
      const nextIndex = eventIndex + 1;
      if (nextIndex >= config.totalEvents) {
        setStatus("completed");
        setIsTransitioning(false);
        config.persistSession?.([], updatedChoices, eventIndex, true);
        clearEventsCache(config.mode);
        return;
      }
      setEventIndex(nextIndex);
      setIsTransitioning(false);
      generateEvent(nextIndex, updatedChoices);
    }, 800);
  }

  // ---- 完成 ----
  function goToSummary() {
    window.location.href = config.summaryRoute;
  }

  // ---- 暴露 ----
  return {
    // 状态
    status,
    currentEvent,
    eventIndex,
    previousChoices,
    narrativeState,
    characterName,
    pendingChoiceId,
    selectedChoiceLabel,
    isTransitioning,
    hasUndone,
    error,
    dna,

    // 处理器
    handleChoice,
    handleConfirm,
    handleCancelPending,
    handleUndo,
    handleContinue: config.hasNarrativeMode ? handleContinue : null,
    handleRetry: () => generateEvent(eventIndex, previousChoices),
    goToSummary,

    // config 透传
    totalEvents: config.totalEvents,
    progressLabel: config.progressLabel,
    progressColor: config.progressColor,
    hasNarrativeMode: config.hasNarrativeMode,
  };
}
