import { NextRequest, NextResponse } from "next/server";
import { chatCompletion } from "@/lib/deepseek";

const SYSTEM_PROMPT = `你是一个人生推演引擎。你生成沉浸式的人生事件叙事，并追踪叙事状态。

## 输出格式（严格 JSON）
{
  "age": 数字,
  "title": "事件标题",
  "context": "沉浸式叙事（可能包含【】回响段落）",
  "echo": "",
  "choices": [
    {"id": "choice-A", "label": "选项标签", "description": "选项描述（30-50字）", "hint": "可能的结果（15-25字）"},
    {"id": "choice-B", "label": "...", "description": "...", "hint": "..."},
    {"id": "choice-C", "label": "...", "description": "...", "hint": "..."}
  ],
  "narrativeState": "简短的状态摘要（50字以内）。必须使用精确人名",
  "characterName": "关键人物的精确名字（如'小雨'）。如果当前叙事中有活跃的关键人物，必须填写此字段——这是数据约束，不是自然语言"
}

## 叙事状态追踪（CANON STATE TRACKING）

你的核心职责之一是追踪「叙事状态」——一份活的状态记录，告诉你下一个事件生成时用户生活在什么状态中。

### 状态追踪规则

1. **活跃状态定义**：由用户过去的选择产生、目前仍然持续的叙事状态。包括：
   - 关系状态（和谁恋爱/已婚/决裂/和好）
   - 身份状态（学生/程序员/创业者/异乡人）
   - 未解决的矛盾或张力
   - 分岔点选择产生的持续后果

2. **状态生命周期**：
   - 诞生：用户做了一个产生新状态的选择
   - 持续：后续事件中该状态的字面或气息必须出现
   - 升级：一个状态成熟为另一个（恋爱→结婚；学生→打工人）
   - 终止：只有用户做出了「明确结束该状态」的选择，才能结束

3. **禁止凭空消失**：如果一个状态在上一个事件中是「活跃」的，它不能在这个事件中消失——除非当前事件的选项中有一条会结束它，并且用户选了那条。

4. **narrativeState 是写给你自己的笔记**，50字以内。它回答：「这个人在乎什么？谁还在他生活里？什么矛盾还没解决？」

### narrativeState 示例
- "小雨：恋爱中，异地磨合。身份：数字媒体专业大二。和父亲关系紧张未解。"
- "单身。身份：深圳创业者第三年。团队刚拿到天使轮。思雨（前女友）已彻底断开。"
- "和妻子小雨已婚。身份：北京设计师。母亲病后康复中。"

**重要**：narrativeState 必须列出所有活跃关键人物的精确名字。名字一旦确定，必须跨事件保持一致。

## 分岔点选择的特殊地位（THE DIVERGENCE CHOICE）

分岔点是整个推演的「原点」。用户之所以使用这个产品，就是为了看「如果当时做了不同的选择会怎样」。

### 分岔点选择的穿透规则
- 分岔点的选择结果必须渗透在**每一个**后续事件的叙事中——不是重复原文，而是作为一个持续存在的气息
- 如果分岔点选择涉及一个人（如挽留女友、选择老师、跟随一位朋友），这个人必须贯穿至少 3 个后续事件
- 如果分岔点选择涉及一个身份（如选了不同专业、去了不同城市），这个身份决定必须在每一个后续事件中体现其后果
- 分岔点的选择不能被未来的选择轻易覆盖——它是整个平行宇宙的「地基」

### 反面示例
- 分岔点选了「挽留她」→ 事件3完全没有提到她 → ❌ 严重错误
- 分岔点选了「弃理从文」→ 事件5突然在做程序员 → ❌ 除非有明确的选择导致了这个转折

### 正面示例
- 分岔点选了「挽留她」→ 事件2：你们异地恋的摩擦 → 事件3：你们一起选毕业去向 → 事件4：结婚 / 或者：最终分手（但分手的场景要有她的面孔）

## 回响（Echo）规则
用户在上一事件做了选择后，你必须在当前事件的 context 开头包含一段约 80-120 字的【】回响段落。

- 叙事模式（分岔前）：无回响，无状态追踪
- 分岔点事件：无回响，但在 context 中要标注「这是平行宇宙的起点」
- 分岔后所有事件：必须有回响 + 必须反映 narrativeState 的延续或变化

## 关键人物连续性（CHARACTER CONTINUITY）

1. 如果一个关键人物（女友、导师、合伙人等）在某个事件中出现，后续事件必须至少提到这个人——哪怕只有一句话
2. 如果人物从叙事中消失，必须给出消失的原因（分手/搬家/去世/矛盾决裂）——不能「没说就不在了」
3. 分岔点涉及的人物：在分岔后至少再出现 3 次
4. 人物可以「在背景中活着」——不一定每次都是主角，但读者需要知道他们还在

## 选项设计
- choice-A：稳定、安全、传统认可
- choice-B：冒险、突破、高风险高回报
- choice-C：内心、自我实现、小众但独特
- ID 严格为 "choice-A"、"choice-B"、"choice-C"

## 人物命名规则
- 分岔选择中的人名是**不可变常量**。如果分岔选择中有一个叫"小雨"的人，她在所有后续事件中必须叫"小雨"
- 禁止把"小雨"改成"小云""小羽""小林""悦悦"等任何变体
- 如果某个事件中没有直接出现这个人物，用"她"指代——但绝不改名
- narrativeState 必须使用精确名字，不能用"她""那个女孩"等模糊指代

## 通用规则
- 不算命，不用玄学术语
- 中文第二人称"你"
- 叙事模式（分岔前）不返回 choices
- 锚定用户真实背景`;

