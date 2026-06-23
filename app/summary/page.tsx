"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { LifeDNA, ChosenChoice } from "@/types";

interface SummaryData {
  finaleNarrative: string;
  pathA: { age: number; description: string }[];
  pathB: { age: number; description: string }[];
  stats: string[];
}

export default function SummaryPage() {
  const router = useRouter();

  const [dna, setDna] = useState<LifeDNA | null>(null);
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [choices, setChoices] = useState<ChosenChoice[]>([]);
  const [divergenceSummary, setDivergenceSummary] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const dnaRaw = localStorage.getItem("parallel-life-dna");
    const sessionRaw = localStorage.getItem("parallel-life-session");
    const divSummary = localStorage.getItem("parallel-life-divergence-summary") || "";
    const altChoice = localStorage.getItem("parallel-life-alternative-choice") || "";
    const mode = localStorage.getItem("parallel-life-mode") || "restart";
    const bgMode = localStorage.getItem("parallel-life-background-mode") || "fixed";

    if (!dnaRaw || !sessionRaw) {
      router.replace("/onboarding");
      return;
    }

    const parsedDna: LifeDNA = JSON.parse(dnaRaw);
    const session = JSON.parse(sessionRaw);
    const allChoices: ChosenChoice[] = session.paths?.["path-A"]?.choices || [];

    setDna(parsedDna);
    setChoices(allChoices);
    setDivergenceSummary(divSummary);

    fetch("/api/generate-life-summary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        summary: parsedDna.summary,
        traits: parsedDna.traits,
        lifeTheme: parsedDna.lifeTheme,
        divergenceChoiceSummary: divSummary || undefined,
        alternativeChoice: altChoice || undefined,
        mode,
        backgroundMode: bgMode,
        allChoices: allChoices.map((c) => ({
          age: c.age,
          title: c.eventTitle,
          chosen: c.chosenLabel,
          isDivergence: c.isDivergence,
        })),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setSummary(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [router]);

  const hasDivergence = divergenceSummary && choices.some((c) => c.isDivergence);

  // ===== Loading =====
  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <svg className="h-8 w-8 animate-spin text-primary" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-sm text-muted-foreground">正在生成你的人生回顾...</p>
        </div>
      </div>
    );
  }

  // ===== Error =====
  if (error || !summary || !dna) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4">
        <div className="max-w-md text-center">
          <span className="text-5xl">📜</span>
          <h1 className="mt-4 text-2xl font-bold">生成失败</h1>
          <p className="mt-2 text-muted-foreground">{error || "无法加载人生总结"}</p>
          <Button className="mt-6" onClick={() => router.push("/onboarding")}>
            重新开始
          </Button>
        </div>
      </div>
    );
  }

  // ===== Summary Content =====
  const isNarrative = choices.some((c) => c.chosenLabel && c.chosenLabel.includes("真实人生"));

  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden px-4 py-12 sm:py-16">
      {/* 背景 */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute left-1/2 top-[10%] h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-gradient-to-b from-primary/5 via-primary/2 to-transparent blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-2xl">
        {/* ===== 1. Identity Card ===== */}
        <div className="mb-10 text-center animate-fade-in-up">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-4 py-1.5 text-sm text-primary/80 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            人生回顾
          </div>
          <h1 className="mb-3 text-3xl font-bold tracking-tight">
            {dna.lifeTheme}
          </h1>
          <p className="text-muted-foreground">
            {dna.traits.slice(0, 3).join(" · ")}
            {hasDivergence && divergenceSummary && (
              <span className="block mt-1 text-sm italic text-primary/60">
                {divergenceSummary}
              </span>
            )}
          </p>
        </div>

        {/* ===== 2. Path Comparison ===== */}
        {hasDivergence && summary.pathA.length > 0 && summary.pathB.length > 0 && (
          <div className="mb-8 animate-fade-in-up animate-delay-200">
            <h2 className="mb-4 text-center text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              两条路径，不同的可能性
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Path A */}
              <Card className="border-border/20 bg-card/30 backdrop-blur-sm">
                <CardContent className="p-4 sm:p-5">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs text-muted-foreground">
                      A
                    </span>
                    <span className="text-xs font-medium text-muted-foreground">你走过的路</span>
                  </div>
                  <div className="space-y-2.5">
                    {summary.pathA.map((node, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <span className="text-xs font-mono text-muted-foreground/50 w-8 shrink-0">
                          {node.age}岁
                        </span>
                        <span className="text-sm">{node.description}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Path B */}
              <Card className="border-primary/10 bg-primary/5 backdrop-blur-sm">
                <CardContent className="p-4 sm:p-5">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/15 text-xs text-primary/80">
                      B
                    </span>
                    <span className="text-xs font-medium text-primary/70">你探索的路</span>
                  </div>
                  <div className="space-y-2.5">
                    {summary.pathB.map((node, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <span className="text-xs font-mono text-primary/50 w-8 shrink-0">
                          {node.age}岁
                        </span>
                        <span className="text-sm">{node.description}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* ===== 3. Timeline ===== */}
        <div className="mb-8 animate-fade-in-up animate-delay-300">
          <h2 className="mb-4 text-center text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            你的一生
          </h2>
          <Card className="border-border/20 bg-card/30 backdrop-blur-sm">
            <CardContent className="p-4 sm:p-6">
              <div className="relative">
                {/* 竖线 */}
                <div className="absolute left-[19px] top-2 bottom-2 w-px bg-border/30" />
                <div className="space-y-1">
                  {choices.map((c, i) => {
                    const isDiv = c.isDivergence;
                    const isPreDiv = isNarrative && !isDiv && i < choices.findIndex((x) => x.isDivergence);
                    const dotColor = isDiv
                      ? "bg-primary shadow-[0_0_8px_var(--primary)]"
                      : isPreDiv
                        ? "bg-amber-500/50"
                        : "bg-blue-400/40";

                    return (
                      <div key={i} className="relative flex items-start gap-4 pb-3">
                        {/* 时间点 */}
                        <div className={`relative z-10 mt-0.5 h-3 w-3 shrink-0 rounded-full ${dotColor}`} />

                        {/* 内容 */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-baseline gap-2">
                            <span className="text-sm font-semibold">{c.age}岁</span>
                            {isDiv && (
                              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary/80">
                                分岔点
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{c.eventTitle}</p>
                          <p className="text-xs text-foreground/70">→ {c.chosenLabel}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ===== 4. Finale Narrative ===== */}
        <Card className="mb-8 border-primary/10 bg-primary/5 backdrop-blur-sm animate-fade-in-up animate-delay-400">
          <CardContent className="p-6 sm:p-8">
            <div className="mb-3 flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-primary/60" />
              <span className="text-xs font-medium uppercase tracking-wider text-primary/60">回顾这条路</span>
            </div>
            <p className="text-base leading-relaxed text-foreground/85">
              {summary.finaleNarrative}
            </p>
          </CardContent>
        </Card>

        {/* ===== 5. Life Stats ===== */}
        <div className="mb-8 grid grid-cols-2 gap-3 animate-fade-in-up animate-delay-500">
          {summary.stats.slice(0, 4).map((stat, i) => (
            <Card key={i} className="border-border/20 bg-card/30 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <p className="text-lg font-bold text-primary/80">{stat}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ===== 6. Action Bar ===== */}
        <div className="flex flex-col items-center gap-4 pt-4 animate-fade-in-up animate-delay-600">
          <p className="text-xs text-muted-foreground">一份平行人生的记录，没有好坏，只有不同</p>
          <div className="flex gap-3">
            <Button variant="outline" size="lg" render={<Link href="/mode-select">再来一次</Link>} />
            <Button
              size="lg"
              className="h-11 px-8"
              onClick={() => {
                // 复制纯文本总结
                const text = `${dna.lifeTheme}\n\n${summary.finaleNarrative}\n\n${summary.stats.join("\n")}`;
                navigator.clipboard.writeText(text).then(() => alert("已复制到剪贴板")).catch(() => {});
              }}
            >
              分享这份人生
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
