// Parallel Life — 核心类型定义

/** 两种产品模式 */
export type Mode = "restart" | "future";

/** 人生建模表单输入 */
export interface LifeModelInput {
  birthDate: string;
  birthTime?: string;
  birthPlace: string;
  school: string;
  major: string;
  career: string;
  income: string;
  dream: string;
}

/** 人格原型 */
export interface Archetype {
  name: string;      // 原型名称，如"创造者""探索者"
  description: string; // 原型解读，40-60字
}

/** AI 生成的 Life DNA（7 维度深层画像） */
export interface LifeDNA {
  summary: string;             // 人生画像总结，80-120字
  traits: string[];            // 5 个核心性格特质
  motivations: string[];       // 3 个内在驱动力
  innerPatterns: string[];     // 内在行为模式，3条——用户可能没意识到的倾向
  growthEdge: string[];        // 成长边界，2条——当前状态的潜在瓶颈与突破方向
  archetype: Archetype;        // 人格原型，基于荣格心理学
  lifeTheme: string;           // 人生母题，一个核心隐喻，如"跨越边界的人"
}

/** 人生事件中的单个选择 */
export interface LifeChoice {
  id: string;
  label: string;
  description: string;
  hint: string;
}

/** AI 生成的人生关键事件 */
export interface LifeEvent {
  id: string;
  age: number;
  title: string;
  context: string;
  echo?: string;
  narrativeState?: string;
  characterName?: string;
  choices: LifeChoice[];
}

/** 已记录的选择 */
export interface ChosenChoice {
  eventId: string;
  eventTitle: string;
  age: number;
  chosenId: string;
  chosenLabel: string;
  isDivergence?: boolean;
}

/** 一条完整的人生路线 */
export interface LifePath {
  id: string;
  label: string;
  isChosen: boolean;
  events: LifeEvent[];
  choices: ChosenChoice[];
  currentAge: number;
}

/** 人生总结 */
export interface LifeSummary {
  overview: string;
  epitaph: string;
  highlights: string[];
  regrets: string[];
}

/** 模拟会话完整状态 */
export interface SimulationSession {
  id: string;
  mode: Mode;
  lifeModel: LifeModelInput | null;
  lifeDNA: LifeDNA | null;
  paths: LifePath[];
  currentEventIndex: number;
  totalEvents: number;
  currentStep: "idle" | "generating" | "choosing" | "completed";
  createdAt: string;
  updatedAt: string;
}

/** API 响应包装 */
export interface APIResponse<T> {
  data?: T;
  error?: string;
}
