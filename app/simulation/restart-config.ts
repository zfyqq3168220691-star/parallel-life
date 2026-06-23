"use client";

import type { SimulationConfig } from "./_shared/useSimulation";

export function buildRestartConfig(): SimulationConfig {
  return {
    mode: "restart",
    totalEvents: 14,
    summaryRoute: "/summary",
    progressLabel: "重启人生",
    progressColor: "primary",
    hasNarrativeMode: true,
    markDivergence: true,

    persistSession: (_events, choices, currentIndex, isComplete) => {
      const sessionRaw = localStorage.getItem("parallel-life-session");
      if (!sessionRaw) return;
      try {
        const session = JSON.parse(sessionRaw);
        if (session.paths?.["path-A"]) {
          session.paths["path-A"].choices = choices;
          session.currentEventIndex = isComplete ? 14 : currentIndex;
          session.status = isComplete ? "completed" : "active";
          localStorage.setItem("parallel-life-session", JSON.stringify(session));
        }
      } catch { /* ignore */ }
    },

    buildAPIRequest: ({ dna, formData, eventIndex, previousChoices, narrativeState, characterName }) => {
      const bgMode = localStorage.getItem("parallel-life-background-mode") || "fixed";
      const bgDesc = localStorage.getItem("parallel-life-background-description") || "";
      const canonRaw = localStorage.getItem("parallel-life-canon-events");
      const canonEvents = (() => {
        if (!canonRaw) return [];
        try { return JSON.parse(canonRaw); } catch { return []; }
      })();
      const divIdx = parseInt(localStorage.getItem("parallel-life-divergence-index") || "-1", 10);
      const altChoice = localStorage.getItem("parallel-life-alternative-choice") || "";
      const divSummary = localStorage.getItem("parallel-life-divergence-summary") || "";

      return {
        summary: dna.summary,
        traits: dna.traits,
        motivations: dna.motivations,
        birthDate: formData.birthDate || "",
        birthPlace: formData.birthPlace || "",
        school: formData.school || "",
        major: formData.major || "",
        career: formData.career || "",
        dream: formData.dream || "",
        income: formData.income || "",
        mode: "restart",
        backgroundMode: bgMode,
        backgroundDescription: bgDesc,
        canonEvents,
        divergenceIndex: divIdx,
        alternativeChoice: altChoice,
        narrativeState,
        divergenceChoiceSummary: divSummary,
        characterName,
        eventIndex,
        totalEvents: 14,
        previousChoices: previousChoices.map((c) => ({
          age: c.age,
          title: c.eventTitle,
          chosen: c.chosenLabel,
          isDivergence: c.isDivergence,
        })),
      };
    },
  };
}
