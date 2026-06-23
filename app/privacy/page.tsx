import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "隐私政策 — Parallel Life",
  description:
    "Parallel Life 如何收集、使用和保护你的数据。简单透明，不藏着掖着。",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 sm:py-28">
      {/* 页头 */}
      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/30 bg-card/50 px-3 py-1 text-xs text-muted-foreground backdrop-blur-sm">
        Privacy
      </div>
      <h1 className="mb-3 text-3xl font-bold tracking-tight">隐私政策</h1>
      <p className="mb-12 leading-relaxed text-muted-foreground">
        隐私政策通常写得很长，因为它们要应付各种极端情况。我们目前是一个
        MVP——所以我们写一个你能在两分钟内读完的版本。
      </p>

      {/* ===== 内容 ===== */}
      <div className="space-y-10">
        {/* 1. 收集哪些信息 */}
        <section>
          <h2 className="mb-3 flex items-center gap-2 text-base font-semibold">
            <span className="text-lg">📋</span> 我们收集什么
          </h2>
          <p className="leading-relaxed text-muted-foreground">
            你在使用 Parallel Life 时主动填写的信息。具体来说：
          </p>
          <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-muted-foreground">
            <li>
              · <strong>人生建模信息</strong>——出生日期（可选）、出生地点、学校、专业、职业、收入范围、人生梦想
            </li>
            <li>
              · <strong>人生锚点与分岔点</strong>——你标记的真实人生关键事件（可选）
            </li>
            <li>
              · <strong>当前困惑</strong>——你在 Future Lab
              中输入的纠结问题
            </li>
            <li>
              · <strong>选择记录</strong>——你在推演过程中做出的每个选择
            </li>
          </ul>
          <p className="mt-2 leading-relaxed text-muted-foreground">
            我们不收集：你的真实姓名、邮箱、手机号、社交媒体账号、IP
            地址、设备指纹、浏览历史——因为我们的产品不需要这些。
          </p>
        </section>

        {/* 2. 为什么收集 */}
        <section>
          <h2 className="mb-3 flex items-center gap-2 text-base font-semibold">
            <span className="text-lg">🎯</span> 为什么收集
          </h2>
          <p className="leading-relaxed text-muted-foreground">
            原因很简单——没有这些信息，产品无法工作。你填写的出生信息、人生经历和困惑是
            AI 生成内容的唯一依据。你不填，AI 就没有上下文，只能凭空编造。
          </p>
          <p className="mt-2 leading-relaxed text-muted-foreground">
            我们不使用你的数据来训练模型、改进广告投放、构建用户画像或任何其他目的。目前我们没有这些功能，以后也不会加。
          </p>
        </section>

        {/* 3. 数据如何存储 */}
        <section>
          <h2 className="mb-3 flex items-center gap-2 text-base font-semibold">
            <span className="text-lg">💾</span> 数据存储在哪里
          </h2>
          <p className="leading-relaxed text-muted-foreground">
            你填写的所有信息都存储在你的设备上——浏览器的
            localStorage。这意味着：
          </p>
          <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-muted-foreground">
            <li>· 数据不上传到我们的服务器（我们目前没有服务器数据库）</li>
            <li>· 我们无法在后台查看或导出你的数据</li>
            <li>· 换一台设备或换一个浏览器，数据不会自动同步</li>
            <li>· 清除浏览器数据后，信息将永久丢失且不可恢复</li>
          </ul>
          <p className="mt-2 leading-relaxed text-muted-foreground">
            唯一的例外：当你使用产品的 AI
            功能时，部分信息（如人生画像摘要、选择记录）会通过加密连接发送至
            DeepSeek API 以生成 AI 回复。这些信息仅用于当前请求，不会在
            DeepSeek 服务器上持久存储。
          </p>
        </section>

        {/* 4. 第三方共享 */}
        <section>
          <h2 className="mb-3 flex items-center gap-2 text-base font-semibold">
            <span className="text-lg">🔒</span> 我们是否与第三方共享数据
          </h2>
          <p className="leading-relaxed text-muted-foreground">
            不共享、不出售、不交易。
          </p>
          <p className="mt-2 leading-relaxed text-muted-foreground">
            你的数据只在两个地方存在：你的浏览器本地存储中，以及在 AI
            生成请求时临时发送至 DeepSeek API。没有第三个地方。
          </p>
          <p className="mt-2 leading-relaxed text-muted-foreground">
            我们不使用任何分析工具、广告 SDK、追踪脚本或第三方登录服务。这个页面上没有任何东西在默默看着你。
          </p>
        </section>

        {/* 5. 删除数据 */}
        <section>
          <h2 className="mb-3 flex items-center gap-2 text-base font-semibold">
            <span className="text-lg">🗑️</span> 如何删除你的数据
          </h2>
          <p className="leading-relaxed text-muted-foreground">
            因为数据存在你自己的设备上，删除它和你删除任何其他网站数据一样简单：
          </p>
          <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-muted-foreground">
            <li>· 打开浏览器设置 → 隐私与安全 → 清除浏览数据</li>
            <li>
              · 或者在开发者工具中执行{' '}
              <code className="rounded bg-muted px-1 py-0.5 text-xs">
                localStorage.clear()
              </code>
            </li>
            <li>· 或者直接卸载浏览器</li>
          </ul>
          <p className="mt-2 leading-relaxed text-muted-foreground">
            我们不在服务器端保留任何用户数据，所以不存在「请客服帮我删除」这个流程——数据本来就不在我们这里。
          </p>
        </section>

        {/* 6. 联系方式 */}
        <section>
          <h2 className="mb-3 flex items-center gap-2 text-base font-semibold">
            <span className="text-lg">📬</span> 联系方式
          </h2>
          <p className="leading-relaxed text-muted-foreground">
            如果你对隐私有任何疑问、建议或投诉，请联系产品开发者。
          </p>
          <p className="mt-2 leading-relaxed text-muted-foreground">
            MVP 阶段暂无独立隐私团队——所有反馈由开发者直接处理。我们会在合理时间内回复。
          </p>
        </section>
      </div>

      {/* 底部分隔 */}
      <div className="mt-16 border-t border-border/20 pt-8">
        <p className="text-xs leading-relaxed text-muted-foreground/50">
          最后更新：2026年6月 · 本政策可能随产品迭代而更新
        </p>
      </div>
    </div>
  );
}
