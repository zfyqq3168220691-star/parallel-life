"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { LifeDNA } from "@/types";

// ===== 表单校验 =====
const formSchema = z.object({
  birthDate: z.string().min(1, "请选择出生日期"),
  birthTime: z.string().optional(),
  birthPlace: z.string().min(1, "请输入出生地点"),
  school: z.string().min(1, "请输入学校"),
  major: z.string().min(1, "请输入专业"),
  career: z.string().min(1, "请选择职业"),
  income: z.string().min(1, "请选择收入范围"),
  dream: z.string().min(1, "请写下你的梦想").max(200, "梦想描述不超过200字"),
});

type FormValues = z.infer<typeof formSchema>;

// ===== 选项数据 =====
const CAREER_OPTIONS = [
  { value: "student", label: "学生" },
  { value: "engineer", label: "工程师/技术" },
  { value: "product", label: "产品/运营" },
  { value: "design", label: "设计/创意" },
  { value: "finance", label: "金融/投资" },
  { value: "medical", label: "医疗/健康" },
  { value: "education", label: "教育/科研" },
  { value: "government", label: "公务员/事业单位" },
  { value: "business", label: "创业/经商" },
  { value: "freelancer", label: "自由职业" },
  { value: "service", label: "服务行业" },
  { value: "other", label: "其他" },
] as const;

const INCOME_OPTIONS = [
  { value: "below-50k", label: "5万以下 / 年" },
  { value: "50k-100k", label: "5-10万 / 年" },
  { value: "100k-200k", label: "10-20万 / 年" },
  { value: "200k-500k", label: "20-50万 / 年" },
  { value: "500k-1m", label: "50-100万 / 年" },
  { value: "above-1m", label: "100万以上 / 年" },
] as const;

