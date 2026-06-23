"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

// ===== Tab 配置 =====

const TABS = [
  { id: "about", label: "关于", icon: "📖" },
  { id: "changelog", label: "更新日志", icon: "📋" },
  { id: "privacy", label: "隐私政策", icon: "🔒" },
  { id: "disclaimer", label: "免责声明", icon: "⚠️" },
] as const;

type TabId = (typeof TABS)[number]["id"];

// ===== 主页面 =====

function SettingsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab") as TabId | null;
  const activeTab: TabId = TABS.some((t) => t.id === tabParam) ? tabParam! : "about";

  function switchTab(id: TabId) {
    router.push(`/settings?tab=${id}`, { scroll: false });
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl flex-col sm:flex-row">
      {/* ===== 侧边栏（桌面端） ===== */}
      <aside className="hidden w-44 shrink-0 border-r border-border/20 py-12 sm:block">
        <nav className="sticky top-20 space-y-0.5 px-3">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => switchTab(tab.id)}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition-all",
                  isActive
                    ? "bg-primary/5 text-foreground font-medium"
                    : "text-muted-foreground hover:bg-card/50 hover:text-foreground"
                )}
              >
                <span className="text-base">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* ===== 顶部 Tab（移动端） ===== */}
      <div className="sticky top-14 z-10 border-b border-border/20 bg-background/80 backdrop-blur-sm sm:hidden">
        <div className="flex gap-0 overflow-x-auto px-4">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => switchTab(tab.id)}
                className={cn(
                  "shrink-0 border-b-2 px-4 py-3 text-sm transition-all",
                  isActive
                    ? "border-primary text-foreground font-medium"
                    : "border-transparent text-muted-foreground"
                )}
              >
                <span className="mr-1.5">{tab.icon}</span>
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ===== 内容区 ===== */}
      <main className="flex-1 px-4 py-8 sm:py-12 sm:pl-10 sm:pr-8">
        {activeTab === "about" && <AboutContent />}
        {activeTab === "changelog" && <ChangelogContent />}
        {activeTab === "privacy" && <PrivacyContent />}
        {activeTab === "disclaimer" && <DisclaimerContent />}
      </main>
    </div>
  );
}

// ===== 页面入口 =====

export default function SettingsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      }
    >
      <SettingsContent />
    </Suspense>
  );
}

// ============================================================
// Tab 内容
// ============================================================

function AboutContent() {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Parallel Life</h1>
        <p className="mt-2 leading-relaxed text-muted-foreground">
          AI 人生探索实验室——不是预测命运，不是算命工具，而是帮助你从不同角度重新理解自己的人生选择。
        </p>
      </div>

      <section>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">两大模块</h2>
        <div className="space-y-6">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-[10px] text-primary/70">R</span>
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Restart Life</span>
            </div>
            <h3 className="text-base font-semibold">重启人生</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              输入你的出生信息和人生经历，标记关键节点和分岔点。AI 将基于你的真实背景，模拟如果你在某个时刻做出了不同的选择，你的人生可能会走向哪里。它不告诉你「你应该怎么选」——它只是展开一条你未曾走过的路，让你站在终点回头看看。
            </p>
          </div>
          <div>
            <div className="mb-1 flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/10 text-[10px] text-emerald-400/70">F</span>
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Future Lab</span>
            </div>
            <h3 className="text-base font-semibold">未来推演</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              从你当前的状态出发——你在纠结什么？考研还是就业？留下还是离开？AI 分析你的经历和决策模式，为你展开几条可能的未来路线，让你在选择前看到不同方向的可能性。
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">产品理念</h2>
        <div className="space-y-4">
          <PhilosophyItem title="不是预测，是展开" description="我们不预测你的未来，也不判断你的过去。AI 只是基于你提供的信息，展开如果做了不同选择可能发生的事。没有正确答案，只有不同的路径。" />
          <PhilosophyItem title="选择有价值，不是因为有对错" description="每一个选择都值得被认真对待——不是因为「选对了」或「选错了」，而是因为选择本身定义了你是一个什么样的人。" />
          <PhilosophyItem title="可能性本身有价值" description="有时候，仅仅是「看到另一种可能」就足够让人释然。你不一定真的要改变什么——知道有一条路曾经存在过，本身就是一种慰藉。" />
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">技术</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Parallel Life 基于 DeepSeek 大语言模型构建。前端使用 Next.js 和 TypeScript，数据存储在用户本地浏览器中——我们不收集、不上传、不存储你的个人信息和推演记录。
        </p>
      </section>
    </div>
  );
}