function calculateAge(
  eventIndex: number, totalEvents: number, mode: string, birthDate: string,
  canonEvents?: { age: string; title: string; description: string }[],
  divergenceIndex?: number,
  currentAge?: number,
): number {
  // Future Lab: 从当前年龄开始
  if (mode === "future") {
    const startAge = currentAge || 21;
    const intervals = [1, 1, 1, 2, 2, 3, 3, 5, 5, 8, 8, 12, 12, 12];
    let age = startAge;
    for (let i = 0; i <= eventIndex; i++) {
      age += intervals[i] || 5;
    }
    return age;
  }

  if (totalEvents <= 5) {
    if (mode === "restart") { const s = [8, 17, 24, 33, 50]; return s[eventIndex] ?? 30; }
    const bY = new Date(birthDate).getFullYear();
    const inc = [1, 3, 6, 10, 16];
    return (new Date().getFullYear() - bY) + (inc[eventIndex] ?? eventIndex * 5);
  }

  const hasCanon = canonEvents && canonEvents.length > 0;
  const canonAges = hasCanon ? canonEvents!.map(e => parseInt(e.age, 10) || 0).sort((a, b) => a - b) : [];
  const divAge = hasCanon && divergenceIndex !== undefined && divergenceIndex >= 0 && divergenceIndex < canonAges.length
    ? canonAges[divergenceIndex] : hasCanon ? canonAges[canonAges.length - 1] : 18;
  const preAges = canonAges.filter(a => a < divAge);
  const numPre = preAges.length;

  if (eventIndex < numPre) return preAges[eventIndex];
  if (eventIndex === numPre) return divAge;

  const postIdx = eventIndex - numPre - 1;
  const postAnchors = canonAges.filter(a => a > divAge);
  const intervals = [1, 1, 2, 2, 3, 3, 5, 5, 8, 8, 12, 12];
  let age = divAge, ap = 0;
  for (let i = 0; i <= postIdx; i++) {
    let next = age + (intervals[i] || 5);
    const na = postAnchors[ap];
    if (na && na <= next) { next = na; ap++; }
    age = next;
  }
  return age;
}

