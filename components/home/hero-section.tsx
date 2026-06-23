import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/constants";

export function HeroSection() {
  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center overflow-hidden px-4">
      {/* ===== 背景光效层 ===== */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        {/* 主光晕 */}
        <div className="absolute left-1/2 top-[35%] h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 animate-pulse-glow">
          <div className="h-full w-full rounded-full bg-gradient-to-b from-primary/20 via-primary/5 to-transparent blur-3xl" />
        </div>

        {/* 辅助光斑 */}
        <div className="absolute right-[15%] top-[20%] h-48 w-48 rounded-full bg-blue-400/8 blur-3xl animate-float" />
        <div
          className="absolute bottom-[30%] left-[10%] h-64 w-64 rounded-full bg-indigo-400/6 blur-3xl animate-float"
          style={{ animationDelay: "-4s" }}
        />

        {/* 细微网格纹理 */}
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
      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center text-center">
        {/* 标签 */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary/80 backdrop-blur-sm animate-fade-in-up">
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          AI 人生实验室
        </div>

        {/* 主标题 */}
        <h1 className="mb-4 text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl animate-fade-in-up">
          {SITE.name}
        </h1>

        {/* 副标题 — 渐变文字 */}
        <p className="mb-12 max-w-lg bg-gradient-to-b from-foreground via-foreground/80 to-foreground/50 bg-clip-text text-xl leading-relaxed text-transparent sm:text-2xl animate-fade-in-up animate-delay-200">
          {SITE.slogan}
        </p>

        {/* CTA 按钮 */}
        <div className="animate-fade-in-up animate-delay-400">
          <Button
            size="lg"
            className="group relative h-14 gap-2 overflow-hidden rounded-xl bg-primary px-10 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-105 hover:shadow-xl hover:shadow-primary/30"
            render={
              <Link href="/mode-select">
                <span className="relative z-10 flex items-center gap-2">
                  开始探索
                  <svg
                    className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
                {/* 按钮 hover 光效 */}
                <div className="absolute inset-0 -z-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </Link>
            }
          />
        </div>
      </div>

      {/* ===== 底部滚动提示 ===== */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-fade-in-up animate-delay-600">
        <div className="flex flex-col items-center gap-2 text-xs text-muted-foreground">
          <span>向下滚动</span>
          <svg
            className="h-4 w-4 animate-bounce"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  );
}
