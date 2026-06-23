"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { LifeDNA } from "@/types";

export default function ModelingPage() {
  const router = useRouter();
  const [dna, setDna] = useState<LifeDNA | null>(null);
  const [mode, setMode] = useState<string>("restart");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const dnaRaw = localStorage.getItem("parallel-life-dna");
    const modeRaw = localStorage.getItem("parallel-life-mode");
    if (!dnaRaw) { setLoading(false); return; }
    try {
      setDna(JSON.parse(dnaRaw));
      if (modeRaw) setMode(modeRaw);
    } catch { /* ignore */ }
    setLoading(false);
  }, []);

  function startSimulation() {
    const session = {
      mode,
      lifeDNA: dna,
      paths: {
        "path-A": { isChosen: true, events: [], choices: [], currentAge: 0 },
        "path-B": { isChosen: false, events: [], choices: [], currentAge: 0 },
        "path-C": { isChosen: false, events: [], choices: [], currentAge: 0 },
      },
      currentEventIndex: 0,
      totalEvents: 14,
      status: "idle",
    };
    localStorage.setItem("parallel-life-session", JSON.stringify(session));
    router.push("/simulation");
  }

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <svg className="h-6 w-6 animate-spin text-primary" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }

  if (!dna) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4">
        <div className="max-w-md text-center">
          <span className="text-5xl">🧬</span>
          <h1 className="mt-4 text-2xl font-bold">暂无人生画像</h1>
          <p className="mt-2 text-muted-foreground">你需要先填写人生信息，生成 Life DNA。</p>
          <Button className="mt-6" render={<Link href="/onboarding">去填写信息</Link>} />
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden px-4 py-12 sm:py-16">
      {/* 背景 */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute left-1/2 top-[20%] h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-gradient-to-b from-primary/6 via-primary/2 to-transparent blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-2xl">
        {/* ========== 页头 ========== */}
        <div className="mb-10 text-center animate-fade-in-up">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary/80 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            {mode === "restart" ? "重启人生" : "未来推演"}
          </div>
          <h1 className="mb-2 text-3xl font-bold tracking-tight">你的 Life DNA</h1>
          <p className="text-muted-foreground">一份基于你的人生数据生成的深度心理画像</p>
        </div>

        {/* ========== 1. Summary ========== */}
        <Card className="mb-5 border-primary/10 bg-card/40 backdrop-blur-sm animate-fade-in-up animate-delay-200">
          <CardContent className="p-6 sm:p-8">
            <p className="text-lg leading-relaxed text-foreground/90">{dna.summary}</p>
          </CardContent>
        </Card>

        {/* ========== 2. 人格原型 ========== */}
        <Card className="mb-5 border-border/20 bg-card/30 backdrop-blur-sm animate-fade-in-up animate-delay-250">
          <CardContent className="p-5 sm:p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-2xl">
                🎭
              </div>
              <div className="min-w-0">
                <h3 className="mb-0.5 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  人格原型
                </h3>
                <p className="text-xl font-bold text-primary/90">{dna.archetype?.name || "—"}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {dna.archetype?.description || "—"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ========== 3. 人生母题 ========== */}
        <Card className="mb-5 border-border/20 bg-card/30 backdrop-blur-sm animate-fade-in-up animate-delay-300">
          <CardContent className="p-5 sm:p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-2xl">
                ✦
              </div>
              <div className="min-w-0">
                <h3 className="mb-1 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  人生母题
                </h3>
                <p className="text-lg italic leading-relaxed text-foreground/85">
                  "{dna.lifeTheme || "—"}"
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ========== 4. 核心特质 ========== */}
        <div className="mb-5 animate-fade-in-up animate-delay-350">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            核心特质
          </h3>
          <div className="flex flex-wrap gap-2">
            {(dna.traits || []).map((trait) => (
              <span
                key={trait}
                className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1.5 text-sm text-primary/90"
              >
                {trait}
              </span>
            ))}
          </div>
        </div>

        {/* ========== 5. 内在驱动力 ========== */}
        <div className="mb-5 animate-fade-in-up animate-delay-400">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            内在驱动力
          </h3>
          <div className="space-y-2">
            {(dna.motivations || []).map((m, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-lg border border-border/20 bg-card/30 p-3.5"
              >
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs text-primary">
                  {i + 1}
                </span>
                <span className="text-sm text-foreground/80">{m}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ========== 6. 内在行为模式 ========== */}
        <div className="mb-5 animate-fade-in-up animate-delay-450">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            你可能没意识到的行为模式
          </h3>
          <div className="space-y-3">
            {(dna.innerPatterns || []).map((pattern, i) => (
              <Card key={i} className="border-border/15 bg-card/25">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-xs font-medium text-amber-400">
                      {i + 1}
                    </span>
                    <p className="text-sm leading-relaxed text-foreground/75">{pattern}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* ========== 7. 成长边界 ========== */}
        <div className="mb-10 animate-fade-in-up animate-delay-500">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            成长边界与突破方向
          </h3>
          <div className="space-y-3">
            {(dna.growthEdge || []).map((edge, i) => (
              <Card key={i} className="border-border/15 bg-card/25">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-xs font-medium text-emerald-400">
                      {i + 1}
                    </span>
                    <p className="text-sm leading-relaxed text-foreground/75">{edge}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* ========== CTA ========== */}
        <div className="flex flex-col items-center gap-3 animate-fade-in-up animate-delay-600">
          <Button
            size="lg"
            className="group h-14 gap-2 overflow-hidden rounded-xl px-10 text-base font-semibold shadow-lg shadow-primary/20 transition-all hover:scale-105 hover:shadow-xl hover:shadow-primary/30"
            onClick={startSimulation}
          >
            <span className="relative z-10 flex items-center gap-2">
              开始人生推演
              <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
            <div className="absolute inset-0 -z-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </Button>
          <span className="text-xs text-muted-foreground">
            你将面临 5 个关键人生事件，每次做出选择后，未选的道路也会被记录
          </span>
        </div>
      </div>
    </div>
  );
}
