"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useFutureLabStore } from "@/stores/future-lab-store";
import type { LifeDNA } from "@/types";
import type { FutureInsight, InsightSignal, FutureUserState } from "@/types/future";

export default function FutureInsightPage() {
  const router = useRouter();
  const store = useFutureLabStore();

  const [dna, setDna] = useState<LifeDNA | null>(null);
  const [userState, setUserState] = useState<FutureUserState | null>(null);
  const [insight, setInsight] = useState<FutureInsight | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!store.userConfusion) {
      router.replace("/future/onboarding");
      return;
    }

    const dnaRaw = localStorage.getItem("parallel-life-dna");
    const formRaw = localStorage.getItem("parallel-life-form");
    const userRaw = localStorage.getItem("future-user-data");
    const bgDescRaw = localStorage.getItem("parallel-life-background-description");
    const canonRaw = localStorage.getItem("parallel-life-canon-events");
    const divSummaryRaw = localStorage.getItem("parallel-life-divergence-summary");
    const sessionRaw = localStorage.getItem("future-session") || localStorage.getItem("parallel-life-session");

    if (!dnaRaw && !userRaw) {
      router.replace("/future/onboarding");
      return;
    }

    const parsedDna: LifeDNA | null = dnaRaw ? JSON.parse(dnaRaw) : null;
    const parsedForm: Record<string, string> = formRaw ? JSON.parse(formRaw) : {};
    const parsedUser: Record<string, string> = userRaw ? JSON.parse(userRaw) : {};
    setDna(parsedDna);

    // 计算年龄
    const birthDate = parsedForm.birthDate || "2000-01-01";
    const birth = new Date(birthDate);
    const now = new Date();
    let age = now.getFullYear() - birth.getFullYear();
    const m = now.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;

    // 优先使用 future-user-data，回退到 parallel-life-form
    const effectiveData = {
      age: parsedUser.age ? parseInt(parsedUser.age, 10) : age,
      career: parsedUser.career || parsedForm.career || "",
      school: parsedUser.school || parsedForm.school || "",
      major: parsedUser.major || parsedForm.major || "",
      dream: parsedUser.dream || parsedForm.dream || "",
      birthPlace: parsedForm.birthPlace || "",
      income: parsedForm.income || "",
    };

    // 构建 userState
    const state: FutureUserState = {
      age: effectiveData.age,
      career: effectiveData.career,
      school: effectiveData.school,
      major: effectiveData.major,
      city: effectiveData.birthPlace,
      dream: effectiveData.dream,
      income: effectiveData.income,
      confusion: store.userConfusion,
    };
    setUserState(state);

    // 构建 history
    let canonEvents: { age: string; title: string; description: string }[] = [];
    if (canonRaw) {
      try { canonEvents = JSON.parse(canonRaw); } catch { /* ignore */ }
    }

    let choiceHistory: { age: number; title: string; chosen: string; isDivergence?: boolean }[] = [];
    if (sessionRaw) {
      try {
        const session = JSON.parse(sessionRaw);
        if (session.mainChoices) {
          choiceHistory = session.mainChoices.map((c: { age: number; title: string; chosen: string; isDivergence?: boolean }) => ({
            age: c.age,
            title: c.title,
            chosen: c.chosen,
            isDivergence: c.isDivergence,
          }));
        }
      } catch { /* ignore */ }
    }

    // 调用真实 API
    async function fetchInsight() {
      try {
        const res = await fetch("/api/generate-future-insight", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lifeDNA: {
              summary: parsedDna?.summary || "用户暂未生成 Life DNA，请基于 userState 分析。",
              traits: parsedDna?.traits || [],
              lifeTheme: parsedDna?.lifeTheme || "",
            },
            currentState: {
              age: effectiveData.age,
              career: effectiveData.career,
              school: effectiveData.school,
              major: effectiveData.major,
              dream: effectiveData.dream,
              confusion: store.userConfusion,
              income: effectiveData.income,
            },
            history: {
              backgroundDescription: bgDescRaw || "",
              canonEvents,
              divergenceChoiceSummary: divSummaryRaw || "",
              choiceHistory,
            },
          }),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => null);
          throw new Error(errData?.error || `API 返回错误: ${res.status}`);
        }

        const json = await res.json();
        setInsight(json.insight);
        store.setInsight(json.insight);
      } catch (e) {
        console.error("[future-insight] API 调用失败:", e);
        setError(e instanceof Error ? e.message : "生成洞察失败，请重试");
      } finally {
        setLoading(false);
      }
    }

    fetchInsight();
  }, [router, store]);

  function handleNext() {
    router.push("/future/branches");
  }

  // ===== Loading =====
  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="flex max-w-md flex-col items-center gap-4 text-center">
          <svg className="h-10 w-10 animate-spin text-emerald-400" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-lg font-medium">AI 正在分析你的现状...</p>
          <p className="text-sm text-muted-foreground">
            基于你的经历、决策模式和当下处境，生成专属洞察
          </p>
        </div>
      </div>
    );
  }

  // ===== Error =====
  if (error) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="flex max-w-md flex-col items-center gap-4 text-center">
          <p className="text-lg font-medium text-destructive">出错了</p>
          <p className="text-sm text-muted-foreground">{error}</p>
          <button
            onClick={() => router.push("/future/onboarding")}
            className="text-sm text-primary underline"
          >
            返回重新填写
          </button>
        </div>
      </div>
    );
  }

  if (!userState || !insight) return null;

  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden px-4 py-12 sm:py-16">
      {/* 背景 */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute left-1/2 top-[10%] h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-gradient-to-b from-emerald-500/5 via-emerald-500/2 to-transparent blur-3xl" />
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
        {/* ===== 页头 ===== */}
        <div className="mb-8 text-center animate-fade-in-up">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-4 py-1.5 text-sm text-emerald-400/80 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            AI 洞察报告
          </div>
          <h1 className="mb-2 text-2xl font-bold tracking-tight sm:text-3xl">
            关于你的分析
          </h1>
          <p className="text-sm text-muted-foreground">
            系统基于你的数据生成了这份报告。不预测未来，只展开可能性。
          </p>
        </div>

        {/* ===== 1. 用户画像 ===== */}
        <Card className="mb-4 border-border/20 bg-card/30 backdrop-blur-sm animate-fade-in-up animate-delay-200">
          <CardContent className="p-5 sm:p-6">
            <div className="mb-3 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs text-primary/70">
                1
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-primary/70">
                用户画像
              </span>
            </div>

            {/* 基本信息 */}
            <div className="mb-4 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-muted-foreground">
              <span>{userState.age}岁</span>
              <span className="text-border/50">|</span>
              <span>{userState.school}</span>
              <span className="text-border/50">|</span>
              <span>{userState.major}</span>
              <span className="text-border/50">|</span>
              <span>{userState.city}</span>
            </div>

            {/* DNA 摘要 */}
            {dna && (
              <>
                <div className="mb-3 rounded-lg border border-primary/10 bg-primary/5 p-4">
                  <p className="text-sm leading-relaxed text-foreground/85">{dna.summary}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                      {dna.traits.map((t: string) => (
                    <span
                      key={t}
                      className="rounded-full border border-border/30 bg-card/50 px-3 py-0.5 text-xs text-muted-foreground"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* ===== 2. 当前困惑 ===== */}
        <Card className="mb-6 border-amber-500/10 bg-amber-500/5 backdrop-blur-sm animate-fade-in-up animate-delay-250">
          <CardContent className="p-5 sm:p-6">
            <div className="mb-3 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/10 text-xs text-amber-400/70">
                2
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-400/70">
                当前困惑
              </span>
            </div>

            <div className="mb-3 rounded-lg border border-amber-500/10 bg-amber-500/5 p-4">
              <p className="text-sm font-medium leading-relaxed text-foreground/90">
                「{store.userConfusion}」
              </p>
            </div>

            <p className="text-xs leading-relaxed text-muted-foreground">
              这个问题是你未来 3-5 年的核心张力。以下洞察围绕它展开。系统将在下一步基于这些洞察为你生成具体的未来路线。
            </p>
          </CardContent>
        </Card>

        {/* ===== 3. AI 洞察 ===== */}
        <div className="mb-8 space-y-4 animate-fade-in-up animate-delay-300">
          <div className="mb-2 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/10 text-xs text-emerald-400/70">
              3
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400/70">
              AI 分析依据
            </span>
          </div>

          {/* 经历信号 */}
          <SignalCard
            title="你的经历显示"
            icon="📖"
            color="blue"
            signals={insight.experienceSignals}
          />

          {/* 倾向信号 */}
          <SignalCard
            title="你的选择倾向显示"
            icon="📊"
            color="purple"
            signals={insight.patternSignals}
          />

          {/* 现状信号 */}
          <SignalCard
            title="你的当前处境显示"
            icon="📍"
            color="amber"
            signals={insight.situationSignals}
          />

          {/* 收束语 */}
          <Card className="border-primary/10 bg-primary/5 backdrop-blur-sm">
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <span className="text-lg shrink-0 mt-0.5">💡</span>
                <div>
                  <p className="text-xs font-medium text-primary/60 uppercase tracking-wider mb-1">
                    系统观察
                  </p>
                  <p className="text-sm leading-relaxed text-foreground/80">
                    {insight.summary}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ===== 操作栏 ===== */}
        <div className="flex flex-col items-center gap-3 animate-fade-in-up animate-delay-500">
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="lg"
              onClick={() => router.push("/future/onboarding")}
            >
              ← 修改困惑
            </Button>
            <Button size="lg" className="h-11 min-w-[180px] px-8" onClick={handleNext}>
              查看未来路线 →
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            下一步：基于以上洞察，系统将为你生成专属的未来路线
          </p>
        </div>
      </div>
    </div>
  );
}

// ===== 子组件 =====

/** 信号卡片 */
function SignalCard({
  title,
  icon,
  color,
  signals,
}: {
  title: string;
  icon: string;
  color: "blue" | "purple" | "amber";
  signals: InsightSignal[];
}) {
  const colorMap = {
    blue: {
      border: "border-blue-500/10",
      bg: "bg-blue-500/5",
      bar: "bg-blue-500/30",
      dot: "bg-blue-400/60",
      text: "text-blue-400/70",
    },
    purple: {
      border: "border-purple-500/10",
      bg: "bg-purple-500/5",
      bar: "bg-purple-500/30",
      dot: "bg-purple-400/60",
      text: "text-purple-400/70",
    },
    amber: {
      border: "border-amber-500/10",
      bg: "bg-amber-500/5",
      bar: "bg-amber-500/30",
      dot: "bg-amber-400/60",
      text: "text-amber-400/70",
    },
  };

  const c = colorMap[color];

  return (
    <Card className={`border ${c.border} ${c.bg} backdrop-blur-sm`}>
      <CardContent className="p-5">
        <div className="mb-4 flex items-center gap-2">
          <span>{icon}</span>
          <span className={`text-xs font-semibold uppercase tracking-wider ${c.text}`}>
            {title}
          </span>
        </div>
        <div className="space-y-3">
          {signals.map((signal, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${c.dot}`} />
              <div className="min-w-0 flex-1">
                <p className="text-sm leading-relaxed text-foreground/80">{signal.text}</p>
                {signal.reference && (
                  <span className="mt-1 inline-block text-[10px] text-muted-foreground/50">
                    来源：{signal.reference}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
