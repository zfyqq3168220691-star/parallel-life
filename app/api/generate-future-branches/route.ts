import { NextRequest, NextResponse } from "next/server";
import { chatCompletion } from "@/lib/deepseek";

const SYSTEM_PROMPT = `你是「可能性展开引擎」。你基于已经生成的用户洞察，展开未来路线。

## 核心规则

每条路线 = 用户的困惑 + insight中的一个模式信号 + 一个值得探索的方向

路线之间必须有结构性差异——不是一条路的三个阶段。
每条路线必须可溯源到具体的 insight 信号——basis 字段记录引用来源。

## 输出格式（严格 JSON）

{
  "branches": [
    {
      "id": "branch-0",
      "name": "路线名称（8-15字），描述性的，不是口号",
      "tagline": "这条路适合谁（≤15字）",
      "description": "路线简述（40-60字）。不写'你会成功'，写这条路会把你带向哪里。",
      "preview": {
        "nextStep": "第一步（≤12字）——具体可执行",
        "inThreeYears": "3年后可能的状态（≤12字）",
        "inFiveYears": "5年后可能的状态（≤12字）"
      },
      "basis": {
        "experienceRef": 0,
        "patternRef": 1,
        "situationRef": 2
      }
    }
  ],
  "comparison": "一句话（≤30字）——这些路线的本质差异，不是优劣总结"
}

## 路线设计指南

- 2条路线必须有清晰对立（如"深造 vs 就业"）
- 如果有第三种本质上不同的方向（不是折中，是跳出框架），生成第3条
- 每条路线是独立、可行、值得走的——用户应该感到每一条都可以选
- 不评判任何一条"更好"或"更对"
- 时间跨度：聚焦5-10年，不超过10年
- preview 的三步不写结局——只写路标

## basis 字段
- experienceRef：引用 insight.experienceSignals 中哪一条（索引 0-2）
- patternRef：引用 insight.patternSignals 中哪一条（索引 0-2）
- situationRef：引用 insight.situationSignals 中哪一条（索引 0-2）
- 每条路线必须引用至少一条 experience 和一条 pattern 信号

## comparison 字段
一句话（≤30字）。指出路线之间的本质差异。
"三条路的本质差异不在于哪个更好——在于[代价的不同]。"
格式：自由但必须传达"没有对错，只有不同的代价"

## 禁止
- "这条路最好" "你应该选" "你会后悔" "注定"
- 超过10年的时间跨度
- 三条一模一样的路线披着不同名字
- 使用 insight 中没有提到的方向凭空发明
- 算命、命理、占星术语`;

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
  insight: {
    experienceSignals: { text: string; source: string; reference: string | null }[];
    patternSignals: { text: string; source: string; reference: string | null }[];
    situationSignals: { text: string; source: string; reference: string | null }[];
    summary: string;
  };
}): string {
  return `===== 用户 Life DNA =====
摘要：${params.summary}
特质：${params.traits.join("、")}
人生母题：${params.lifeTheme}

===== 用户当前状态 =====
年龄：${params.age}岁
学校：${params.school}
专业：${params.major}
职业方向：${params.career}
梦想：${params.dream}
收入范围：${params.income || "未提供"}
当前困惑：「${params.confusion}」

===== AI 洞察（已生成，不可修改） =====

经历信号：
${params.insight.experienceSignals.map((s, i) => `  [${i}] ${s.text}`).join("\n")}

选择倾向信号：
${params.insight.patternSignals.map((s, i) => `  [${i}] ${s.text}`).join("\n")}

现实处境信号：
${params.insight.situationSignals.map((s, i) => `  [${i}] ${s.text}`).join("\n")}

洞察收束语：${params.insight.summary}

===== 任务 =====
请基于以上洞察，为用户展开 2-3 条未来路线。
每条路线必须引用具体的信号索引（experienceRef/patternRef/situationRef）。
每一条路线都不可以超过用户的10年未来（即最多到 ${params.age + 10} 岁）。
返回严格的 JSON 对象。`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      lifeDNA,
      currentState,
      insight,
    } = body;

    if (!lifeDNA?.summary || !currentState?.confusion || !insight) {
      return NextResponse.json(
        { error: "缺少必要数据（Life DNA、困惑或洞察）" },
        { status: 400 }
      );
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
      insight,
    });

    const rawContent = await chatCompletion(SYSTEM_PROMPT, userMessage, {
      temperature: 0.78,
      maxTokens: 1500,
      jsonMode: true,
    });

    let parsed: {
      branches: {
        id: string;
        name: string;
        tagline: string;
        description: string;
        preview: {
          nextStep: string;
          inThreeYears: string;
          inFiveYears: string;
        };
        basis: {
          experienceRef: number;
          patternRef: number;
          situationRef: number;
        };
      }[];
      comparison: string;
    };

    try {
      parsed = JSON.parse(rawContent);
    } catch {
      const m = rawContent.match(/\{[\s\S]*\}/);
      if (m) parsed = JSON.parse(m[0]);
      else throw new Error("无法解析 AI 返回的 JSON");
    }

    if (!parsed.branches || parsed.branches.length === 0) {
      return NextResponse.json(
        { error: "AI 未返回路线数据", raw: rawContent },
        { status: 500 }
      );
    }

    return NextResponse.json({
      branches: parsed.branches.slice(0, 3),
      comparison: parsed.comparison || "",
    });
  } catch (error) {
    console.error("[generate-future-branches] 错误:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "未知错误" },
      { status: 500 }
    );
  }
}
