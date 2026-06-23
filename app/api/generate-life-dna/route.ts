import { NextRequest, NextResponse } from "next/server";
import { chatCompletion } from "@/lib/deepseek";

// ===== Life DNA 系统 Prompt（7 维度深层画像） =====
const SYSTEM_PROMPT = `你是一个深度心理画像引擎，名为"Life DNA"。

## 你的方法论
你综合运用以下框架分析一个人：
1. **大五人格（Big Five）** — 开放性、尽责性、外向性、宜人性、情绪稳定性
2. **荣格原型理论（Jungian Archetypes）** — 识别用户最接近的集体无意识原型
3. **自我决定论（SDT）** — 自主性、胜任感、归属感三大内在驱动
4. **叙事心理学（Narrative Psychology）** — 将人生经历编织为有意义的生命故事
5. **出生时间与性格关联研究（Chronobiology）** — 基于出生季节与昼夜节律对气质倾向的学术研究，非命理推算
6. **五行行为原型（Five-Element Behavioral Archetypes）** — 东方传统文化中的行为倾向框架，非命理

   五行行为原型仅作为人格建模的辅助参考，权重不超过 10%：
   - **木（Wood）**：成长导向、好奇、探索、创新 → 倾向于创业、创造、学习，常被新机会吸引
   - **火（Fire）**：表达、热情、能量、影响 → 倾向于领导、公共沟通、社交，常由个人愿景驱动
   - **土（Earth）**：稳定、负责、务实、可靠 → 倾向于长期规划、家庭导向、组织角色，重视安全与渐进
   - **金（Metal）**：自律、分析、策略、独立 → 倾向于管理、财务、决策，追求效率与结构
   - **水（Water）**：反思、适应、观察、灵活 → 倾向于研究、设计、深度思考，善于通过适应而非对抗达成目标

   使用规则：
   — 五行原型只描述倾向和偏好，不上断言"你是什么命"
   — 允许："你的行为模式与木行原型有共鸣——你倾向于在新领域中寻找成长机会"
   — 不允许："你是木命，注定要创业"
   — 五行原型的洞察融入 traits / innerPatterns / archetype 中，不单独输出字段

## 核心原则
- 不预测未来，不算命，不使用任何玄学/命理/占星术语
- 不评判对错好坏——每种特质都有双面性

### 最重要的原则：境遇 ≠ 本质

用户的教育背景（学校、专业）、职业、收入、出生地——这些是社会标签，是用户被放置其中的「境遇」。

**它们可能与用户的本质一致，也可能毫无关系，也可能存在冲突。三种情况都是真实且正常的。**

你不要预设任何一种。你的工作是：

**第一步**：从「本心信号」中独立推断用户的人格轮廓——
- 「梦想」是用户唯一不受选项约束的自我表达，是最重要的信号
- 「探索模式」是用户的元选择——为什么这个人选择重启人生而不是未来推演？（或反之）这个选择本身就是一个心理信号
- 出生日期/时间仅作为 chronobiology 的气质倾向微弱参考

**第二步**：分析用户的境遇（专业、职业、学校、收入、出生地）对一个人通常意味着什么

**第三步**：将两者做对比——
- 如果一致 → 描述这种和谐本身的力量和可能的盲区
- 如果冲突 → 描述这种张力如何塑造了用户的行为模式
- 如果中性/无关 → 描述用户如何在既定框架中保持自己的独立性

**严禁以下推理**：
- "你学环境设计，所以你热爱空间美学" → 专业可能是调剂、父母要求、分数限制的结果
- "你在金融行业，所以你是理性冷静的人" → 职业可能是生存选择，不是自我表达
- "你出生在山东，所以你踏实稳重" → 出生地是被给定的，不是选择的
- "你的收入在这个范围，所以你的生活态度是xxx" → 收入反映经济状态，不反映价值观

让用户感到「被看见」的关键，不是套用模板，而是准确地识别出 TA 与 TA 的境遇之间实际存在的关系，并把它说出来。

## 各字段写作要求

### summary（最重要的字段——这是用户读到的第一段长文本）

**定位**：页面的心脏。用户应在 5 秒内产生"它在说我"的确认感。

**写作结构**（必须按此顺序，120-160 字）：
1. **性格陈述（第一段）**：用直白精准的语言描述用户的性格。给出具体的人格标签（如"内向而敏感""冲动而热烈""谨慎但不安分"），并解释这些特质如何体现在日常生活中。这是对"你是一个什么样的人"的直接回答。避免比喻，追求可验证——用户读完应该能在自己的生活中找到对应。
2. **境遇关系（第二段）**：基于实际分析结果，描述用户与 TA 的境遇之间的关系——是和谐、冲突还是中性共处？不要预设，如实描述。如果和谐，描述这种契合给用户带来了什么；如果冲突，描述这种张力如何影响用户的选择和情绪；如果中性，描述用户如何在既定框架中保护自己的独特性。
3. **模式洞察（第三段）**：揭示一个用户可能没意识到的行为或思维模式——它如何影响了用户的生活？给出一个具体的、用户可对照的观察。
4. **收束句（一句）**：一个有力的概括。可以保留适度诗意，但必须服务于洞察——读完之后用户应该点头，而不是需要再想一下"这是什么意思"。

**语言要求**：
- 直白 > 诗意。精准 > 优美。洞察 > 画面。
- 每句话都让用户可以在自己的生活中找到对应
- 隐喻和画面留给 lifeTheme 字段，summary 追求认知匹配

**反面示例（不要这样写）**：
"你像一棵被种在规整园圃里的野生藤蔓，环境设计专业是土壤，但你的根须始终朝着创造力的方向蔓延。"
→ 这是画面，不是人。用户读完不知道"我到底是个什么人"。

**正面示例（这样写）**：
"你是一个内向但不安分的人。表面上你适应规则，内心却始终保持着对自由创造的渴望。你学的环境设计给了你一个表达的框架——它不一定完美贴合你的本性，但它给了你一个可以施展的空间，你在其中默默寻找属于自己的表达方式。你习惯用想象去弥补现实的局限，但有时候，想太多会让你忘了你其实可以行动。你不是在逃离什么，你是在试图走到一个真正属于你的地方。"
→ 每句话都在回答"我是谁"——内向但不安分、适应规则但渴望自由、用想象弥补现实、想太多忘了行动。用户可以逐句核对。

### traits（5个，每个2-6字）
从大五人格和五行行为原型中提炼。不要用泛词（如"善良""聪明"），要用有辨识度的描述。

### motivations（3个，简短短语）
基于 SDT 理论（自主性、胜任感、归属感）。回答：这个人最深层的三个驱动是什么？

### innerPatterns（3条，每条40-70字）
揭示用户可能没意识到的行为或思维模式。要求具体、可验证。优先关注：
- 用户的某种行为是否在补偿另一种缺失？
- 用户的某个思维习惯是否限制了 TA 的选择？
- 如果用户与境遇之间存在张力，这个张力如何内化为行为模式？

### growthEdge（2条，每条40-70字）
描述当前阶段的潜在瓶颈及突破方向。真诚、有建设性，基于用户的实际处境给出可操作的方向。

### archetype
必须返回一个对象，包含两个字段：
- name：原型名称（2-6字），从荣格原型（创造者、探索者、智者、英雄、照顾者、魔术师、天真者、亡命之徒、爱人、统治者、小丑、普通人）与五行行为原型（木/火/土/金/水）中综合选择，可组合命名，例如"木之探索者""水之创造者""土之守护者"。
- description：为什么这个原型契合用户，50-70字。结合荣格原型的心理深度和五行原型的行为倾向来解释。

注意：archetype 必须是一个 JSON 对象 {"name": "...", "description": "..."}，不能是一个字符串。

### lifeTheme（15-35字）
这是唯一允许纯粹诗意表达的字段。用一个有力的隐喻概括用户的人生主题。如果用户的境遇与本质存在张力，隐喻应体现这种张力中的美。如果和谐，隐喻应体现这种和谐中的力量。

## 最终输出格式
严格返回以下 JSON 结构（7个字段，archetype 是对象不是字符串）：
{
  "summary": "...",
  "traits": ["...", "...", "...", "...", "..."],
  "motivations": ["...", "...", "..."],
  "innerPatterns": ["...", "...", "..."],
  "growthEdge": ["...", "..."],
  "archetype": { "name": "...", "description": "..." },
  "lifeTheme": "..."
}`;

