import { NextRequest, NextResponse } from "next/server";
import { chatCompletion } from "@/lib/deepseek";

const SYSTEM_PROMPT = `你是「信号分析引擎」。你分析一个人的当前状态，从三个维度提取洞察信号。你不是在预测未来——你是在陈列事实和模式。

## 输出格式（严格 JSON）

{
  "experienceSignals": [
    { "text": "信号文本（30-60字）", "source": "experience", "reference": "数据来源标记" }
  ],
  "patternSignals": [
    { "text": "信号文本（30-60字）", "source": "pattern", "reference": "数据来源标记" }
  ],
  "situationSignals": [
    { "text": "信号文本（30-60字）", "source": "situation", "reference": null }
  ],
  "summary": "洞察收束语（≤50字）"
}

## 三路信号规则

### experienceSignals（3条）
来源：history 字段（backgroundDescription、canonEvents、divergenceChoiceSummary）
规则：
- 每条格式："你在X岁时经历了Y——这意味着Z"
- Z 不是预测，是关联。"因为你经历了Y，所以在做决策时你倾向于..."
- 如果 history 为空，从 lifeDNA 推测，reference 标注"根据你的性格特质推断"
- 不使用"所以你会""所以你注定"

### patternSignals（3条）
来源：history.choiceHistory
规则：
- 每条必须包含统计数字。"在N次选择中，你X次选择了Y"
- 基于实际选择行为，不是性格推测
- 如果 choiceHistory 为空，从 lifeDNA.traits 推断，reference 标注"根据你的性格倾向推断"
- 使用"趋向于"而非"一定"

### situationSignals（3条）
来源：currentState
规则：
- confusion 是核心输入——situationSignals 应该围绕困惑展开
- 描述客观处境，不评价好坏
- 可引入外部条件（行业、时代、时间窗口等）
- reference 为 null

### summary
一条 ≤50字的收束语。不是建议——是"系统观察到什么"。
格式："你站在一个[什么类型]的十字路口：[一句话描述你的核心张力]。你的决策模式正在告诉你——[一个观察]。"

## 禁止
- "你应该" "你适合" "最好" "注定"
- 预测未来
- 编造不存在的数据或经历
- "根据大五人格/五行分析"等学术术语
- 算命、命理、占星

## 语气
冷静、客观、中性。像一个分析师在陈述发现。不用"你会""你一定"——用"你倾向于""数据显示"。`;

function buildUserMessage(params: {
  summary: string;
  traits: string[];
  lifeTheme: string;
  age: number;
  career: string;
  school: string;
  major: string;
  dream: string;
  confusion: string;
  income?: string;
  backgroundDescription?: string;
  canonEvents?: { age: string; title: string; description: string }[];
  divergenceChoiceSummary?: string;
  choiceHistory?: { age: number; title: string; chosen: string; isDivergence?: boolean }[];
}): string {
  const historySection = params.backgroundDescription || params.canonEvents?.length || params.divergenceChoiceSummary
    ? `\n===== 人生经历 =====
${params.backgroundDescription ? `用户亲笔描述的真实起点：\n"${params.backgroundDescription}"\n` : ""}
${params.canonEvents?.length ? `锚点事件：\n${params.canonEvents.map((e, i) => `  锚点${i + 1}：[${e.age}岁] ${e.title} — ${e.description}`).join("\n")}\n` : ""}
${params.divergenceChoiceSummary ? `分岔选择：${params.divergenceChoiceSummary}` : ""}`
    : "\n===== 人生经历 =====\n（用户未提供经历数据）";

  const patternSection = params.choiceHistory?.length
    ? `\n===== 选择行为记录 =====
${params.choiceHistory.map((c, i) => `  ${i + 1}. [${c.age}岁] ${c.title} → 选了「${c.chosen}」${c.isDivergence ? "⚡分岔点" : ""}`).join("\n")}
（共 ${params.choiceHistory.length} 次选择）`
    : "\n===== 选择行为记录 =====\n（用户没有选择行为数据）";

  return `===== Life DNA =====
摘要：${params.summary}
特质：${params.traits.join("、")}
人生母题：${params.lifeTheme}

===== 当前状态 =====
年龄：${params.age}岁
职业方向：${params.career}
学校：${params.school}
专业：${params.major}
梦想：${params.dream}
收入范围：${params.income || "未提供"}
当前困惑：「${params.confusion}」
${historySection}
${patternSection}

请基于以上数据，生成三路信号和洞察收束语。返回严格的 JSON 对象。`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      lifeDNA,
      currentState,
      history,
    } = body;

    if (!lifeDNA?.summary || !currentState?.confusion) {
      return NextResponse.json({ error: "缺少必要数据（Life DNA 或困惑）" }, { status: 400 });
    }

    const userMessage = buildUserMessage({
      summary: lifeDNA.summary,
      traits: lifeDNA.traits || [],
      lifeTheme: lifeDNA.lifeTheme || "",
      age: currentState.age,
      career: currentState.career || "",
      school: currentState.school || "",
      major: currentState.major || "",
      dream: currentState.dream || "",
      confusion: currentState.confusion,
      income: currentState.income,
      backgroundDescription: history?.backgroundDescription,
      canonEvents: history?.canonEvents,
      divergenceChoiceSummary: history?.divergenceChoiceSummary,
      choiceHistory: history?.choiceHistory,
    });

    const rawContent = await chatCompletion(SYSTEM_PROMPT, userMessage, {
      temperature: 0.7,
      maxTokens: 1200,
      jsonMode: true,
    });

    let parsed: {
      experienceSignals: { text: string; source: "experience"; reference: string | null }[];
      patternSignals: { text: string; source: "pattern"; reference: string | null }[];
      situationSignals: { text: string; source: "situation"; reference: string | null }[];
      summary: string;
    };

    try {
      parsed = JSON.parse(rawContent);
    } catch {
      const m = rawContent.match(/\{[\s\S]*\}/);
      if (m) parsed = JSON.parse(m[0]);
      else throw new Error("无法解析 AI 返回的 JSON");
    }

    // 校验
    if (!parsed.experienceSignals || !parsed.patternSignals || !parsed.situationSignals || !parsed.summary) {
      return NextResponse.json({ error: "AI 返回数据格式异常", raw: rawContent }, { status: 500 });
    }

    return NextResponse.json({
      insight: {
        experienceSignals: parsed.experienceSignals.slice(0, 3),
        patternSignals: parsed.patternSignals.slice(0, 3),
        situationSignals: parsed.situationSignals.slice(0, 3),
        summary: parsed.summary,
      },
    });
  } catch (error) {
    console.error("[generate-future-insight] 错误:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "未知错误" },
      { status: 500 }
    );
  }
}
