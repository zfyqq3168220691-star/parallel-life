import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "关于 Parallel Life",
  description:
    "Parallel Life 是一个 AI 人生探索实验室。不是预测命运，不是算命工具——而是帮助用户从不同角度重新理解自己的人生选择。",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 sm:py-28">
      {/* ===== Hero ===== */}
      <section className="mb-20">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/30 bg-card/50 px-3 py-1 text-xs text-muted-foreground backdrop-blur-sm">
          About
        </div>
        <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
          Parallel Life
        </h1>
        <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
          AI 人生探索实验室——不是预测命运，不是算命工具，而是帮助你从不同角度重新理解自己的人生选择。
        </p>
      </section>

      {/* ===== 两个模块 ===== */}
      <section className="mb-20 space-y-12">
        {/* Restart Life */}
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-[10px] text-primary/70">
              R
            </span>
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Restart Life
            </span>
          </div>
          <h2 className="mb-3 text-xl font-semibold tracking-tight">重启人生</h2>
          <p className="leading-relaxed text-muted-foreground">
            输入你的出生信息和人生经历，标记关键节点和分岔点。AI
            将基于你的真实背景，模拟如果你在某个时刻做出了不同的选择，你的人生可能会走向哪里。
          </p>
          <p className="mt-2 leading-relaxed text-muted-foreground">
            它不告诉你「你应该怎么选」——它只是展开一条你未曾走过的路，让你站在终点回头看看。
          </p>
        </div>

        {/* Future Lab */}
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/10 text-[10px] text-emerald-400/70">
              F
            </span>
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Future Lab
            </span>
          </div>
          <h2 className="mb-3 text-xl font-semibold tracking-tight">未来推演</h2>
          <p className="leading-relaxed text-muted-foreground">
            从你当前的状态出发——你在纠结什么？考研还是就业？留下还是离开？AI
            分析你的经历和决策模式，为你展开几条可能的未来路线，让你在选择前看到不同方向的可能性。
          </p>
          <p className="mt-2 leading-relaxed text-muted-foreground">
            它不是职业规划工具。它不告诉你哪条路更好——它只是在你做决定前，帮你多看几步。
          </p>
        </div>
      </section>

      {/* ===== 产品理念 ===== */}
      <section className="mb-20">
        <h2 className="mb-6 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          产品理念
        </h2>
        <div className="space-y-4">
          <PhilosophyItem
            title="不是预测，是展开"
            description="我们不预测你的未来，也不判断你的过去。AI 只是基于你提供的信息，展开如果做了不同选择可能发生的事。没有正确答案，只有不同的路径。"
          />
          <PhilosophyItem
            title="选择有价值，不是因为有对错"
            description="每一个选择都值得被认真对待——不是因为「选对了」或「选错了」，而是因为选择本身定义了你是一个什么样的人。"
          />
          <PhilosophyItem
            title="你最了解你自己"
            description="AI 生成的内容基于你输入的数据和选择记录。它不是权威，不是先知。它是一面镜子——反射出你可能忽略的自己。"
          />
          <PhilosophyItem
            title="可能性本身有价值"
            description="有时候，仅仅是「看到另一种可能」就足够让人释然。你不一定真的要改变什么——知道有一条路曾经存在过，本身就是一种慰藉。"
          />
        </div>
      </section>

      {/* ===== 技术 ===== */}
      <section className="mb-20">
        <h2 className="mb-6 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          技术
        </h2>
        <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
          <p>
            Parallel Life 基于 DeepSeek 大语言模型构建。前端使用 Next.js 和
            TypeScript，数据存储在用户本地浏览器中——我们不收集、不上传、不存储你的个人信息和推演记录。
          </p>
          <p>
            你的所有人生数据、选择记录和推演结果都保存在你自己的设备上。关闭浏览器后，只有你可以再次访问这些数据。
          </p>
        </div>
      </section>

      {/* ===== 页脚 ===== */}
      <footer className="border-t border-border/20 pt-10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium">Parallel Life</p>
            <p className="text-xs text-muted-foreground">
              AI 人生探索实验室 · 看见另一种可能的自己
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Parallel Life. 仅用于探索可能性。
          </p>
        </div>
        <p className="mt-6 text-xs leading-relaxed text-muted-foreground/60">
          本产品使用 AI 生成内容。AI
          生成的内容可能存在不准确之处。本产品不构成任何人生建议、心理咨询或决策指导。所有推演结果仅供探索和反思，不应作为实际决策的依据。
        </p>
      </footer>
    </div>
  );
}

function PhilosophyItem({
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
