"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useFutureLabStore } from "@/stores/future-lab-store";
import type { LifeDNA } from "@/types";
import type { FutureBranch, FutureUserState } from "@/types/future";

// ===== Mock Data（仅路线，不重新生成洞察） =====

interface MockBranchOnlyData {
  userState: FutureUserState;
  branches: FutureBranch[];
  comparison: string;
}

function buildMockBranches(
  dna: LifeDNA | null,
  confusion: string,
  formData: Record<string, string>
): MockBranchOnlyData {
  const birthDate = formData.birthDate || "2006-01-15";
  const birth = new Date(birthDate);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;

  return {
    userState: {
      age,
      career: formData.career || "student",
      school: formData.school || "东北大学",
      major: formData.major || "环境设计",
      city: formData.birthPlace || "济南",
      dream: formData.dream || "成为有创造力的人",
      income: formData.income || "below-50k",
      confusion,
    },

    branches: [
      {
        id: "branch-0",
        name: "先考研，争取三年缓冲和更高起点",
        tagline: "适合需要安全感的人",
        description:
          "用考研争取2-3年缓冲期。在研究生阶段补技能短板，同时探索自己在设计之外对什么感兴趣。学历焦虑会减轻——但时间成本真实存在。",
        preview: {
          nextStep: "锁定目标院校，开始系统备考",
          inThreeYears: "在读研，方向比本科时清晰得多",
          inFiveYears: "用硕士学历进入更好的平台",
        },
        basis: { experienceRef: 1, patternRef: 0, situationRef: 0 },
      },
      {
        id: "branch-1",
        name: "先就业，用真实项目校准方向",
        tagline: "适合需要真实反馈的人",
        description:
          "直接进入职场。在实践中发现自己擅长什么、不喜欢什么。起点可能不如预期——但三年后你比同龄研究生更清楚自己要什么。",
        preview: {
          nextStep: "准备作品集，投递春招岗位",
          inThreeYears: "独立负责项目，已验证了自己的方向",
          inFiveYears: "要么深耕，要么带着经验转行",
        },
        basis: { experienceRef: 1, patternRef: 1, situationRef: 1 },
      },
      {
        id: "branch-2",
        name: "gap半年，做出作品再决定",
        tagline: "适合不想被两条路锁死的人",
        description:
          "暂时不考研也不就业。用半年集中做作品——弄清自己到底想做什么样的创造。半年后带着作品集和更清晰的方向重新面对那两个选项。",
        preview: {
          nextStep: "规划半年的作品方向和生存预算",
          inThreeYears: "因为作品集出色，进入了想去的领域",
          inFiveYears: "在你热爱的方向上有了真正的积累",
        },
        basis: { experienceRef: 1, patternRef: 2, situationRef: 2 },
      },
    ],

    comparison:
      "三条路的本质差异不是你选哪个——是你付哪种代价。考研付时间，就业付起点，gap付安全感。没有对错。",
  };
}

// ============================================================

const branchIcons = ["📚", "💼", "🎨"];

