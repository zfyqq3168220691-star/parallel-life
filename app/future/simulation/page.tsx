"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useSimulation } from "@/app/simulation/_shared/useSimulation";
import { buildFutureConfig } from "./future-config";
import { useFutureLabStore } from "@/stores/future-lab-store";
import type { LifeChoice } from "@/types";

const choiceColors = [
  { id: "choice-A", color: "blue", border: "border-blue-500/30 hover:border-blue-400/60", glow: "group-hover:shadow-blue-500/10", bg: "group-hover:bg-blue-500/5" },
  { id: "choice-B", color: "emerald", border: "border-emerald-500/30 hover:border-emerald-400/60", glow: "group-hover:shadow-emerald-500/10", bg: "group-hover:bg-emerald-500/5" },
  { id: "choice-C", color: "violet", border: "border-violet-500/30 hover:border-violet-400/60", glow: "group-hover:shadow-violet-500/10", bg: "group-hover:bg-violet-500/5" },
];

export default function FutureSimulationPage() {
  const router = useRouter();
  const branch = useFutureLabStore((s) => s.selectedBranch);
  const confusion = useFutureLabStore((s) => s.userConfusion);
  const config = buildFutureConfig();
  const sim = useSimulation(config);

  // Guard（直接从 localStorage 读取，不依赖 Zustand 水合时序）
  useEffect(() => {
    // 如果 Zustand 已经恢复并有数据，安全通过
    if (branch && confusion) return;

    // Zustand 还水合完，从 localStorage 读原始数据判断
    try {
      const raw = localStorage.getItem("future-lab-store");
      if (raw) {
        const data = JSON.parse(raw);
        if (data.state?.selectedBranch && data.state?.userConfusion) {
          return; // localStorage 有数据，等待 Zustand 水合完成即可
        }
      }
    } catch {}

    // 真没有数据，回 onboarding
    router.replace("/future/onboarding");
  }, [branch, confusion, router]);

  // ---- Loading ----
  if (sim.status === "loading") {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <svg className="h-8 w-8 animate-spin text-emerald-400" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-sm text-muted-foreground">准备你的未来推演...</p>
        </div>
      </div>
    );
  }

  // ---- Generating ----
  if (sim.status === "generating") {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <svg className="h-8 w-8 animate-spin text-emerald-400" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-sm text-muted-foreground">AI 正在生成未来事件...</p>
        </div>
      </div>
    );
  }

  // ---- Completed ----
  if (sim.status === "completed") {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4">
        <div className="max-w-md text-center">
          <span className="text-6xl">🔮</span>
          <h1 className="mt-6 text-3xl font-bold">未来探索完成</h1>
          <p className="mt-3 text-muted-foreground">
            你已经走过了 8 个未来节点。
            <br />这些都是你在另一条路上可能遇见的自己。
          </p>
          <Button size="lg" className="mt-8 h-14 px-10" onClick={sim.goToSummary}>
            查看未来总结
          </Button>
        </div>
      </div>
    );
  }

  // ---- Error ----
  if (sim.status === "error") {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4">
        <div className="max-w-md text-center">
          <span className="text-5xl">⚠️</span>
          <h1 className="mt-4 text-2xl font-bold">生成失败</h1>
          <p className="mt-2 text-muted-foreground">{sim.error}</p>
          <Button className="mt-6" variant="outline" onClick={sim.handleRetry}>重试</Button>
        </div>
      </div>
    );
  }

  // ---- Choice Mode (future has no narrative mode) ----
  if (!sim.currentEvent) return null;

  return <ChoiceView sim={sim} branchName={branch?.name || ""} />;
}

