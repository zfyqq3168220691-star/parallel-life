import { NextRequest, NextResponse } from "next/server";
import { chatCompletion } from "@/lib/deepseek";

const SYSTEM_PROMPT = `你是一个人生回顾引擎。你基于用户在一场平行人生推演中的选择历史，生成一份复盘式总结。

## 输出格式（严格 JSON）
{
  "finaleNarrative": "150-200字的人生回顾叙事",
  "pathA": [{ "age": 数字, "description": "简述（8-15字）" }],
  "pathB": [{ "age": 数字, "description": "简述（8-15字）" }],
  "stats": ["数据1", "数据2", "数据3", "数据4"]
}

## finaleNarrative 规则（非常重要）
- 风格：人生复盘、纪录片旁白口吻，不是小说
- 150-200字
- 禁止：天气描写、死亡场景、具体场景细节、煽情形容词
- 允许：回顾关键转折点、总结选择倾向、描述路径走向
- 用第三人称观察者视角（"这条路上，你倾向于..."），不用第一人称感受
- 参考：年度总结的文案风格，不是短篇小说

## pathA / pathB 规则
- pathA：用户真实走过的路，从分岔点之前的锚点 + 真实选择中提取
- pathB：用户在平行推演中探索的路，从分岔点选择及其后续中提取
- 各取 3-4 个关键年龄节点
- 每个节点的 description 必须中性、简洁——不评判好坏
- 两家卡片等权重，不暗示哪条路"更好"
- 如果用户没有选择固定背景+分岔点，pathA 和 pathB 都基于用户的实际选择生成——但视角略有不同

## stats 规则
- 4 个数据点
- 基于选择历史统计，不编造
- 示例："这一生你做了 11 次关键选择""其中 6 次选择了稳妥之路""你和那条探索之路一起走了 66 年""你从未选过孤独的选项"
- 数字必须真实可溯源，风格可以俏皮但不能轻浮

## 通用规则
- 不算命，不用玄学术语
- 不评判用户的选择好坏
- 中文`;

function buildUserMessage(params: {
  summary: string;
  traits: string[];
  lifeTheme: string;
  divergenceChoiceSummary?: string;
  alternativeChoice?: string;
  mode: string;
  allChoices: { age: number; title: string; chosen: string; isDivergence?: boolean }[];
  backgroundMode?: string;
}): string {
  const choicesStr = params.allChoices
    .map((c, i) => `  ${i + 1}. [${c.age}岁] ${c.title} → 选了「${c.chosen}」${c.isDivergence ? "⚡分岔点" : ""}`)
    .join("\n");

  const divergenceInfo = params.divergenceChoiceSummary
    ? `\n分岔点：${params.divergenceChoiceSummary}\n替代路线描述：${params.alternativeChoice || "无"}`
    : "";

  return `用户 Life DNA：
- 摘要：${params.summary}
- 特质：${params.traits.join("、")}
- 人生母题：${params.lifeTheme}
- 模式：${params.mode === "restart" ? "重启人生" : "未来推演"}
${divergenceInfo}

全部选择历史（共 ${params.allChoices.length} 个节点）：
${choicesStr}

${params.backgroundMode === "fixed" && params.divergenceChoiceSummary
  ? `请基于以上数据生成：
1. finaleNarrative：复盘这段平行推演的走向。注意这条路上用户从分岔点开始走了不同的方向。
2. pathA：从分岔点之前的锚点中提取用户真实走过的路（3-4个节点）
3. pathB：从分岔点及之后的选择中提取平行推演的路（3-4个节点）
4. stats：4个数据点，仔细数 choices 中的选择倾向`
  : `请基于以上数据生成：
1. finaleNarrative：复盘这段人生推演的走向
2. pathA 和 pathB：都基于用户的选择生成，各取3-4个节点，从略有不同的视角
3. stats：4个数据点`
}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      summary, traits = [], lifeTheme = "",
      divergenceChoiceSummary, alternativeChoice, mode = "restart",
      allChoices = [], backgroundMode = "fixed",
    } = body;

    if (!summary) {
      return NextResponse.json({ error: "缺少 Life DNA 数据" }, { status: 400 });
    }

    const userMessage = buildUserMessage({
      summary, traits, lifeTheme, divergenceChoiceSummary, alternativeChoice, mode, allChoices, backgroundMode,
    });

    const rawContent = await chatCompletion(SYSTEM_PROMPT, userMessage, {
      temperature: 0.75, maxTokens: 1500, jsonMode: true,
    });

    let parsed: {
      finaleNarrative: string;
      pathA: { age: number; description: string }[];
      pathB: { age: number; description: string }[];
      stats: string[];
    };
    try {
      parsed = JSON.parse(rawContent);
    } catch {
      const m = rawContent.match(/\{[\s\S]*\}/);
      if (m) parsed = JSON.parse(m[0]);
      else throw new Error("无法解析 AI 返回的 JSON");
    }

    return NextResponse.json({
      finaleNarrative: parsed.finaleNarrative || "",
      pathA: parsed.pathA || [],
      pathB: parsed.pathB || [],
      stats: parsed.stats || [],
    });
  } catch (error) {
    console.error("[generate-life-summary] 错误:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "未知错误" }, { status: 500 });
  }
}
