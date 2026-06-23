"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useFutureLabStore } from "@/stores/future-lab-store";
import type { LifeDNA } from "@/types";

interface UserFields {
  age: string;
  school: string;
  major: string;
  career: string;
  dream: string;
}

const CAREER_LABELS: Record<string, string> = {
  student: "学生", engineer: "工程师/技术", product: "产品/运营",
  design: "设计/创意", finance: "金融/投资", medical: "医疗/健康",
  education: "教育/科研", government: "公务员/事业单位", business: "创业/经商",
  freelancer: "自由职业", service: "服务行业", other: "其他",
};

function loadInitialFields(): UserFields {
  const userRaw = localStorage.getItem("future-user-data");
  if (userRaw) {
    try { return JSON.parse(userRaw); } catch { /* ignore */ }
  }
  // 回退：从重启人生数据预填
  const formRaw = localStorage.getItem("parallel-life-form");
  if (formRaw) {
    try {
      const f = JSON.parse(formRaw);
      const birth = f.birthDate ? new Date(f.birthDate) : null;
      let age = "";
      if (birth) {
        const now = new Date();
        let a = now.getFullYear() - birth.getFullYear();
        const m = now.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) a--;
        age = String(a);
      }
      return {
        age,
        school: f.school || "",
        major: f.major || "",
        career: f.career || "",
        dream: f.dream || "",
      };
    } catch { /* ignore */ }
  }
  return { age: "", school: "", major: "", career: "", dream: "" };
}

export default function FutureOnboardingPage() {
  const router = useRouter();
  const { userConfusion, setUserConfusion } = useFutureLabStore();

  const [fields, setFields] = useState<UserFields>({ age: "", school: "", major: "", career: "", dream: "" });
  const [dna, setDna] = useState<LifeDNA | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const dnaRaw = localStorage.getItem("parallel-life-dna");
    if (dnaRaw) {
      try { setDna(JSON.parse(dnaRaw)); } catch { /* ignore */ }
    }
    setFields(loadInitialFields());
    setReady(true);
  }, []);

  function updateField(key: keyof UserFields, value: string) {
    setFields((prev) => ({ ...prev, [key]: value }));
  }

  function handleSaveAndContinue() {
    if (!fields.age || !fields.school || !fields.major || !fields.dream || !userConfusion.trim()) return;
    localStorage.setItem("future-user-data", JSON.stringify(fields));
    router.push("/future/insight");
  }

  function handleClearAndReset() {
    localStorage.removeItem("future-user-data");
    localStorage.removeItem("parallel-life-form");
    localStorage.removeItem("parallel-life-dna");
    setFields({ age: "", school: "", major: "", career: "", dream: "" });
    setDna(null);
    setUserConfusion("");
  }

  if (!ready) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <svg className="h-8 w-8 animate-spin text-emerald-400" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-sm text-muted-foreground">加载中...</p>
        </div>
      </div>
    );
  }

  const hasExistingData = !!(localStorage.getItem("parallel-life-form") || localStorage.getItem("future-user-data"));

  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden px-4 py-12 sm:py-16">
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-b from-emerald-500/6 via-emerald-500/2 to-transparent blur-3xl" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)", backgroundSize: "64px 64px" }} />
      </div>

      <div className="relative z-10 mx-auto max-w-2xl">
        {/* 页头 */}
        <div className="mb-10 text-center animate-fade-in-up">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-4 py-1.5 text-sm text-emerald-400/80 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />Future Lab · 未来推演
          </div>
          <h1 className="mb-2 text-3xl font-bold tracking-tight sm:text-4xl">确认你的现状</h1>
          <p className="text-muted-foreground">
            填写你的基本信息，然后告诉我们你在纠结什么。可以随时修改。
          </p>
        </div>

        {/* 基本信息（可编辑） */}
        <Card className="mb-6 border-border/20 bg-card/30 backdrop-blur-sm animate-fade-in-up animate-delay-200">
          <CardContent className="p-5 sm:p-6">
            <div className="mb-3 flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-emerald-400/60" />
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">你的基本信息</span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <FieldRow label="年龄" value={fields.age} onChange={(v) => updateField("age", v)} placeholder="如 21" />
              <FieldRow label="学校" value={fields.school} onChange={(v) => updateField("school", v)} placeholder="如 东北大学" />
              <FieldRow label="专业" value={fields.major} onChange={(v) => updateField("major", v)} placeholder="如 环境设计" />
              <FieldRow label="职业" value={fields.career} onChange={(v) => updateField("career", v)} placeholder="如 学生" />
              <div className="sm:col-span-2">
                <FieldRow label="梦想" value={fields.dream} onChange={(v) => updateField("dream", v)} placeholder="如果没有任何限制，你想成为什么样的人？" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Life DNA（如果有） */}
        {dna && (
          <Card className="mb-6 border-primary/10 bg-primary/5 backdrop-blur-sm animate-fade-in-up animate-delay-250">
            <CardContent className="p-5 sm:p-6">
              <div className="mb-3 flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-primary/60" />
                <span className="text-xs font-medium uppercase tracking-wider text-primary/60">Life DNA</span>
              </div>
              <p className="text-sm leading-relaxed text-foreground/80">{dna.summary}</p>
              <p className="mt-2 text-xs text-muted-foreground">{dna.traits.slice(0, 3).join(" · ")} · {dna.lifeTheme}</p>
            </CardContent>
          </Card>
        )}

        {/* 困惑输入 */}
        <Card className="mb-6 border-border/20 bg-card/30 backdrop-blur-sm animate-fade-in-up animate-delay-300">
          <CardContent className="p-5 sm:p-6">
            <div className="mb-3 flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-amber-400/60" />
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">你目前在纠结什么？</span>
            </div>
            <Textarea
              placeholder="我该考研还是直接工作？
我和她异地两年了，不知道还能不能坚持下去。
拿到两个offer，一个钱多一个我喜欢，选哪个。"
              className="min-h-[100px] resize-none text-sm"
              value={userConfusion}
              onChange={(e) => setUserConfusion(e.target.value)}
              maxLength={100}
            />
            <div className="mt-2 flex justify-between">
              <span className="text-xs text-muted-foreground">越具体，AI 生成的路线越贴合你的真实处境</span>
              <span className="text-xs text-muted-foreground">{userConfusion.length}/100</span>
            </div>
          </CardContent>
        </Card>

        {/* 操作栏 */}
        <div className="flex flex-col items-center gap-3 animate-fade-in-up animate-delay-400">
          <Button
            size="lg"
            className="h-12 min-w-[200px] px-8"
            disabled={!fields.age || !fields.school || !fields.major || !fields.dream || !userConfusion.trim()}
            onClick={handleSaveAndContinue}
          >
            开始探索
          </Button>

          {hasExistingData && (
            <button
              onClick={handleClearAndReset}
              className="text-xs text-muted-foreground/60 hover:text-destructive/70 transition-colors"
            >
              这不是我的信息，清空重填
            </button>
          )}

          <p className="text-xs text-muted-foreground">
            下一步：AI 将分析你的现状，生成专属的未来路线
          </p>
        </div>
      </div>
    </div>
  );
}

/** 可编辑字段行 */
function FieldRow({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs text-muted-foreground">{label}</label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-9 text-sm"
      />
    </div>
  );
}
