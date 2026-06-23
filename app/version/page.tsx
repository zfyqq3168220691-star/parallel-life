import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "更新日志 — Parallel Life",
  description: "Parallel Life 版本更新记录与开发路线图。",
};

export default function VersionPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 sm:py-28">
      {/* 页头 */}
      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/30 bg-card/50 px-3 py-1 text-xs text-muted-foreground backdrop-blur-sm">
        Changelog
      </div>
      <h1 className="mb-2 text-3xl font-bold tracking-tight">更新日志</h1>
      <div className="mb-10 flex items-center gap-3">
        <span className="rounded-full bg-primary/10 px-3 py-0.5 text-xs font-medium text-primary/80">
          v0.9.0 Beta
        </span>
        <span className="text-xs text-muted-foreground">2026.06</span>
      </div>

      {/* ===== 当前版本 ===== */}
      <section className="mb-14">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          当前版本介绍
        </h2>
        <p className="leading-relaxed text-muted-foreground">
          v0.9.0 Beta 是 Parallel Life
          的功能完整版。两个核心模块——重启人生和未来推演——均已完成从信息录入到总结分享的完整闭环。这是我们在封闭测试阶段发布的第一个可用版本。
        </p>
      </section>

      {/* ===== 功能记录 ===== */}
      <section className="mb-14">
        <h2 className="mb-6 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          功能更新记录
        </h2>

        <div className="relative">
          {/* 时间线 */}
          <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border/20" />

          <div className="space-y-8">
            <TimelineItem
              version="v0.9.0"
              date="2026.06"
              label="Beta 发布"
              items={[
                "用户建模系统：生活基础信息录入 + Life DNA AI 深度心理画像生成",
                "重启人生引擎：14 个高密度人生事件推演，支持锚点、分岔点、背景固定/随机",
                "未来推演引擎：AI 洞察 + 路线生成 + 14 个未来事件推演",
                "推演系统特性：预选确认机制、一次性撤销令牌、回响系统、叙事状态追踪、硬名字锁定",
                "分岔点对比总结：路径 A / 路径 B 等权重对比 + 人生数字统计",
                "统一推演引擎：重启人生与未来推演共享 useSimulation 核心逻辑",
                "移动端适配：响应式布局 + 原生 select 替代 Radix Select",
                "关于 / 隐私 / 免责声明页面",
              ]}
            />
            <TimelineItem
              version="v0.1 — v0.8"
              date="2026.05 — 2026.06"
              label="核心开发阶段"
              items={[
                "项目初始化：Next.js 16 + TypeScript + Tailwind + shadcn/ui",
                "Life DNA 系统 Prompt 设计与迭代（7 维度深层画像）",
                "人生事件生成引擎：回响、状态追踪、人物连续性、时间线分离",
                "Future Lab 独立产品线设计：AI 洞察层 + 路线生成",
                "Zustand 持久化存储 + FutureSession 设计",
                "Cloudflare Tunnel 远程测试环境搭建",
              ]}
            />
          </div>
        </div>
      </section>

      {/* ===== Roadmap ===== */}
      <section className="mb-14">
        <h2 className="mb-6 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Roadmap
        </h2>

        <div className="space-y-4">
          <RoadmapItem status="done" label="用户建模" />
          <RoadmapItem status="done" label="Life DNA 生成" />
          <RoadmapItem status="done" label="重启人生推演引擎" />
          <RoadmapItem status="done" label="未来推演引擎" />
          <RoadmapItem status="done" label="推演总结 & 分享" />
          <RoadmapItem status="done" label="移动端适配" />
          <RoadmapItem status="done" label="关于 & 隐私 & 免责" />
          <RoadmapItem status="in-progress" label="ReFork 再分叉功能" />
          <RoadmapItem status="planned" label="分享卡片生成" />
          <RoadmapItem status="planned" label="Life DNA 原生分享图" />
          <RoadmapItem status="planned" label="多语言支持" />
          <RoadmapItem status="planned" label="Supabase 云端存储" />
          <RoadmapItem status="planned" label="公开发布 v1.0" />
        </div>
      </section>

      {/* ===== 下一阶段 ===== */}
      <section className="mb-14">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          下一阶段计划
        </h2>
        <div className="space-y-4">
          <PlanItem
            title="ReFork 再分叉"
            description="在 Future Lab 推演中途提供重新考虑方向的机会——体验一条路走到一半决定掉头的感受。这是 Future Lab 最后一个未完成的核心交互。"
          />
          <PlanItem
            title="分享卡片"
            description="将推演总结渲染为适合社交平台分享的静态图片。让用户能够把「我另一种人生的结局」分享给朋友。"
          />
          <PlanItem
            title="反馈闭环"
            description="收集 Beta 用户的真实使用反馈，优先修复高频痛点，打磨交互细节，为 v1.0 公开发布做准备。"
          />
        </div>
      </section>

      {/* 底部 */}
      <div className="border-t border-border/20 pt-8">
        <p className="text-xs leading-relaxed text-muted-foreground/50">
          Parallel Life 目前处于 Beta 阶段。功能和接口可能随时调整。
          <br />
          如有反馈或 bug 报告，请联系产品开发者。
        </p>
      </div>
    </div>
  );
}

// ===== 子组件 =====

function TimelineItem({
  version,
  date,
  label,
  items,
}: {
  version: string;
  date: string;
  label: string;
  items: string[];
}) {
  return (
    <div className="relative pl-6">
      {/* 圆点 */}
      <div className="absolute left-0 top-1.5 h-3.5 w-3.5 rounded-full border-2 border-primary/40 bg-background" />
      {/* 头部 */}
      <div className="mb-2 flex items-baseline gap-2">
        <span className="text-sm font-semibold">{version}</span>
        <span className="text-xs text-muted-foreground">{date}</span>
        <span className="rounded-full bg-card/50 px-2 py-0.5 text-[10px] text-muted-foreground">
          {label}
        </span>
      </div>
      {/* 列表 */}
      <ul className="space-y-1">
        {items.map((item, i) => (
          <li key={i} className="text-sm leading-relaxed text-muted-foreground">
            · {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function RoadmapItem({
  status,
  label,
}: {
  status: "done" | "in-progress" | "planned";
  label: string;
}) {
  const icon =
    status === "done" ? "✓" : status === "in-progress" ? "●" : "○";
  const color =
    status === "done"
      ? "text-emerald-400/70"
      : status === "in-progress"
        ? "text-amber-400/70"
        : "text-muted-foreground/40";

  return (
    <div className="flex items-center gap-3">
      <span className={`text-xs ${color}`}>{icon}</span>
      <span
        className={`text-sm ${
          status === "planned" ? "text-muted-foreground/50" : "text-foreground/85"
        }`}
      >
        {label}
      </span>
      {status === "in-progress" && (
        <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] text-amber-400/70">
          进行中
        </span>
      )}
    </div>
  );
}

function PlanItem({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div>
      <h3 className="text-sm font-medium">{title}</h3>
      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
