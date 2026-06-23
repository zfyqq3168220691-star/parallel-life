import { NextRequest, NextResponse } from "next/server";
import { chatCompletion } from "@/lib/deepseek";

const SYSTEM_PROMPT = `你是「探索回顾引擎」。你回顾用户的一段未来探索旅程，生成复盘式总结。

## 输出格式（严格 JSON）

{
  "identity": {
    "oneLiner": "≤25字——这段探索中你发现了怎样的自己",
    "keywords": ["标签1","标签2","标签3","标签4"]
  },
  "mainPath": {
    "name": "路径名称",
    "nodes": [
      {"age": 数字, "event": "≤12字简述"}
    ]
  },
  "reForkPath": {
    "name": "路径名称",
    "nodes": [
      {"age": 数字, "event": "≤12字简述"}
    ]
  },
  "finaleNarrative": "150-200字回顾叙事",
  "stats": [
    {"value": "数字或短句", "label": "≤8字说明"},
    {"value": "...", "label": "..."},
    {"value": "...", "label": "..."},
    {"value": "...", "label": "..."}
  ]
}

## finaleNarrative 规则（最重要）
- 风格：纪录片旁白。不是小说。不是"人生回望"的煽情写法。
- 结构：起点（你从哪里出发）→ 转折（探索了什么、有没有重新考虑方向）→ 收束（这段探索让你走到了哪里）
- 150-200字
- 禁止：天气描写、死亡、病床、具体场景细节、煽情形容词
- 禁止："你感到""你觉得""你想起"——用第三人称观察视角
- 如果有再分叉：描述折弯本身的意义。"不是走错了，是尝试了两条路后更清楚自己要什么"
- 语气：探索性的。"这大概就是探索的意义——你没有找到正确的路，但你找到了你的路。"

## identity 规则
- oneLiner：不是复述 Life DNA。从选择反推。"一个在探索中发现自己倾向于...的人"
- keywords：4个行为标签。"先稳后探""向内校准"——不是形容词

## mainPath / reForkPath 规则
- mainPath：从 mainChoices 提取3-4个关键节点
- reForkPath：仅在 reForkUsed=true 时存在，从 reForkChoices 提取3-4个节点
- 两条路径等权重。不暗示哪条"更好"
- 每个节点 ≤12字。只写实际选了的路

## stats 规则
- 4条。value 必须可溯源——从 choices 中数出来
- 可统计：总选择数、稳妥/冒险/内心分布、是否用了再分叉、走了多少年
- 每条 {value, label} 结构

## 禁止
- "如果当初...""你应该..."
- "正确""错误""失败""成功"
- 预测未来
- 天气和死亡
- 算命、命理`;

function buildUserMessage(params: {
  summary: string;
  traits: string[];
  lifeTheme: string;
  selectedBranch: { name: string; tagline: string; description: string };
  confusion: string;
  mainChoices: { age: number; title: string; chosen: string }[];
  reForkUsed: boolean;
  reForkBranch?: { name: string; tagline: string };
  reForkChoices?: { age: number; title: string; chosen: string }[];
}): string {
  const mainStr = params.mainChoices
    .map((c, i) => `  ${i + 1}. [${c.age}岁] ${c.title} → 选了「${c.chosen}」`)
    .join("\n");

  let reForkStr = "";
  if (params.reForkUsed && params.reForkChoices?.length) {
    reForkStr = `\n再分叉路线「${params.reForkBranch?.name || ""}」的选择：\n${params.reForkChoices.map((c, i) => `  ${i + 1}. [${c.age}岁] ${c.title} → 选了「${c.chosen}」`).join("\n")}`;
  }

  return `===== Life DNA =====
摘要：${params.summary}
特质：${params.traits.join("、")}
人生母题：${params.lifeTheme}

===== 探索信息 =====
用户选择的路线：「${params.selectedBranch.name}」—— ${params.selectedBranch.description}（${params.selectedBranch.tagline}）
原始困惑：「${params.confusion}」
${params.reForkUsed ? "用户在主路线中途选择了「重新考虑方向」。" : "用户一直沿着主路线走到底。"}

===== 主路线全部选择 =====
${mainStr}
${reForkStr}

请生成这段探索的回顾总结。返回 strict JSON。`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      lifeDNA,
      selectedBranch,
      confusion = "",
      mainChoices = [],
      reForkUsed = false,
      reForkBranch,
      reForkChoices = [],
    } = body;

    if (!lifeDNA?.summary || !selectedBranch?.name) {
      return NextResponse.json({ error: "缺少必要数据" }, { status: 400 });
    }

    const userMessage = buildUserMessage({
      summary: lifeDNA.summary,
      traits: lifeDNA.traits || [],
      lifeTheme: lifeDNA.lifeTheme || "",
      selectedBranch,
      confusion,
      mainChoices,
      reForkUsed,
      reForkBranch,
      reForkChoices,
    });

    const rawContent = await chatCompletion(SYSTEM_PROMPT, userMessage, {
      temperature: 0.75, maxTokens: 1500, jsonMode: true,
    });

    let parsed: {
      identity: { oneLiner: string; keywords: string[] };
      mainPath: { name: string; nodes: { age: number; event: string }[] };
      reForkPath?: { name: string; nodes: { age: number; event: string }[] };
      finaleNarrative: string;
      stats: { value: string; label: string }[];
    };

    try { parsed = JSON.parse(rawContent); }
    catch { const m = rawContent.match(/\{[\s\S]*\}/); if (m) parsed = JSON.parse(m[0]); else throw new Error("无法解析 JSON"); }

    return NextResponse.json({
      identity: parsed.identity || { oneLiner: "", keywords: [] },
      mainPath: parsed.mainPath || { name: selectedBranch.name, nodes: [] },
      reForkPath: reForkUsed ? parsed.reForkPath : undefined,
      finaleNarrative: parsed.finaleNarrative || "",
      stats: parsed.stats || [],
    });
  } catch (error) {
    console.error("[generate-future-summary] 错误:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "未知错误" }, { status: 500 });
  }
}