export default function FutureBranchesPage() {
  const router = useRouter();
  const store = useFutureLabStore();

  const [dna, setDna] = useState<LifeDNA | null>(null);
  const [data, setData] = useState<MockBranchOnlyData | null>(null);
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // insight 必须存在（由 /future/insight 页面写入 store）
    if (!store.userConfusion) {
      router.replace("/future/onboarding");
      return;
    }
    if (!store.insight) {
      router.replace("/future/insight");
      return;
    }

    const dnaRaw = localStorage.getItem("parallel-life-dna");
    const formRaw = localStorage.getItem("parallel-life-form");
    const userRaw = localStorage.getItem("future-user-data");

    if (!dnaRaw && !userRaw) {
      router.replace("/future/onboarding");
      return;
    }

    const parsedDna: LifeDNA | null = dnaRaw ? JSON.parse(dnaRaw) : null;
    const parsedForm: Record<string, string> = formRaw ? JSON.parse(formRaw) : {};
    const parsedUser: Record<string, string> = userRaw ? JSON.parse(userRaw) : {};
    setDna(parsedDna);

    const effectiveData = {
      birthDate: parsedForm.birthDate || "",
      school: parsedUser.school || parsedForm.school || "",
      major: parsedUser.major || parsedForm.major || "",
      career: parsedUser.career || parsedForm.career || "",
      dream: parsedUser.dream || parsedForm.dream || "",
      birthPlace: parsedForm.birthPlace || "",
      income: parsedForm.income || "",
    };

    const timer = setTimeout(() => {
      setData(buildMockBranches(parsedDna, store.userConfusion, effectiveData));
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [router, store]);

  function handleSelect(branch: FutureBranch) {
    setSelectedBranchId(branch.id);
  }

  function handleConfirm() {
    if (!selectedBranchId || !data) return;
    const branch = data.branches.find((b) => b.id === selectedBranchId);
    if (!branch) return;

    store.selectBranch(branch);
    store.setBranches(data.branches, data.comparison);
    router.push("/future/simulation");
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
          <p className="text-lg font-medium">正在生成你的未来路线...</p>
          <p className="text-sm text-muted-foreground">
            基于你的经历、倾向和当下处境
          </p>
        </div>
      </div>
    );
  }

  if (!data || !store.insight) return null;

  const { userState, branches, comparison } = data;
  const insight = store.insight;

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
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            探索方向
          </div>
          <h1 className="mb-2 text-2xl font-bold tracking-tight sm:text-3xl">
            为你展开的可能路线
          </h1>
          <p className="text-sm text-muted-foreground">
            {userState.age}岁 · {userState.school} · {userState.major}
          </p>
        </div>

        {/* ===== 困惑回顾 ===== */}
        <Card className="mb-4 border-amber-500/10 bg-amber-500/5 backdrop-blur-sm animate-fade-in-up animate-delay-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 shrink-0 text-amber-400/60 text-sm">💭</span>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-amber-400/70 mb-1">你的困惑</p>
                <p className="text-sm leading-relaxed text-foreground/85">「{store.userConfusion}」</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ===== 洞察摘要（折叠） ===== */}
        <details className="mb-6 group animate-fade-in-up animate-delay-250">
          <summary className="flex cursor-pointer items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors">
            <svg
              className="h-3 w-3 transition-transform group-open:rotate-90"
              fill="none" viewBox="0 0 16 16"
              stroke="currentColor" strokeWidth="2"
            >
              <path d="M6 4l4 4-4 4" />
            </svg>
            为什么是这些路线？
          </summary>
          <div className="mt-3 space-y-2 rounded-lg border border-border/20 bg-card/20 p-4">
            <p className="text-xs leading-relaxed text-muted-foreground">{insight.summary}</p>
            <div className="flex flex-wrap gap-1.5">
              {insight.experienceSignals.slice(0, 1).map((s, i) => (
                <span key={i} className="rounded-full border border-border/20 bg-card/50 px-2 py-0.5 text-[11px] text-muted-foreground">
                  {s.reference}
                </span>
              ))}
              {insight.patternSignals.slice(0, 2).map((s, i) => (
                <span key={i} className="rounded-full border border-border/20 bg-card/50 px-2 py-0.5 text-[11px] text-muted-foreground">
                  {s.reference}
                </span>
              ))}
              {insight.situationSignals.slice(0, 1).map((s, i) => (
                <span key={i} className="rounded-full border border-border/20 bg-card/50 px-2 py-0.5 text-[11px] text-muted-foreground">
                  {s.reference}
                </span>
              ))}
            </div>
          </div>
        </details>

        {/* ===== 对比语 ===== */}
        <p className="mb-3 text-center text-xs text-muted-foreground animate-fade-in-up animate-delay-300">
          {comparison}
        </p>

        {/* ===== 路线卡片 ===== */}
        <div className="space-y-4 animate-fade-in-up animate-delay-300">
          {branches.map((branch, i) => {
            const isSelected = selectedBranchId === branch.id;
            return (
              <button
                key={branch.id}
                type="button"
                onClick={() => handleSelect(branch)}
                className={`relative w-full rounded-2xl border p-5 sm:p-6 text-left transition-all duration-300 ${
                  isSelected
                    ? "border-emerald-500/40 bg-emerald-500/5 ring-1 ring-emerald-500/20 shadow-xl shadow-emerald-500/5 scale-[1.01]"
                    : "border-border/20 bg-card/30 hover:border-border/40 hover:bg-card/40 hover:scale-[1.005]"
                }`}
              >
                {isSelected && (
                  <div className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/20">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-emerald-400">
                      <path d="M3 8l3 3 7-7" />
                    </svg>
                  </div>
                )}

                <div className="mb-4 flex items-start gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-card/50 text-xl border border-border/10">
                    {branchIcons[i]}
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-lg font-semibold leading-tight">{branch.name}</h3>
                    <p className="mt-0.5 text-xs text-muted-foreground">{branch.tagline}</p>
                  </div>
                </div>

                <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
                  {branch.description}
                </p>

                <div className="grid grid-cols-3 gap-3">
                  <MilestoneStep label="第 1 步" text={branch.preview.nextStep} active={isSelected} />
                  <MilestoneStep label="3 年后" text={branch.preview.inThreeYears} active={isSelected} />
                  <MilestoneStep label="5 年后" text={branch.preview.inFiveYears} active={isSelected} />
                </div>
              </button>
            );
          })}
        </div>

        {/* ===== 操作栏 ===== */}
        <div className="mt-8 flex flex-col items-center gap-3 animate-fade-in-up animate-delay-500">
          <div className="flex gap-3">
            <Button variant="outline" size="lg" onClick={() => router.push("/future/insight")}>
              ← 返回洞察
            </Button>
            <Button
              size="lg"
              className="h-11 min-w-[180px] px-8"
              disabled={!selectedBranchId}
              onClick={handleConfirm}
            >
              确认这条路线
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            {selectedBranchId ? "确认后将开始你的未来推演" : "请选择一条你想探索的路线"}
          </p>
        </div>
      </div>
    </div>
  );
}

function MilestoneStep({ label, text, active }: { label: string; text: string; active: boolean }) {
  return (
    <div
      className={`rounded-lg border p-2.5 text-center transition-colors ${
        active ? "border-emerald-500/20 bg-emerald-500/5" : "border-border/10 bg-background/30"
      }`}
    >
      <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/60 mb-1">{label}</p>
      <p className="text-xs leading-tight">{text}</p>
    </div>
  );
}