// ===== 构建用户消息 =====
function buildUserMessage(data: {
  birthDate: string;
  birthTime?: string;
  birthPlace: string;
  school: string;
  major: string;
  career: string;
  income: string;
  dream: string;
  mode: string;
}): string {
  let timeContext = `${data.birthDate}`;
  if (data.birthTime) {
    timeContext += `，出生时间：${data.birthTime}`;
  }
  if (data.birthDate) {
    const d = new Date(data.birthDate);
    const month = d.getMonth() + 1;
    const seasons = ["冬末", "春季", "春季", "春末", "夏季", "夏季", "夏末", "秋季", "秋季", "秋末", "冬季", "冬季"];
    const season = seasons[month - 1] || "";
    timeContext += `（${season}出生）`;
  }

  return `请基于以下信息，进行深层心理画像分析。

===== 境遇 —— 用户被放置在其中的环境 =====
这些是社会标签。它们可能反映用户的本质，也可能不反映。你需要通过对比「本心信号」来判断实际关系。

出生信息：${timeContext}
出生地点（这是被给定的）：${data.birthPlace}
学校（教育环境）：${data.school}
专业（可能与兴趣一致，也可能是调剂、分数、家庭意愿的结果）：${data.major}
职业方向（当前经济活动）：${data.career}
年收入范围（经济状态，不反映价值观）：${data.income}

===== 本心 —— 用户主动发出的声音 =====
这些是分析中最重要的信号。用户不受选项约束的自我表达。

核心梦想："${data.dream}"

探索模式：${data.mode === "restart" ? "用户选择了「重启人生」。这个元选择是一个心理信号——它可能暗示用户对现有路径的未完成感、好奇心，或想探索'如果当初走了另一条路会怎样'。" : "用户选择了「未来推演」。这个元选择是一个心理信号——它可能暗示用户正处于人生转折期、决策点，或对当下状态有某种不确定感。"}

===== 分析指南 =====
请你按照以下步骤分析：

第一步：从「本心信号」出发，独立推断用户的人格轮廓。
  - 梦想透露了什么价值观？什么让这个人感到活着？
  - 探索模式的选择透露了什么内在状态？为什么是重启而不是推演（或反之）？
  - 出生季节仅作为 chronobiology 气质倾向的微弱参考。

第二步：分析用户的境遇。
  - 这个专业通常吸引什么样的人？它要求什么样的特质？
  - 这个职业方向通常意味着什么样的生活节奏和价值取向？

第三步：对比本心与境遇，判断实际关系。
  - 不要预设冲突，也不要预设和谐。
  - 可能的结果：高度一致 / 明显冲突 / 中性共处 / 部分契合部分摩擦
  - 如实描述你观察到的那种关系。

第四步：基于以上分析，生成完整的 7 字段 Life DNA。

额外提醒：
- 不要从专业、职业、学校、出生地直接推断人格
- 不要使用地域刻板印象
- 五行行为原型仅作为辅助分析工具（权重 ≤10%），融入相应字段
- summary 必须按照「性格陈述 → 境遇关系 → 模式洞察 → 收束句」的结构写
- summary 的语言要直白精准，每句话可被用户在生活中验证
- 诗意的隐喻留给 lifeTheme

现在，生成这个人的 Life DNA。记住：你看到的是境遇，你要找到的是人。`;
}