function ChangelogContent() {
  return (
    <div className="space-y-10">
      <div>
        <div className="mb-2 flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">更新日志</h1>
          <span className="rounded-full bg-primary/10 px-3 py-0.5 text-xs font-medium text-primary/80">v0.9.0 Beta</span>
        </div>
        <p className="text-sm text-muted-foreground">2026.06 · 功能完整版</p>
      </div>

      <div className="relative">
        <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border/20" />
        <div className="space-y-8">
          <TimelineItem version="v0.9.0" date="2026.06" label="Beta 发布" items={[
            "用户建模系统 + Life DNA AI 深度心理画像",
            "重启人生引擎：14 个高密度人生事件推演，支持锚点、分岔点",
            "未来推演引擎：AI 洞察 + 路线生成 + 14 个未来事件推演",
            "预选/确认/撤销令牌 · 回响系统 · 叙事状态追踪 · 硬名字锁定",
            "分岔点对比总结 · 人生数字统计",
            "统一推演引擎：重启人生与未来推演共享 useSimulation 核心",
            "移动端适配 + 原生 select 替代",
            "关于 / 隐私 / 免责 / 更新日志页面",
          ]} />
          <TimelineItem version="v0.1–v0.8" date="2026.05–06" label="核心开发" items={[
            "Next.js 16 + TypeScript + Tailwind + shadcn/ui 项目初始化",
            "Life DNA 系统 Prompt 设计与多轮迭代",
            "人生事件生成引擎：回响 · 状态追踪 · 人物连续性 · 时间线分离",
            "Future Lab 独立产品线设计：AI 洞察层 + 路线生成",
            "Zustand 持久化存储 + FutureSession 设计",
            "Cloudflare Tunnel 远程测试环境",
          ]} />
        </div>
      </div>

      <section>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Roadmap</h2>
        <div className="space-y-2.5">
          <RoadmapItem status="done" label="用户建模 + Life DNA" />
          <RoadmapItem status="done" label="重启人生 + 未来推演引擎" />
          <RoadmapItem status="done" label="推演总结 + 分享" />
          <RoadmapItem status="done" label="移动端适配" />
          <RoadmapItem status="in-progress" label="ReFork 再分叉功能" />
          <RoadmapItem status="planned" label="分享卡片生成" />
          <RoadmapItem status="planned" label="多语言支持 + Supabase 存储" />
          <RoadmapItem status="planned" label="v1.0 公开发布" />
        </div>
      </section>
    </div>
  );
}

function PrivacyContent() {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">隐私政策</h1>
        <p className="mt-2 leading-relaxed text-muted-foreground">
          隐私政策通常写得很长。我们目前是一个 MVP——所以我们写一个你能在两分钟内读完的版本。
        </p>
      </div>
      <PrivacySection icon="📋" title="我们收集什么" content={
        "你在使用 Parallel Life 时主动填写的信息：出生信息、人生经历、锚点事件、当前困惑、选择记录。我们不收集真实姓名、邮箱、手机号、IP 地址或设备指纹——因为产品不需要这些。"
      } />
      <PrivacySection icon="🎯" title="为什么收集" content={
        "原因很简单——没有这些信息，产品无法工作。我们不使用你的数据来训练模型、改进广告投放或构建用户画像。"
      } />
      <PrivacySection icon="💾" title="数据存储在哪里" content={
        "所有信息存储在浏览器的 localStorage 中——不上传至我们的服务器。唯一的例外：AI 生成请求时相关数据通过加密连接临时发送至 DeepSeek API。"
      } />
      <PrivacySection icon="🔒" title="是否与第三方共享" content={
        "不共享、不出售、不交易。你的数据只在两个地方存在：你的浏览器和 DeepSeek API 请求中。没有第三个地方。"
      } />
      <PrivacySection icon="🗑️" title="如何删除数据" content={
        "清除浏览器数据即可。我们不在服务器端保留任何用户数据，所以不存在「请客服帮忙删除」的流程。"
      } />
    </div>
  );
}

