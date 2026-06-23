"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useFutureLabStore } from "@/stores/future-lab-store";
import type { LifeDNA } from "@/types";
import type { FutureSummaryResponse, FutureSession } from "@/types/future";

export default function FutureSummaryPage() {
  const router = useRouter();
  const userConfusion = useFutureLabStore((s) => s.userConfusion);

  const [dna, setDna] = useState<LifeDNA | null>(null);
  const [session, setSession] = useState<FutureSession | null>(null);
  const [summary, setSummary] = useState<FutureSummaryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const dnaRaw = localStorage.getItem("parallel-life-dna");
    const sessionRaw = localStorage.getItem("future-session");

    if (!dnaRaw || !sessionRaw) {
      router.replace("/future/onboarding");
      return;
    }

    try {
      const parsedDna: LifeDNA = JSON.parse(dnaRaw);
      const parsedSession: FutureSession = JSON.parse(sessionRaw);
      setDna(parsedDna);
      setSession(parsedSession);

      fetch("/api/generate-future-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lifeDNA: {
            summary: parsedDna.summary,
            traits: parsedDna.traits,
            lifeTheme: parsedDna.lifeTheme,
          },
          selectedBranch: parsedSession.selectedBranch,
          confusion: userConfusion || "",
          mainChoices: parsedSession.mainChoices.map((c) => ({
            age: c.age, title: c.eventTitle, chosen: c.chosenLabel,
          })),
          reForkUsed: parsedSession.reForkUsed,
          reForkBranch: parsedSession.reForkBranch
            ? { name: parsedSession.reForkBranch.name, tagline: parsedSession.reForkBranch.tagline }
            : undefined,
          reForkChoices: parsedSession.reForkChoices?.map((c) => ({
            age: c.age, title: c.eventTitle, chosen: c.chosenLabel,
          })) || [],
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) throw new Error(data.error);
          setSummary(data);
        })
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    } catch {
      router.replace("/future/onboarding");
    }
  }, [router, userConfusion]);

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <svg className="h-8 w-8 animate-spin text-emerald-400" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-sm text-muted-foreground">正在生成探索回顾...</p>
        </div>
      </div>
    );
  }

  if (error || !summary || !dna || !session) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4">
        <span className="text-5xl">🔮</span>
        <h1 className="mt-4 text-2xl font-bold">生成失败</h1>
        <p className="mt-2 text-muted-foreground">{error || "无法加载探索总结"}</p>
        <Button className="mt-6" onClick={() => router.push("/future/onboarding")}>重新开始</Button>
      </div>
    );
  }

  const s = summary;
  const branch = session.selectedBranch;

  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden px-4 py-12 sm:py-16">
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute left-1/2 top-[10%] h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-gradient-to-b from-emerald-500/5 via-emerald-500/2 to-transparent blur-3xl" />
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)", backgroundSize: "64px 64px" }} />
      </div>

      <div className="relative z-10 mx-auto max-w-2xl">
        {/* 页头 */}
        <div className="mb-10 text-center animate-fade-in-up">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/15 bg-emerald-500/5 px-4 py-1.5 text-sm text-emerald-400/80 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />未来探索回顾
          </div>
          <h1 className="mb-3 text-3xl font-bold tracking-tight">{s.identity.oneLiner || dna.lifeTheme}</h1>
          <div className="flex flex-wrap justify-center gap-2">
            {s.identity.keywords.map((kw) => (
              <span key={kw} className="rounded-full border border-emerald-500/15 bg-emerald-500/5 px-3 py-0.5 text-xs text-emerald-400/70">{kw}</span>
            ))}
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            路线：「{branch.name}」· {session.mainChoices.length} 次选择
          </p>
        </div>

        {/* 路径展示 */}
        <div className="mb-8 animate-fade-in-up animate-delay-200">
          <h2 className="mb-4 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">你探索的路</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <PathCard path={s.mainPath} color="emerald" />
            {s.reForkPath && <PathCard path={s.reForkPath} color="amber" />}
          </div>
        </div>

        {/* 终局叙事 */}
        <Card className="mb-8 border-emerald-500/10 bg-emerald-500/5 backdrop-blur-sm animate-fade-in-up animate-delay-300">
          <CardContent className="p-6 sm:p-8">
            <div className="mb-3 flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-emerald-400/60" />
              <span className="text-xs font-medium uppercase tracking-wider text-emerald-400/60">回顾这段探索</span>
            </div>
            <p className="text-base leading-relaxed text-foreground/85">{s.finaleNarrative}</p>
          </CardContent>
        </Card>

        {/* 数字卡片 */}
        <div className="mb-8 grid grid-cols-2 gap-3 animate-fade-in-up animate-delay-400">
          {s.stats.slice(0, 4).map((stat, i) => (
            <Card key={i} className="border-border/20 bg-card/30 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <p className="text-xl font-bold text-emerald-400/80">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 时间线 */}
        <div className="mb-8 animate-fade-in-up animate-delay-500">
          <h2 className="mb-4 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">探索路径</h2>
          <Card className="border-border/20 bg-card/30 backdrop-blur-sm">
            <CardContent className="p-4 sm:p-6">
              <div className="relative">
                <div className="absolute left-[15px] top-2 bottom-2 w-px bg-border/20" />
                <div className="space-y-1">
                  {session.mainChoices.map((c, i) => (
                    <div key={i} className="relative flex items-start gap-3 pb-2.5">
                      <div className="relative z-10 mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-400/40" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline gap-2">
                          <span className="text-xs font-semibold">{c.age}岁</span>
                          <span className="text-xs text-muted-foreground">{c.eventTitle}</span>
                        </div>
                        <p className="text-[11px] text-emerald-400/60">→ {c.chosenLabel}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 操作栏 */}
        <div className="flex flex-col items-center gap-4 pt-4 animate-fade-in-up animate-delay-600">
          <p className="text-xs text-muted-foreground">一份可能性探索的记录，没有对错，只有方向</p>
          <div className="flex gap-3">
            <Button variant="outline" size="lg" render={<Link href="/future/onboarding">再来一次</Link>} />
            <Button size="lg" className="h-11 px-8" onClick={() => {
              const text = `${summary.identity.oneLiner}\n\n${summary.finaleNarrative}\n\n${summary.stats.map(st => `${st.value} ${st.label}`).join(" · ")}`;
              navigator.clipboard.writeText(text).then(() => alert("已复制到剪贴板")).catch(() => {});
            }}>分享</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== 路径卡片 =====
function PathCard({ path, color }: { path: { name: string; nodes: { age: number; event: string }[] }; color: "emerald" | "amber" }) {
  const classes = color === "emerald"
    ? { border: "border-emerald-500/10", bg: "bg-emerald-500/5", dot: "bg-emerald-400/50", text: "text-emerald-400/70" }
    : { border: "border-amber-500/10", bg: "bg-amber-500/5", dot: "bg-amber-400/50", text: "text-amber-400/70" };

  return (
    <Card className={`border ${classes.border} ${classes.bg} backdrop-blur-sm`}>
      <CardContent className="p-4 sm:p-5">
        <div className={`mb-3 text-xs font-medium uppercase tracking-wider ${classes.text}`}>{path.name}</div>
        <div className="space-y-2">
          {path.nodes.map((n, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${classes.dot}`} />
              <div className="flex items-baseline gap-2">
                <span className="text-xs font-mono text-muted-foreground/50">{n.age}岁</span>
                <span className="text-sm">{n.event}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