// ===== 选择视图 =====
function ChoiceView({ sim, branchName }: { sim: ReturnType<typeof useSimulation>; branchName: string }) {
  const event = sim.currentEvent!;
  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden px-4 py-8 sm:py-12">
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute left-1/2 top-[35%] h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-b from-emerald-500/6 via-emerald-500/2 to-transparent blur-3xl" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)", backgroundSize: "64px 64px" }} />
      </div>

      <div className="relative z-10 mx-auto max-w-3xl">
        {/* 进度条 */}
        <div className="mb-8 animate-fade-in-up">
          <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
            <span>事件 {sim.eventIndex + 1}/{sim.totalEvents} · {sim.progressLabel} · {branchName}</span>
            <span>{sim.dna?.traits.join(" · ")}</span>
          </div>
          <div className="h-1 w-full overflow-hidden rounded-full bg-border/30">
            <div className="h-full rounded-full bg-emerald-500/50 transition-all duration-700 ease-out" style={{ width: `${((sim.eventIndex + 1) / sim.totalEvents) * 100}%` }} />
          </div>
        </div>

        {/* 事件卡片 */}
        <Card key={event.id} className="mb-8 border-border/20 bg-card/40 backdrop-blur-sm animate-fade-in-up">
          <CardContent className="p-6 sm:p-8">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border/30 bg-background/50 px-3 py-1 text-sm backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />你 {event.age} 岁了
            </div>
            <h2 className="mb-4 text-2xl font-bold tracking-tight sm:text-3xl">{event.title}</h2>
            {event.context && <p className="leading-relaxed text-foreground/80">{event.context}</p>}
          </CardContent>
        </Card>

        {/* 选择提示 */}
        <p className="mb-5 text-center text-sm text-muted-foreground animate-fade-in-up animate-delay-200">
          {sim.status === "pending" ? "确认你的选择" : sim.isTransitioning ? `你选择了"${sim.selectedChoiceLabel}"` : "选择一个方向"}
        </p>

        {/* 三个选项 */}
        <div className={cn("grid gap-4 sm:grid-cols-3", (sim.isTransitioning || sim.status === "selected") && "pointer-events-none")}>
          {event.choices.map((choice, i) => (
            <ChoiceButton key={choice.id} choice={choice} style={choiceColors[i]} sim={sim} />
          ))}
        </div>

        {/* 预选操作栏 */}
        {sim.status === "pending" && (
          <div className="mt-6 flex items-center justify-center gap-4 animate-fade-in-up">
            <button onClick={sim.handleCancelPending} className="flex items-center gap-1.5 rounded-full border border-border/40 bg-card/60 px-5 py-2.5 text-sm text-muted-foreground backdrop-blur-sm transition-colors hover:border-border/60 hover:text-foreground">
              <UndoIcon />选错了，重新选
            </button>
            <button onClick={sim.handleConfirm} className="flex items-center gap-1.5 rounded-full bg-emerald-500 px-6 py-2.5 text-sm font-medium text-white shadow-lg transition-all hover:bg-emerald-500/90 hover:shadow-xl">
              <CheckIcon />确认这个选择
            </button>
          </div>
        )}

        {/* 撤销令牌 */}
        {sim.status === "selected" && !sim.hasUndone && (
          <div className="mt-6 flex justify-center animate-fade-in-up">
            <button onClick={sim.handleUndo} className="flex items-center gap-1.5 rounded-full border border-border/40 bg-card/60 px-5 py-2.5 text-sm text-muted-foreground backdrop-blur-sm transition-colors hover:border-border/60 hover:text-foreground">
              <UndoIcon />选错了，重新选
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ===== 选项按钮 =====
function ChoiceButton({ choice, style, sim }: { choice: LifeChoice; style: typeof choiceColors[0]; sim: ReturnType<typeof useSimulation> }) {
  const isSelected = sim.selectedChoiceLabel === choice.label;
  const isPending = sim.status === "pending" && sim.pendingChoiceId === choice.id;
  const isDimmed = sim.status === "pending" && sim.pendingChoiceId !== choice.id;
  const disabled = sim.isTransitioning || sim.status === "pending" || sim.status === "selected";

  return (
    <button
      type="button"
      onClick={() => sim.handleChoice(choice)}
      disabled={disabled}
      className={cn(
        "group relative flex flex-col rounded-xl border p-5 text-left transition-all duration-500",
        style.border, style.glow, style.bg,
        "bg-card/30 backdrop-blur-sm hover:scale-[1.02] hover:shadow-xl",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        isPending && "scale-[1.03] border-emerald-500/40 shadow-xl shadow-emerald-500/10 ring-1 ring-emerald-500/30",
        isDimmed && "scale-95 opacity-40",
        isSelected && "scale-105 border-emerald-500/40 shadow-xl shadow-emerald-500/10",
        !isSelected && (sim.isTransitioning || sim.status === "selected") && "scale-95 opacity-50 blur-[1px]",
        "animate-fade-in-up"
      )}
      style={{ animationDelay: `${["choice-A","choice-B","choice-C"].indexOf(choice.id) * 0.12}s`, ...(isSelected ? { animationDelay: "0s", transition: "all 0.4s ease-out" } : {}) }}
    >
      <span className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {choice.id === "choice-A" ? "稳妥之路" : choice.id === "choice-B" ? "冒险之路" : "内心之路"}
      </span>
      <h3 className="mb-2 text-lg font-semibold leading-tight">{choice.label}</h3>
      <p className="mb-3 flex-1 text-sm leading-relaxed text-muted-foreground">{choice.description}</p>
      <p className="text-xs italic text-muted-foreground/70">{choice.hint}</p>
      {isPending && (
        <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-background/10 backdrop-blur-[1px]">
          <span className="rounded-full bg-emerald-500/80 px-4 py-1.5 text-sm font-medium text-white shadow-lg">已预选</span>
        </div>
      )}
      {isSelected && (
        <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-background/30 backdrop-blur-[1px]">
          <span className="rounded-full bg-emerald-500 px-4 py-1.5 text-sm font-medium text-white shadow-lg">你选择了这条路</span>
        </div>
      )}
    </button>
  );
}

function UndoIcon() { return <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 4h10a4 4 0 010 8H4" /><path d="M5 1L2 4l3 3" /></svg>; }
function CheckIcon() { return <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 8l3 3 7-7" /></svg>; }