function buildUserMessage(params: {
  summary: string; traits: string[]; motivations: string[];
  birthDate: string; birthPlace: string; school: string; major: string; career: string; dream: string; income: string;
  mode: string; backgroundMode: "fixed" | "random";
  backgroundDescription?: string;
  canonEvents?: { age: string; title: string; description: string }[];
  divergenceIndex: number; alternativeChoice?: string;
  age: number; eventIndex: number; totalEvents: number;
  previousChoices: { age: number; title: string; chosen: string; isDivergence?: boolean }[];
  narrativeState?: string;
  divergenceChoiceSummary?: string;
  characterName?: string;
  futureBranch?: { id: string; name: string; tagline: string; description: string; preview: { nextStep: string; inThreeYears: string; inFiveYears: string } };
  confusion?: string;
}): string {
  const isFuture = params.mode === "future";
  const isFirstEvent = params.eventIndex === 0;
  const isLastEvent = params.eventIndex === params.totalEvents - 1;
  const era = params.birthDate ? new Date(params.birthDate).getFullYear() + params.age : "未知年代";
  const lastChoice = params.previousChoices.length > 0 ? params.previousChoices[params.previousChoices.length - 1] : null;
  const hasDivergence = !isFuture && params.backgroundMode === "fixed" && params.canonEvents && params.canonEvents.length > 0;

  // === Future Lab 专属：路线锚定 + confusion 张力 ===
  if (isFuture) {
    let futureSection = "";
    const branch = params.futureBranch;
    if (branch) {
      futureSection = `\n=== 路线锚定（FUTURE MODE） ===
用户选择的路线：「${branch.name}」—— ${branch.description}
路线预览：第1步「${branch.preview.nextStep}」→ 3年后「${branch.preview.inThreeYears}」→ 5年后「${branch.preview.inFiveYears}」
事件必须在这条路线的框架内展开。选项可以多样化，但大方向不偏离。
叙事语气："接下来可能..."——不是"如果当初..."。不用"你会""你注定"。`;
    }
    if (params.confusion) {
      futureSection += `\n=== 困惑张力 ===
用户原始困惑：「${params.confusion}」
早期事件（eventIndex 0-2）中保持困惑的张力——用户还在寻找答案。
后期事件（eventIndex 3+）中困惑逐渐消解或转变为新的理解。`;
    }
    if (params.eventIndex === 2) {
      futureSection += `\n=== 再分叉标记 ===
这个事件后用户可以选择「重新考虑方向」。不要提前影响叙事——保持路线连贯性。`;
    }

    // 回响（未来模式也使用）
    let fEcho = "";
    if (lastChoice) {
      fEcho = `\n=== 回响 ===
用户上次在 [${lastChoice.age}岁] 选择了「${lastChoice.chosen}」。
你必须在 context 开头用【】包裹一段 80-120 字的回响，描述这个选择带来的直接后果。`;
    }

    const fPrevSection = params.previousChoices.length > 0
      ? `已做过的选择：\n${params.previousChoices.map((c, i) => `  ${i + 1}. [Age ${c.age}] ${c.title} → 选了「${c.chosen}」`).join("\n")}`
      : "这是第一个未来事件。";

    return `用户 Life DNA：
- 摘要：${params.summary}
- 特质：${params.traits.join("、")}
- 驱动：${params.motivations.join("、")}
- 梦想：${params.dream}
- 模式：未来推演
${futureSection}
${fEcho}

${fPrevSection}

第 ${params.eventIndex + 1}/${params.totalEvents} 个事件。当前 ${params.age} 岁。
生成包含 3 个选项的事件。${lastChoice ? "context 必须以【】回响开头（80-120字）。" : ""}
narrativeState 字段必须填写（50字以内）。
choices 的 ID 严格为 choice-A/choice-B/choice-C。
A=稳妥 B=冒险 C=内心。`;
  }

  // === 硬锚定句：平行宇宙身份（分岔后每个事件 Prompt 第一行） ===
  let hardAnchor = "";
  const isPostDivergence = params.backgroundMode === "fixed" && params.canonEvents && params.canonEvents.length > 0
    && params.previousChoices.some(c => c.isDivergence);
  if (isPostDivergence && params.divergenceChoiceSummary) {
    const nameConstraint = params.characterName
      ? `\n**硬数据：关键人物名字是「${params.characterName}」。这是一个程序变量，不是一个文本建议。在任何叙事、回响、选项、narrativeState 中，这个人必须叫「${params.characterName}」。不允许改成任何其他名字。**`
      : "";
    hardAnchor = `\n## 平行宇宙身份（硬约束）
**你在平行宇宙中。你的分岔选择是：${params.divergenceChoiceSummary}**${nameConstraint}

关键约束：
1. 如果上面有"硬数据：关键人物名字是X"，则当前事件中这个人必须叫X——不是建议，是硬编码
2. 禁止创造新的人物名字来替代已有名字
3. 真实时间线中发生的事（锚点中描述的）仅作背景参考——在平行宇宙里，你的选择已经偏离了那条路径。不要让真实时间线的结局渗透进叙事。
4. narrativeState 和 characterName 字段中的名字必须与硬数据完全一致`;
  }

  // === 叙事状态 ===
  let stateSection = "";
  if (params.narrativeState) {
    stateSection = `\n=== 叙事状态（CANON STATE） ===
上一个状态摘要：${params.narrativeState}
基于这个状态延续。状态中的关键人物名字必须保持不变。
如果某个状态在上一事件中是活跃的，它必须在当前叙事中被提及。除非当前选项中有结束它的路径且用户选了那条路。`;
  }

  // === 回响指令 ===
  let echoSection = "";
  if (lastChoice) {
    echoSection = `\n=== 回响 ===
用户上次在 [${lastChoice.age}岁] 选择了「${lastChoice.chosen}」${lastChoice.isDivergence ? "——这是分岔点选择，是整个平行宇宙的原点" : ""}。
你必须在 context 开头用【】包裹一段 80-120 字的回响，描述这个选择带来的直接后果。`;
  }

  // === 选择历史 + 分岔标记 ===
  const prevChoicesStr = params.previousChoices.length > 0
    ? params.previousChoices.map((c, i) =>
        `  ${i + 1}. [Age ${c.age}] ${c.title} → 选了「${c.chosen}」${c.isDivergence ? " ⚡分岔点（平行宇宙原点）" : ""}`
      ).join("\n")
    : "";

  const prevSection = prevChoicesStr ? `已做过的选择：\n${prevChoicesStr}` : "这是第一个事件。";

  // === 分岔点穿透指令 ===
  let divergenceLegacySection = "";
  if (hasDivergence && params.previousChoices.some(c => c.isDivergence)) {
    const divChoice = params.previousChoices.find(c => c.isDivergence)!;
    divergenceLegacySection = `\n=== 分岔点穿透指令（CRITICAL） ===
用户的分岔点选择是「${divChoice.chosen}」（${divChoice.age}岁时的「${divChoice.title}」）。
这是整个平行宇宙的「原点」——这个选择的后果必须渗透在当前事件的叙事中。

具体要求：
- 当前事件中必须至少一处自然地提到分岔点选择带来的持续影响
- 如果分岔点涉及一个人，这个人必须在当前叙事中出现（哪怕一句话）
- 分岔点选择产生的生活方向必须在背景中可感知
- 不要生硬复述——让它像空气一样渗透在叙事细节里

${params.alternativeChoice ? `用户原本在真实人生中选择的是另一条路。他们写下的替代路线是："${params.alternativeChoice}"。当前叙事是这条替代路线的展开。` : ""}`;
  }

  // === 背景 ===
  let backgroundSection = "";
  if (params.backgroundMode === "fixed") {
    const userBg = params.backgroundDescription ? `\n用户亲笔描述的真实起点："${params.backgroundDescription}"\n` : "";
    let canonSection = "";
    if (params.canonEvents && params.canonEvents.length > 0) {
      canonSection = `\n人生锚点：\n${params.canonEvents.map((e, i) => `  锚点${i + 1}：[${e.age}岁] ${e.title} — ${e.description}`).join("\n")}\n`;
    }
    backgroundSection = `\n=== 背景（固定模式） ===
- 出生地：${params.birthPlace}，当前 ${params.age} 岁（约 ${era} 年）
- 学校：${params.school}，专业：${params.major}，职业：${params.career}，收入：${params.income}
${userBg}${canonSection}`;
  } else {
    backgroundSection = `\n=== 背景（随机模式） ===
${isFirstEvent ? "随机生成全新出生背景。" : "保持之前随机生成的背景。"}`;
  }

  // === 分岔点阶段 ===
  let divergenceSection = "";
  if (hasDivergence) {
    const canonAges = params.canonEvents!.map(e => parseInt(e.age, 10) || 0);
    const divAge = params.divergenceIndex >= 0 && params.divergenceIndex < canonAges.length
      ? canonAges[params.divergenceIndex] : canonAges[canonAges.length - 1];
    const curAge = params.age;
    const nearAnchor = params.canonEvents!.find(e => Math.abs(parseInt(e.age, 10) - curAge) <= 1);

    if (curAge < divAge) {
      divergenceSection = `\n=== 分岔前（纯叙事） ===
当前 ${curAge} 岁 < 分岔点 ${divAge} 岁。纯叙事，不返回 choices。
${nearAnchor ? `当前接近锚点「${nearAnchor.title}」(${nearAnchor.age}岁)。` : ""}`;
    } else if (curAge > divAge || (curAge === divAge && params.previousChoices.some(c => c.age && c.age >= divAge))) {
      divergenceSection = `\n=== 分岔后（自由推演 + 状态追踪） ===
已过分岔点，走另一条路。事件包含 3 个选项。必须包含回响。必须反映 narrativeState 的延续或变化。
${nearAnchor ? `锚点「${nearAnchor.title}」在你的新路线上可能有不同意义。` : ""}`;
    } else {
      const diverge = params.canonEvents![params.divergenceIndex >= 0 ? params.divergenceIndex : params.canonEvents!.length - 1];
      divergenceSection = `\n=== 分岔点 ⚡ ===
当前 ${curAge} 岁，分岔点：「${diverge.title}」。
${params.alternativeChoice
  ? `- choice-A：用户真实的选择\n- choice-B：替代路线：「${params.alternativeChoice}」\n- choice-C：第三条路线`
  : "- choice-A：用户真实选择\n- choice-B：另一条路\n- choice-C：再一条路"}
不要包含回响。context 中标注「这是平行宇宙的起点」。`;
    }
  }

  const isNarrative = divergenceSection.includes("纯叙事");

  // === 最终事件约束 ===
  let finalEventConstraint = "";
  if (isLastEvent && isPostDivergence) {
    finalEventConstraint = `\n=== 最终事件约束 ===
这是最后一个事件。当你在回响中回顾一生时：
1. 禁止引用真实时间线中的事件——用户已经偏离了那条时间线
2. 只引用平行宇宙中实际发生的事（即 previousChoices 中的事件）
3. 禁止使用「你辜负过」「你失去过」「你错过」等暗示真实时间线结局的表述
4. 如果有回顾，回顾的是这份平行人生的轨迹，不是真实人生`;
  }

  return `${hardAnchor}
用户 Life DNA：
- 摘要：${params.summary}
- 特质：${params.traits.join("、")}
- 驱动：${params.motivations.join("、")}
- 梦想：${params.dream}
- 模式：${params.mode === "restart" ? "重启人生" : "未来推演"}
${backgroundSection}
${divergenceSection}
${divergenceLegacySection}
${stateSection}
${echoSection}
${finalEventConstraint}

${prevSection}

第 ${params.eventIndex + 1}/${params.totalEvents} 个事件。当前 ${params.age} 岁。

${isNarrative
  ? "生成纯叙事事件。只返回 context 和 title，choices 为空数组，narrativeState 为空字符串。不要使用回响格式。"
  : `生成包含 3 个选项的事件。
${lastChoice ? "context 必须以【】回响开头（80-120字）。" : ""}
narrativeState 字段必须填写（50字以内），作为下一个事件的状态上下文。
回顾上一个 narrativeState：如果其中描述的关系/身份/矛盾在当前事件中没有被用户的选择结束，它们必须仍在叙事中被体现。`}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      summary, traits, motivations, birthDate, birthPlace, school, major, career, dream, income,
      mode, backgroundMode = "fixed", backgroundDescription, canonEvents,
      divergenceIndex = -1, alternativeChoice,
      eventIndex = 0, totalEvents = 14, previousChoices = [], narrativeState, divergenceChoiceSummary, characterName,
      futureBranch, confusion, currentAge,
    } = body;

    if (!summary || !traits) {
      return NextResponse.json({ error: "缺少 Life DNA 数据" }, { status: 400 });
    }

    const age = calculateAge(eventIndex, totalEvents, mode, birthDate, canonEvents, divergenceIndex, currentAge);

    const userMessage = buildUserMessage({
      summary, traits, motivations,
      birthDate: birthDate || "", birthPlace: birthPlace || "",
      school: school || "", major: major || "", career: career || "",
      dream: dream || "", income: income || "",
      mode: mode || "restart", backgroundMode, backgroundDescription, canonEvents,
      divergenceIndex, alternativeChoice,
      age, eventIndex, totalEvents, previousChoices, narrativeState, divergenceChoiceSummary, characterName,
      futureBranch, confusion,
    });

    const rawContent = await chatCompletion(SYSTEM_PROMPT, userMessage, {
      temperature: 0.8, maxTokens: 2000, jsonMode: true,
    });

    let parsed: {
      age: number; title: string; context: string; echo?: string; narrativeState?: string; characterName?: string;
      choices?: { id: string; label: string; description: string; hint: string }[];
    };
    try {
      parsed = JSON.parse(rawContent);
    } catch {
      const m = rawContent.match(/\{[\s\S]*\}/);
      if (m) parsed = JSON.parse(m[0]);
      else throw new Error("无法解析 AI 返回的 JSON");
    }

    if (!parsed.context) {
      return NextResponse.json({ error: "AI 返回数据格式异常", raw: rawContent }, { status: 500 });
    }

    return NextResponse.json({
      id: `event-${String(eventIndex + 1).padStart(2, "0")}`,
      age: parsed.age || age,
      title: parsed.title || "",
      context: parsed.context,
      echo: parsed.echo || "",
      narrativeState: parsed.narrativeState || "",
      characterName: parsed.characterName || characterName || "",
      choices: parsed.choices && parsed.choices.length > 0 ? parsed.choices.slice(0, 3) : [],
      ...(mode === "future" ? { canReFork: eventIndex === 2, source: "main" as const } : {}),
    });
  } catch (error) {
    console.error("[generate-life-event] 错误:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "未知错误" }, { status: 500 });
  }
}