export function OnboardingForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode") || "restart";

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [backgroundMode, setBackgroundMode] = useState<"fixed" | "random">("fixed");
  const [backgroundDescription, setBackgroundDescription] = useState("");
  const [canonEvents, setCanonEvents] = useState([
    { age: "", title: "", description: "" },
    { age: "", title: "", description: "" },
    { age: "", title: "", description: "" },
  ]);
  const [divergenceIndex, setDivergenceIndex] = useState(-1); // -1 = 最后一个锚点
  const [alternativeChoice, setAlternativeChoice] = useState("");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      birthDate: "",
      birthTime: "",
      birthPlace: "",
      school: "",
      major: "",
      career: "",
      income: "",
      dream: "",
    },
  });

  async function onSubmit(data: FormValues) {
    setIsSubmitting(true);
    setServerError(null);

    try {
      const response = await fetch("/api/generate-life-dna", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, mode }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "请求失败，请稍后重试");
      }

      // 存储到 localStorage（阶段2 改为 Supabase）
      const lifeDNA: LifeDNA = {
        summary: result.summary,
        traits: result.traits,
        motivations: result.motivations,
        innerPatterns: result.innerPatterns,
        growthEdge: result.growthEdge,
        archetype: result.archetype,
        lifeTheme: result.lifeTheme,
      };

      localStorage.setItem("parallel-life-form", JSON.stringify(data));
      localStorage.setItem("parallel-life-dna", JSON.stringify(lifeDNA));
      localStorage.setItem("parallel-life-mode", mode);
      localStorage.setItem("parallel-life-background-mode", backgroundMode);
      if (backgroundMode === "fixed") {
        localStorage.setItem("parallel-life-background-description", backgroundDescription);
        const filledCanonEvents = canonEvents.filter((e) => e.age && e.title);
        if (filledCanonEvents.length > 0) {
          localStorage.setItem("parallel-life-canon-events", JSON.stringify(filledCanonEvents));
          localStorage.setItem("parallel-life-divergence-index", String(divergenceIndex));
          if (alternativeChoice) {
            localStorage.setItem("parallel-life-alternative-choice", alternativeChoice);
          } else {
            localStorage.removeItem("parallel-life-alternative-choice");
          }
        } else {
          localStorage.removeItem("parallel-life-canon-events");
          localStorage.removeItem("parallel-life-divergence-index");
        }
      } else {
        localStorage.removeItem("parallel-life-background-description");
        localStorage.removeItem("parallel-life-canon-events");
        localStorage.removeItem("parallel-life-divergence-index");
        localStorage.removeItem("parallel-life-alternative-choice");
      }

      router.push("/modeling");
    } catch (error) {
      setServerError(
        error instanceof Error ? error.message : "未知错误，请重试",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden px-4 py-12 sm:py-16">
      {/* ===== 背景层 ===== */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-b from-primary/8 via-primary/2 to-transparent blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      {/* ===== 内容 ===== */}
      <div className="relative z-10 mx-auto max-w-2xl">
        {/* 页头 */}
        <div className="mb-10 text-center animate-fade-in-up">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary/80 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            步骤 1/4 · 人生建模
          </div>
          <h1 className="mb-2 text-3xl font-bold tracking-tight sm:text-4xl">
            告诉我们关于你
          </h1>
          <p className="text-muted-foreground">
            这些信息将帮助 AI 构建你的初始人生画像
          </p>
        </div>

        {/* 表单卡片 */}
        <div className="rounded-2xl border border-border/30 bg-card/40 p-6 backdrop-blur-sm sm:p-8 animate-fade-in-up animate-delay-200">
          {/* 服务端错误提示 */}
          {serverError && (
            <div className="mb-6 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {serverError}
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* ===== 基础信息 ===== */}
              <fieldset>
                <legend className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  基础信息
                </legend>
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="birthDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>出生日期</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="birthTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>出生时间（可选）</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input type="time" {...field} className="pr-8" />
                            {field.value && (
                              <button
                                type="button"
                                onClick={() => field.onChange("")}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                aria-label="清除时间"
                              >
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M4 4l8 8M12 4l-8 8" />
                                </svg>
                              </button>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="birthPlace"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-2">
                        <FormLabel>出生地点</FormLabel>
                        <FormControl>
                          <Input placeholder="例如：北京、上海、成都..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </fieldset>

              {/* ===== 教育背景 ===== */}
              <fieldset>
                <legend className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  教育背景
                </legend>
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="school"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>学校</FormLabel>
                        <FormControl>
                          <Input placeholder="你的学校名称" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="major"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>专业</FormLabel>
                        <FormControl>
                          <Input placeholder="你的专业方向" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </fieldset>

              {/* ===== 职业与收入 ===== */}
              <fieldset>
                <legend className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  职业与收入
                </legend>
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="career"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>职业</FormLabel>
                        <FormControl>
                          <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={field.value}
                            onChange={field.onChange}
                          >
                            <option value="" disabled>选择你的职业</option>
                            {CAREER_OPTIONS.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="income"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>年收入范围</FormLabel>
                        <FormControl>
                          <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={field.value}
                            onChange={field.onChange}
                          >
                            <option value="" disabled>选择收入范围</option>
                            {INCOME_OPTIONS.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </fieldset>

              {/* ===== 梦想 ===== */}
              <fieldset>
                <legend className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  你的梦想
                </legend>
                <FormField
                  control={form.control}
                  name="dream"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>如果没有任何限制，你想成为什么样的人？</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="写下你内心最真实的梦想..."
                          className="min-h-[100px] resize-none"
                          {...field}
                        />
                      </FormControl>
                      <div className="flex justify-between">
                        <FormMessage />
                        <span className="text-xs text-muted-foreground">
                          {field.value.length}/200
                        </span>
                      </div>
                    </FormItem>
                  )}
                />
              </fieldset>

              {/* ===== 背景模式 ===== */}
              <fieldset>
                <legend className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  推演背景
                </legend>
                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setBackgroundMode("fixed")}
                    className={`flex flex-col items-start gap-1 rounded-xl border p-4 text-left transition-all ${
                      backgroundMode === "fixed"
                        ? "border-primary/40 bg-primary/5 ring-1 ring-primary/20"
                        : "border-border/30 bg-card/30 hover:border-border/50"
                    }`}
                  >
                    <span className="text-sm font-semibold">📍 背景固定</span>
                    <span className="text-xs text-muted-foreground">
                      描述你的真实起点，探索当年未曾选择的道路
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setBackgroundMode("random")}
                    className={`flex flex-col items-start gap-1 rounded-xl border p-4 text-left transition-all ${
                      backgroundMode === "random"
                        ? "border-primary/40 bg-primary/5 ring-1 ring-primary/20"
                        : "border-border/30 bg-card/30 hover:border-border/50"
                    }`}
                  >
                    <span className="text-sm font-semibold">🎲 背景随机</span>
                    <span className="text-xs text-muted-foreground">
                      随机分配全新的出生背景，体验完全不同的人生
                    </span>
                  </button>
                </div>
              </fieldset>

              {/* ===== 背景描述 + 人生锚点（仅固定模式） ===== */}
              {backgroundMode === "fixed" && (
                <>
                  <fieldset>
                    <legend className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                      你的真实起点
                    </legend>
                    <div className="space-y-1.5">
                      <label className="text-sm text-muted-foreground">
                        描述你的家庭、成长环境、经济状况。越具体，推演越真实。
                      </label>
                      <Textarea
                        placeholder="例如：山东济南普通工薪家庭。父亲是货车司机，母亲在超市上班。从小在爷爷奶奶家长大，小学在镇上读的。家里没多少钱但也不缺。"
                        className="min-h-[100px] resize-none text-sm"
                        value={backgroundDescription}
                        onChange={(e) => setBackgroundDescription(e.target.value)}
                        maxLength={300}
                      />
                      <div className="flex justify-end">
                        <span className="text-xs text-muted-foreground">
                          {backgroundDescription.length}/300（可选）
                        </span>
                      </div>
                    </div>
                  </fieldset>

                  <fieldset>
                    <legend className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                      人生锚点（可选，最多3个）
                    </legend>
                    <p className="mb-4 text-xs text-muted-foreground">
                      记录你真实人生中一定会发生的关键事件。AI 推演时将绕不开这些路标。每个锚点包含年龄、标题和描述。
                    </p>
                    <div className="space-y-4">
                      {canonEvents.map((event, i) => (
                        <div key={i} className="rounded-lg border border-border/20 bg-card/20 p-4">
                          <div className="mb-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                            锚点 {i + 1}
                          </div>
                          <div className="grid gap-3 sm:grid-cols-[80px_1fr]">
                            <Input
                              placeholder="年龄"
                              value={event.age}
                              onChange={(e) => {
                                const updated = [...canonEvents];
                                updated[i] = { ...updated[i], age: e.target.value };
                                setCanonEvents(updated);
                              }}
                              className="h-9 text-sm"
                            />
                            <Input
                              placeholder="事件标题"
                              value={event.title}
                              onChange={(e) => {
                                const updated = [...canonEvents];
                                updated[i] = { ...updated[i], title: e.target.value };
                                setCanonEvents(updated);
                              }}
                              className="h-9 text-sm"
                            />
                          </div>
                          <Textarea
                            placeholder="简单描述（如：在我16岁那年，姐姐做生意赚了钱，家里经济状况完全改变，我从普通班转到了美术班...）"
                            className="mt-3 min-h-[60px] resize-none text-sm"
                            value={event.description}
                            onChange={(e) => {
                              const updated = [...canonEvents];
                              updated[i] = { ...updated[i], description: e.target.value };
                              setCanonEvents(updated);
                            }}
                            maxLength={200}
                          />
                        </div>
                      ))}
                    </div>
                  </fieldset>

                  {/* ===== 分岔点选择 ===== */}
                  {(() => {
                    const filledCanonEvents = canonEvents.filter((e) => e.age && e.title);
                    if (filledCanonEvents.length === 0) return null;
                    return (
                      <fieldset>
                        <legend className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                          选择分岔点
                        </legend>
                        <p className="mb-4 text-xs text-muted-foreground">
                          在哪个锚点处，你想要做出不同的选择？分岔点之前的人生将忠实复现你的真实经历。
                        </p>
                        <div className="space-y-2">
                          {filledCanonEvents.map((event, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => setDivergenceIndex(i)}
                              className={`flex w-full items-start gap-3 rounded-lg border p-3 text-left transition-all ${
                                divergenceIndex === i
                                  ? "border-primary/40 bg-primary/5 ring-1 ring-primary/20"
                                  : "border-border/20 bg-card/20 hover:border-border/40"
                              }`}
                            >
                              <div
                                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                                  divergenceIndex === i
                                    ? "border-primary"
                                    : "border-border/40"
                                }`}
                              >
                                {divergenceIndex === i && (
                                  <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                                )}
                              </div>
                              <div className="min-w-0">
                                <div className="text-sm font-medium">
                                  [{event.age}岁] {event.title}
                                </div>
                                <div className="text-xs text-muted-foreground line-clamp-2">
                                  {event.description}
                                </div>
                              </div>
                            </button>
                          ))}
                          <button
                            type="button"
                            onClick={() => setDivergenceIndex(-1)}
                            className={`flex w-full items-start gap-3 rounded-lg border p-3 text-left transition-all ${
                              divergenceIndex === -1
                                ? "border-primary/40 bg-primary/5 ring-1 ring-primary/20"
                                : "border-border/20 bg-card/20 hover:border-border/40"
                            }`}
                          >
                            <div
                              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                                divergenceIndex === -1
                                  ? "border-primary"
                                  : "border-border/40"
                              }`}
                            >
                              {divergenceIndex === -1 && (
                                <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="text-sm font-medium">
                                最后一个锚点之后
                              </div>
                              <div className="text-xs text-muted-foreground">
                                完整走过真实人生，在一切结束后开始探索平行宇宙
                              </div>
                            </div>
                          </button>
                        </div>
                      </fieldset>
                    );
                  })()}

                  {/* ===== 替代路线 ===== */}
                  {divergenceIndex >= 0 && (() => {
                    const event = canonEvents[divergenceIndex];
                    if (!event.age || !event.title) return null;
                    return (
                      <fieldset>
                        <legend className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                          当时如果走了另一条路
                        </legend>
                        <div className="space-y-1.5">
                          <label className="text-sm text-muted-foreground">
                            在 [{event.age}岁] {event.title} 这个节点，你真实的选择是什么？如果你能重来，你想做出怎样不同的选择？
                          </label>
                          <Textarea
                            placeholder="例如：我真实的选择是听从父母建议学了理科。如果能重来，我想选择文科，去学我一直热爱的历史和文学。"
                            className="min-h-[80px] resize-none text-sm"
                            value={alternativeChoice}
                            onChange={(e) => setAlternativeChoice(e.target.value)}
                            maxLength={250}
                          />
                          <div className="flex justify-end">
                            <span className="text-xs text-muted-foreground">
                              {alternativeChoice.length}/250（可选）
                            </span>
                          </div>
                        </div>
                      </fieldset>
                    );
                  })()}
                </>
              )}

              {/* ===== 提交 ===== */}
              <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:justify-between">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={isSubmitting}
                  render={<Link href="/mode-select">← 返回选择模式</Link>}
                />
                <Button
                  type="submit"
                  size="lg"
                  className="h-12 min-w-[160px] px-10"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <svg
                        className="h-4 w-4 animate-spin"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      生成中...
                    </span>
                  ) : (
                    "生成人生画像"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
