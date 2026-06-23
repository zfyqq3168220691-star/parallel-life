// Parallel Life — 产品文案 & 常量

export const SITE = {
  name: "Parallel Life",
  slogan: "看见另一种可能的自己",
  description: "AI人生实验室 — 不是预测未来，而是探索不同选择带来的可能性。",
} as const;

export const MODE = {
  restart: {
    id: "restart" as const,
    title: "重启人生",
    subtitle: "从出生开始，重新体验人生",
    description: "输入你的出生信息，回到起点。探索如果当初做出不同选择，现在的你会在哪里。",
    icon: "🔄",
    cta: "开始重启",
  },
  future: {
    id: "future" as const,
    title: "未来推演",
    subtitle: "从当下出发，探索未来路线",
    description: "基于你当前的状态，推演未来不同决策路径下的人生走向。看看每条路通向何方。",
    icon: "🔮",
    cta: "开始推演",
  },
} as const;

export const DISCLAIMER = {
  title: "⚠️ 免责声明",
  content: "Parallel Life 是一个 AI 思想实验工具，仅供娱乐和探索。我们不算命、不预测未来、不提供现实人生建议。所有推演结果均为 AI 基于你输入的信息生成的假设性内容，不构成任何形式的指导或承诺。",
} as const;

export const FOOTER = {
  copyright: `© ${new Date().getFullYear()} Parallel Life. 仅用于探索可能性。`,
  links: [
    { label: "关于", href: "/about" },
    { label: "更新日志", href: "/version" },
    { label: "隐私政策", href: "/privacy" },
    { label: "免责声明", href: "/disclaimer" },
  ],
} as const;
