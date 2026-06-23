import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "选择模式",
  description: "选择重启人生或未来推演，开始探索不同的人生可能性。",
};

const MODES = [
  {
    id: "restart",
    title: "重启人生",
    subtitle: "回到起点，重新体验",
    description:
      "输入你的出生信息，回到人生的起点。探索如果当初做出不同选择，现在的你会走向何方。每一次重来，都是一次新的可能。",
    href: "/onboarding?mode=restart",
    cta: "开始重启",
    gradient: "from-emerald-500/20 via-emerald-500/5 to-transparent",
    glow: "shadow-emerald-500/10",
    border: "border-emerald-500/20 hover:border-emerald-500/40",
    icon: (
      <svg
        className="h-8 w-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182"
        />
      </svg>
    ),
  },
  {
    id: "future",
    title: "未来推演",
    subtitle: "从当下出发，探索未来",
    description:
      "基于你当前的状态，推演未来不同决策路径下的人生走向。看看每一条未曾踏上的道路，最终会通向怎样的风景。",
    href: "/future/onboarding",
    cta: "开始推演",
    gradient: "from-violet-500/20 via-violet-500/5 to-transparent",
    glow: "shadow-violet-500/10",
    border: "border-violet-500/20 hover:border-violet-500/40",
    icon: (
      <svg
        className="h-8 w-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 8.25M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15.75M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 8.25m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15.75"
        />
      </svg>
    ),
  },
] as const;

export default function ModePage() {
  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center overflow-hidden px-4 py-16">
      {/* ===== 背景光效层 ===== */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        {/* 主光晕 */}
        <div className="absolute left-1/2 top-[40%] h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2">
          <div className="h-full w-full rounded-full bg-gradient-to-b from-primary/10 via-primary/3 to-transparent blur-3xl" />
        </div>

        {/* 网格 */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      {/* ===== 内容层 ===== */}
      <div className="relative z-10 mx-auto w-full max-w-5xl">
        {/* 页头 */}
        <div className="mb-12 text-center animate-fade-in-up">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary/80 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            选择探索方式
          </div>
          <h1 className="mb-3 text-3xl font-bold tracking-tight sm:text-4xl">
            你要如何探索？
          </h1>
          <p className="text-muted-foreground">
            两种模式，同一个目的——看见另一种可能的自己
          </p>
        </div>

        {/* 模式卡片 */}
        <div className="grid gap-5 sm:grid-cols-2">
          {MODES.map((mode, i) => (
            <Card
              key={mode.id}
              className={`group relative flex flex-col overflow-hidden border ${mode.border} bg-card/50 backdrop-blur-sm transition-all duration-500 hover:shadow-2xl ${mode.glow} animate-fade-in-up`}
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              {/* 顶部光晕 */}
              <div
                className={`pointer-events-none absolute -top-24 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-gradient-to-b ${mode.gradient} blur-2xl transition-opacity duration-500 group-hover:opacity-100`}
                aria-hidden="true"
              />

              <CardContent className="relative z-10 flex flex-1 flex-col p-6 sm:p-8">
                {/* 图标 */}
                <div className={`mb-5 inline-flex h-14 w-14 items-center justify-center rounded-xl border ${mode.border} bg-background/50 text-foreground/80 transition-colors duration-300 group-hover:text-foreground`}>
                  {mode.icon}
                </div>

                {/* 标题 */}
                <h2 className="mb-1.5 text-2xl font-bold tracking-tight">
                  {mode.title}
                </h2>
                <p className="mb-4 text-sm font-medium text-muted-foreground">
                  {mode.subtitle}
                </p>

                {/* 描述 */}
                <p className="mb-8 flex-1 text-sm leading-relaxed text-muted-foreground/80">
                  {mode.description}
                </p>

                {/* CTA */}
                <Button
                  className="group/btn relative w-full h-11 overflow-hidden rounded-lg text-sm font-medium transition-all hover:scale-[1.02]"
                  variant={mode.id === "restart" ? "default" : "secondary"}
                  render={
                    <Link href={mode.href}>
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        {mode.cta}
                        <svg
                          className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                          />
                        </svg>
                      </span>
                    </Link>
                  }
                />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 返回 */}
        <div className="mt-10 text-center animate-fade-in-up animate-delay-400">
          <Button
            variant="ghost"
            size="sm"
            render={<Link href="/">← 返回首页</Link>}
          />
        </div>
      </div>
    </div>
  );
}
