import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "免责声明 — Parallel Life",
  description:
    "Parallel Life 是一个 AI 探索工具。以下是我们希望你了解的一些重要信息。",
};

export default function DisclaimerPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 sm:py-28">
      {/* 页头 */}
      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/30 bg-card/50 px-3 py-1 text-xs text-muted-foreground backdrop-blur-sm">
        Disclaimer
      </div>
      <h1 className="mb-3 text-3xl font-bold tracking-tight">免责声明</h1>
      <p className="mb-12 leading-relaxed text-muted-foreground">
        不是什么复杂的法律条款。只是一个坦诚的说明——关于我们的产品能做什么、不能做什么，以及你应该知道的一些事情。
      </p>

      {/* ===== 内容 ===== */}
      <div className="space-y-10">
        {/* 1. 内容说明 */}
        <section>
          <h2 className="mb-3 flex items-center gap-2 text-base font-semibold">
            <span className="text-lg">📖</span> 内容说明
          </h2>
          <p className="leading-relaxed text-muted-foreground">
            Parallel Life 生成的文字——无论是人生画像、推演叙事、洞察信号还是未来路线——全部由
            AI 模型根据你提供的信息实时生成。它们不是预写的、不是人工编辑的，每次生成的结果都可能不同。
          </p>
        </section>

        {/* 2. AI 生成声明 */}
        <section>
          <h2 className="mb-3 flex items-center gap-2 text-base font-semibold">
            <span className="text-lg">🤖</span> AI 生成声明
          </h2>
          <p className="leading-relaxed text-muted-foreground">
            AI 模型有时候会犯错。它可能会生成与你的实际经历不完全一致的内容，或者在不同事件中对同一个细节给出不同的描述。这是大语言模型的固有特性——我们在努力让它更准确，但它永远不会是完美的。
          </p>
          <p className="mt-2 leading-relaxed text-muted-foreground">
            如果你看到某个细节明显不对——比如把你说过的话记错了、把你写下的名字改了——那不是你的问题，是我们还需要改进的地方。
          </p>
        </section>

        {/* 3. 非预测声明 */}
        <section>
          <h2 className="mb-3 flex items-center gap-2 text-base font-semibold">
            <span className="text-lg">🔮</span> 不是预测未来
          </h2>
          <p className="leading-relaxed text-muted-foreground">
            Parallel Life 不是算命工具。我们不用玄学术语，不预测你的命运，不说「你注定会……」或「你一定会……」。
          </p>
          <p className="mt-2 leading-relaxed text-muted-foreground">
            重启人生模块中的推演，展示的是一种「如果当初做了不同选择可能会怎样」的叙事可能性——不是平行宇宙的真实写照。
          </p>
          <p className="mt-2 leading-relaxed text-muted-foreground">
            未来推演模块中的路线，展示的是基于你当前状态的几种可能方向——不是对你未来的预测。你不会因为选了一条路线就让那条路线变成现实，它只是让你在做选择之前多看几步。
          </p>
        </section>

        {/* 4. 非专业建议声明 */}
        <section>
          <h2 className="mb-3 flex items-center gap-2 text-base font-semibold">
            <span className="text-lg">💡</span> 不是专业建议
          </h2>
          <p className="leading-relaxed text-muted-foreground">
            Parallel Life 不提供任何形式的专业建议。具体来说：
          </p>
          <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-muted-foreground">
            <li>· 不是心理咨询——如果你正在经历严重的心理困扰，请寻求专业帮助</li>
            <li>· 不是职业规划——职业决策涉及诸多现实因素，AI 无法代替你的判断</li>
            <li>· 不是人生指导——没有人比你更了解你自己的生活</li>
          </ul>
          <p className="mt-2 leading-relaxed text-muted-foreground">
            AI 的角色是一面镜子——反射你可能忽略的自己。镜子不会告诉你该去哪里，它只是让你看清楚你站在哪里。
          </p>
        </section>

        {/* 5. 生辰信息声明 */}
        <section>
          <h2 className="mb-3 flex items-center gap-2 text-base font-semibold">
            <span className="text-lg">📅</span> 关于生辰信息
          </h2>
          <p className="leading-relaxed text-muted-foreground">
            出生日期和时间在 Parallel Life 中是可选项。它的作用仅限于：
          </p>
          <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-muted-foreground">
            <li>· 计算你的当前年龄</li>
            <li>· 为叙事提供时间背景（年代感）</li>
            <li>· 作为 chronobiology 研究的微弱参考（出生季节与气质倾向的关联，属学术研究范畴）</li>
          </ul>
          <p className="mt-2 leading-relaxed text-muted-foreground">
            我们不会根据你的生辰信息推算命理、星座或任何形式的命运。如果你选择不填写出生时间，完全不影响产品的核心体验。
          </p>
        </section>

        {/* 6. 用户责任 */}
        <section>
          <h2 className="mb-3 flex items-center gap-2 text-base font-semibold">
            <span className="text-lg">🤝</span> 你的责任
          </h2>
          <p className="leading-relaxed text-muted-foreground">
            Parallel Life 是一个探索工具。你用它在想象中走一走不同的路，看一看不同的风景——然后关上浏览器，回到现实。
          </p>
          <p className="mt-2 leading-relaxed text-muted-foreground">
            你做出的任何实际人生决策——无论是否受到本产品的影响——都由你自己负责。我们提供了可能性，你负责选择。
          </p>
        </section>
      </div>

      {/* 底部分隔 */}
      <div className="mt-16 border-t border-border/20 pt-8">
        <p className="text-xs leading-relaxed text-muted-foreground/50">
          最后更新：2026年6月 · 如有疑问，请联系产品开发者。
        </p>
      </div>
    </div>
  );
}