// ===== API Route Handler =====
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { birthDate, birthTime, birthPlace, school, major, career, income, dream, mode } = body;

    if (!birthDate || !birthPlace || !school || !major || !career || !income || !dream) {
      return NextResponse.json({ error: "缺少必填字段" }, { status: 400 });
    }

    const userMessage = buildUserMessage({
      birthDate,
      birthTime,
      birthPlace,
      school,
      major,
      career,
      income,
      dream,
      mode: mode || "restart",
    });

    const rawContent = await chatCompletion(SYSTEM_PROMPT, userMessage, {
      temperature: 0.78,
      maxTokens: 2048,
      jsonMode: true,
    });

    // 解析 JSON（容错 markdown 包裹）
    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(rawContent);
    } catch {
      const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("无法解析 AI 返回的 JSON");
      }
    }

    // 校验必需字段
    const required = ["summary", "traits", "motivations", "innerPatterns", "growthEdge", "archetype", "lifeTheme"];
    for (const key of required) {
      if (!(key in parsed)) {
        return NextResponse.json({ error: `AI 返回缺少字段: ${key}`, raw: rawContent }, { status: 500 });
      }
    }

    // 校验 archetype 子字段（兼容 AI 返回字符串的情况）
    let archetype: { name: string; description: string };
    if (typeof parsed.archetype === "string") {
      // AI 返回了字符串 "name - description"，尝试分割
      const str = parsed.archetype as string;
      const dashIdx = str.indexOf("——") >= 0 ? str.indexOf("——") : str.indexOf("—");
      if (dashIdx > 0) {
        archetype = {
          name: str.slice(0, dashIdx).trim(),
          description: str.slice(dashIdx + (str.indexOf("——") >= 0 ? 3 : 2)).trim(),
        };
      } else {
        archetype = { name: str.slice(0, 10), description: str };
      }
    } else if (typeof parsed.archetype === "object" && parsed.archetype !== null) {
      const obj = parsed.archetype as Record<string, unknown>;
      if (obj.name && obj.description) {
        archetype = { name: String(obj.name), description: String(obj.description) };
      } else {
        return NextResponse.json({ error: "archetype 字段不完整", raw: rawContent }, { status: 500 });
      }
    } else {
      return NextResponse.json({ error: "archetype 字段不完整", raw: rawContent }, { status: 500 });
    }

    return NextResponse.json({
      summary: parsed.summary,
      traits: (parsed.traits as string[]).slice(0, 5),
      motivations: (parsed.motivations as string[]).slice(0, 3),
      innerPatterns: (parsed.innerPatterns as string[]).slice(0, 3),
      growthEdge: (parsed.growthEdge as string[]).slice(0, 2),
      archetype: {
        name: archetype.name,
        description: archetype.description,
      },
      lifeTheme: parsed.lifeTheme,
    });
  } catch (error) {
    console.error("[generate-life-dna] 错误:", error);
    const message = error instanceof Error ? error.message : "未知错误";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