function DisclaimerContent() {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">免责声明</h1>
        <p className="mt-2 leading-relaxed text-muted-foreground">
          不是什么复杂的法律条款。只是一个坦诚的说明——关于我们的产品能做什么、不能做什么。
        </p>
      </div>
      <DisclaimerSection icon="📖" title="内容说明" content="Parallel Life 生成的文字全部由 AI 模型根据你提供的信息实时生成。它们不是预写的、不是人工编辑的，每次生成的结果都可能不同。" />
      <DisclaimerSection icon="🤖" title="AI 生成声明" content="AI 模型有时候会犯错。它可能会生成与你的实际经历不完全一致的内容。如果你看到某个细节明显不对——那不是你的问题，是我们还需要改进的地方。" />
      <DisclaimerSection icon="🔮" title="不是预测未来" content="Parallel Life 不是算命工具。我们不用玄学术语，不预测你的命运。重启人生展示的是一种「如果当初做了不同选择可能会怎样」的叙事可能性。未来推演展示的是基于你当前状态的几种可能方向——不是对你的预测。" />
      <DisclaimerSection icon="💡" title="不是专业建议" content="Parallel Life 不提供心理咨询、职业规划或任何形式的专业建议。AI 的角色是一面镜子——反射你可能忽略的自己。镜子不会告诉你该去哪里，它只是让你看清楚你站在哪里。" />
      <DisclaimerSection icon="📅" title="关于生辰信息" content="出生日期和时间是可选项。它的作用仅限于计算年龄、为叙事提供时间背景、以及作为 chronobiology 研究的微弱参考。我们不推算命理、星座或任何形式的命运。" />
      <DisclaimerSection icon="🤝" title="你的责任" content="我们提供可能性，你负责选择。你做出的任何实际人生决策——无论是否受到本产品的影响——都由你自己负责。" />
    </div>
  );
}

// ===== 子组件 =====

function PhilosophyItem({ title, description }: { title: string; description: string }) {
  return (
    <div>
      <h3 className="text-sm font-medium">{title}</h3>
      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{description}</p>
    </div>
  );
}

function TimelineItem({ version, date, label, items }: { version: string; date: string; label: string; items: string[] }) {
  return (
    <div className="relative pl-6">
      <div className="absolute left-0 top-1.5 h-3.5 w-3.5 rounded-full border-2 border-primary/40 bg-background" />
      <div className="mb-2 flex items-baseline gap-2">
        <span className="text-sm font-semibold">{version}</span>
        <span className="text-xs text-muted-foreground">{date}</span>
        <span className="rounded-full bg-card/50 px-2 py-0.5 text-[10px] text-muted-foreground">{label}</span>
      </div>
      <ul className="space-y-1">
        {items.map((item, i) => (
          <li key={i} className="text-sm leading-relaxed text-muted-foreground">· {item}</li>
        ))}
      </ul>
    </div>
  );
}

function RoadmapItem({ status, label }: { status: "done" | "in-progress" | "planned"; label: string }) {
  const icon = status === "done" ? "✓" : status === "in-progress" ? "●" : "○";
  const color = status === "done" ? "text-emerald-400/70" : status === "in-progress" ? "text-amber-400/70" : "text-muted-foreground/40";
  return (
    <div className="flex items-center gap-3">
      <span className={`text-xs ${color}`}>{icon}</span>
      <span className={`text-sm ${status === "planned" ? "text-muted-foreground/50" : "text-foreground/85"}`}>{label}</span>
      {status === "in-progress" && <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] text-amber-400/70">进行中</span>}
    </div>
  );
}

function PrivacySection({ icon, title, content }: { icon: string; title: string; content: string }) {
  return (
    <section>
      <h2 className="mb-2 flex items-center gap-2 text-base font-semibold"><span>{icon}</span> {title}</h2>
      <p className="text-sm leading-relaxed text-muted-foreground">{content}</p>
    </section>
  );
}

function DisclaimerSection({ icon, title, content }: { icon: string; title: string; content: string }) {
  return (
    <section>
      <h2 className="mb-2 flex items-center gap-2 text-base font-semibold"><span>{icon}</span> {title}</h2>
      <p className="text-sm leading-relaxed text-muted-foreground">{content}</p>
    </section>
  );
}
