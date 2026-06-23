"use client";

import type { SimulationConfig } from "@/app/simulation/_shared/useSimulation";
import type { FutureSession } from "@/types/future";
import { useFutureLabStore } from "@/stores/future-lab-store";

export function buildFutureConfig(): SimulationConfig {
  const store = useFutureLabStore.getState();

  return {
    mode: "future",
    totalEvents: 14,
    summaryRoute: "/future/summary",
    progressLabel: "未来探索",
    progressColor: "emerald",
    hasNarrativeMode: false,
    markDivergence: false,

    buildAPIRequest: ({ dna, formData, eventIndex, previousChoices, narrativeState, characterName }) => {
      const st = useFutureLabStore.getState();
      return {
        summary: dna.summary,
        traits: dna.traits,
        motivations: dna.motivations || [],
        birthDate: formData.birthDate || "",
        birthPlace: formData.birthPlace || "未知",
        school: formData.school || "",
        major: formData.major || "",
        career: formData.career || "",
        dream: formData.dream || "",
        income: formData.income || "",
        mode: "future",
        backgroundMode: "fixed",
        backgroundDescription: "",
        canonEvents: [],
        divergenceIndex: -1,
        alternativeChoice: "",
        narrativeState,
        divergenceChoiceSummary: "",
        characterName,
        futureBranch: st.selectedBranch,
        confusion: st.userConfusion,
        currentAge: (() => {
          const userRaw = localStorage.getItem("future-user-data");
          if (userRaw) {
            try {
              const u = JSON.parse(userRaw);
              if (u.age) return parseInt(u.age, 10) || 21;
            } catch { /* ignore */ }
          }
          const bd = formData.birthDate;
          if (!bd) return 21;
          const birth = new Date(bd);
          const now = new Date();
          let a = now.getFullYear() - birth.getFullYear();
          const m = now.getMonth() - birth.getMonth();
          if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) a--;
          return a;
        })(),
        eventIndex,
        totalEvents: 14,
        previousChoices: previousChoices.map((c) => ({
          age: c.age,
          title: c.eventTitle,
          chosen: c.chosenLabel,
        })),
      };
    },

    /** 持久化 future-session 到 localStorage */
    persistSession: (events, choices, currentIndex, isComplete) => {
      const st = useFutureLabStore.getState();
      const existingRaw = localStorage.getItem("future-session");
      let session: FutureSession;

      if (existingRaw) {
        session = JSON.parse(existingRaw);
      } else {
        session = {
          selectedBranch: st.selectedBranch!,
          mainEvents: [],
          mainChoices: [],
          totalMainEvents: 14,
          mainEventIndex: 0,
          reForkUsed: false,
          status: "in_progress",
          createdAt: new Date().toISOString(),
        };
      }

      session.mainEvents = events;
      session.mainChoices = choices;
      session.mainEventIndex = currentIndex;
      if (isComplete) {
        session.status = "completed";
        session.completedAt = new Date().toISOString();
      }

      localStorage.setItem("future-session", JSON.stringify(session));
      st.buildSession({
        mainEvents: events,
        mainChoices: choices,
        totalMainEvents: 14,
        mainEventIndex: currentIndex,
        reForkUsed: false,
        status: isComplete ? "completed" : "in_progress",
      });
    },
  };
}
