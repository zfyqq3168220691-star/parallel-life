// ============================================================
// Future Lab — 完整类型定义
// 文件：types/future.ts
// ============================================================

import type { LifeDNA, LifeChoice, ChosenChoice } from "./index";

// ============================================================
// 1. 用户当前状态
// ============================================================

/** 用户提交的当前状态（/future/onboarding） */
export interface FutureUserState {
  /** 当前年龄（从 birthDate 计算） */
  age: number;

  /** 当前职业方向 */
  career: string;

  /** 当前学校 */
  school: string;

  /** 当前专业 */
  major: string;

  /** 当前城市 */
  city: string;

  /** 用户写下的梦想 */
  dream: string;

  /** 收入范围 */
  income: string;

  /** 用户当前最大的困惑或犹豫（≤100字，必填） */
  confusion: string;
}

// ============================================================
// 2. 信号 & 洞察
// ============================================================

/** 信号来源类型 */
export type SignalSource = "experience" | "pattern" | "situation";

/** 单条洞察信号 */
export interface InsightSignal {
  /** 信号文本（30-60字） */
  text: string;

  /** 信号来源 */
  source: SignalSource;

  /** 可溯源引用标记（可选），指向数据源头 */
  reference: string | null;
}

/** AI 洞察层完整输出 */
export interface FutureInsight {
  /** 经历信号（3条）—— 从锚点、背景、分岔选择中提取 */
  experienceSignals: InsightSignal[];

  /** 选择倾向信号（3条）—— 从重启人生的选择行为中统计 */
  patternSignals: InsightSignal[];

  /** 现实条件信号（3条）—— 从当前年龄、职业、困惑中分析 */
  situationSignals: InsightSignal[];

  /** 洞察收束语（1句，≤50字） */
  summary: string;
}

// ============================================================
// 3. 未来路线
// ============================================================

/** 路线预览 —— 三步路标 */
export interface BranchPreview {
  /** 第一步（≤12字） */
  nextStep: string;

  /** 3年后可能的状态（≤12字） */
  inThreeYears: string;

  /** 5年后可能的状态（≤12字） */
  inFiveYears: string;
}

/** 路线生成依据 —— 引用 insight 中的信号 */
export interface BranchBasis {
  /** 引用的经历信号索引（0-2） */
  experienceRef: number;

  /** 引用的倾向信号索引（0-2） */
  patternRef: number;

  /** 引用的现状信号索引（0-2） */
  situationRef: number;
}

/** 单条未来路线 */
export interface FutureBranch {
  /** 唯一标识 */
  id: string;

  /** 路线名称（8-15字），描述性的 */
  name: string;

  /** 这条路适合谁（≤15字） */
  tagline: string;

  /** 路线简述（40-60字） */
  description: string;

  /** 三步预览 */
  preview: BranchPreview;

  /** 生成依据 */
  basis: BranchBasis;
}

// ============================================================
// 4. 里程碑
// ============================================================

/** 路线里程碑 —— 展示路线上的关键节点 */
export interface FutureMilestone {
  /** 年龄 */
  age: number;

  /** 事件简述（≤12字） */
  event: string;
}

// ============================================================
// 5. 未来推演事件
// ============================================================

/** 事件来源 */
export type FutureEventSource = "main" | "reFork";

/** 未来推演中的单个事件 —— 扩展自 LifeEvent */
export interface FutureEvent {
  /** 唯一标识 */
  id: string;

  /** 该事件对应的年龄 */
  age: number;

  /** 事件标题（8-16字） */
  title: string;

  /** 沉浸式叙事（可能包含【】回响段落） */
  context: string;

  /** 回响段落文本（可选） */
  echo?: string;

  /** 3 个选项 */
  choices: LifeChoice[];

  /** 叙事状态摘要（50字以内） */
  narrativeState?: string;

  /** 关键人物名字（硬数据字段） */
  characterName?: string;

  /**
   * 是否允许在此事件后进行再分叉。
   * 主路线的第 3-4 个事件为 true，其余为 false。
   * 再分叉路线上永远为 false。
   */
  canReFork: boolean;

  /** 事件来源 */
  source: FutureEventSource;
}

// ============================================================
// 6. 再分叉
// ============================================================

/** 再分叉的子路线 */
export interface ReForkBranch {
  /** 子路线信息 */
  branch: FutureBranch;

  /**
   * 为什么在此时提供这条子路线。
   * 解释从主路线分叉的原因（20-30字）。
   */
  reasonAtThisPoint: string;
}

/** 再分叉 API 响应 */
export interface ReForkResponse {
  /** 2 条子路线 */
  subBranches: ReForkBranch[];

  /** 当前状态摘要，作为再分叉的上下文 */
  currentContext: string;
}

// ============================================================
// 7. 未来总结
// ============================================================

/** 身份识别卡片 */
export interface FutureIdentity {
  /** 一句话——在这段探索中你发现了什么（≤25字） */
  oneLiner: string;

  /** 4 个选择倾向关键词 —— 行为模式词 */
  keywords: string[];
}

/** 一条完整路径的节点集合 */
export interface FuturePath {
  /** 路径名称 */
  name: string;

  /** 3-4 个关键节点 */
  nodes: FutureMilestone[];
}

/** 人生数据统计单元 */
export interface FutureStat {
  /** 数据值（数字或短句） */
  value: string;

  /** 标签说明（≤8字） */
  label: string;
}

/** 未来总结 API 完整响应 */
export interface FutureSummaryResponse {
  /** 身份识别 */
  identity: FutureIdentity;

  /** 主路线 */
  mainPath: FuturePath;

  /** 再分叉路线（仅当用户使用了再分叉） */
  reForkPath?: FuturePath;

  /** 终局叙事（150-200字，回顾式复盘） */
  finaleNarrative: string;

  /** 4 条统计数据 */
  stats: FutureStat[];
}

// ============================================================
// 8. 推演会话（localStorage 持久化）
// ============================================================

/** 未来推演会话 —— localStorage key: "future-session" */
export interface FutureSession {
  /** 用户选择的路线 */
  selectedBranch: FutureBranch;

  /** 主路线上的所有事件 */
  mainEvents: import("./index").LifeEvent[];

  /** 主路线上的所有选择 */
  mainChoices: import("./index").ChosenChoice[];

  /** 主路线事件总数 */
  totalMainEvents: number;

  /** 主路线当前事件索引 */
  mainEventIndex: number;

  /** 是否使用了再分叉 */
  reForkUsed: boolean;

  /** 再分叉路线（如果使用了） */
  reForkBranch?: FutureBranch;

  /** 再分叉路线上的事件 */
  reForkEvents?: import("./index").LifeEvent[];

  /** 再分叉路线上的选择 */
  reForkChoices?: import("./index").ChosenChoice[];

  /** 再分叉路线事件总数 */
  totalReForkEvents?: number;

  /** 再分叉当前事件索引 */
  reForkEventIndex?: number;

  /** 会话状态 */
  status: "idle" | "in_progress" | "completed" | "abandoned";

  /** 会话创建时间 */
  createdAt: string;

  /** 会话完成时间 */
  completedAt?: string;
}

// ============================================================
// 9. API 请求类型
// ============================================================

/** POST /api/generate-future-insight 请求体 */
export interface GenerateFutureInsightRequest {
  /** Life DNA */
  lifeDNA: {
    summary: string;
    traits: string[];
    lifeTheme: string;
  };

  /** 当前状态 */
  currentState: FutureUserState;

  /** 经历数据（可选——如果用户用过重启人生） */
  history?: {
    backgroundDescription?: string;
    canonEvents?: { age: string; title: string; description: string }[];
    divergenceChoiceSummary?: string;
    choiceHistory?: {
      age: number;
      title: string;
      chosen: string;
      isDivergence?: boolean;
    }[];
  };
}

/** POST /api/generate-future-insight 响应体 */
export interface GenerateFutureInsightResponse {
  /** AI 洞察 */
  insight: FutureInsight;
}

/** POST /api/generate-future-branches 请求体 */
export interface GenerateFutureBranchesRequest {
  /** Life DNA */
  lifeDNA: {
    summary: string;
    traits: string[];
    lifeTheme: string;
  };

  /** 当前状态 */
  currentState: FutureUserState;

  /** 已生成的洞察 */
  insight: FutureInsight;
}

/** POST /api/generate-future-branches 响应体 */
export interface GenerateFutureBranchesResponse {
  /** 2-3 条未来路线 */
  branches: FutureBranch[];

  /** 路线对比（≤30字）—— 这些路线的本质差异 */
  comparison: string;
}

/** POST /api/generate-future-reFork 请求体 */
export interface GenerateFutureReForkRequest {
  /** Life DNA */
  lifeDNA: {
    summary: string;
    traits: string[];
    lifeTheme: string;
  };

  /** 当前状态 */
  currentState: {
    age: number;
    narrativeState: string;
  };

  /** 已选择的主路线 */
  selectedBranch: FutureBranch;

  /** 主路线上已完成的选择 */
  mainChoices: (ChosenChoice & { source: FutureEventSource })[];

  /** 用户的原始困惑 */
  confusion: string;
}

/** POST /api/generate-future-summary 请求体 */
export interface GenerateFutureSummaryRequest {
  /** Life DNA */
  lifeDNA: {
    summary: string;
    traits: string[];
    lifeTheme: string;
  };

  /** 用户选择的路线 */
  selectedBranch: FutureBranch;

  /** 用户的原始困惑 */
  confusion: string;

  /** 主路线上的所有选择 */
  mainChoices: {
    age: number;
    title: string;
    chosen: string;
  }[];

  /** 是否使用了再分叉 */
  reForkUsed: boolean;

  /** 再分叉信息（如果使用了） */
  reForkBranch?: FutureBranch;
  reForkChoices?: {
    age: number;
    title: string;
    chosen: string;
  }[];
}

// ============================================================
// 10. Zustand Store 类型
// ============================================================

/** 推演运行时状态 */
export type SimulationStatus =
  | "idle"
  | "generating"
  | "choosing"
  | "pending"
  | "selected"
  | "completed";

/** Future Lab 的完整 Zustand Store */
export interface FutureLabStore {
  // ---- 水合状态 ----
  _isHydrated: boolean;

  // ---- 用户数据 ----
  userConfusion: string;
  setUserConfusion: (confusion: string) => void;

  // ---- 洞察数据 ----
  insight: FutureInsight | null;
  branches: FutureBranch[];
  selectedBranch: FutureBranch | null;
  isInsightGenerating: boolean;
  setInsight: (insight: FutureInsight) => void;
  setBranches: (branches: FutureBranch[], comparison: string) => void;
  branchComparison: string;
  selectBranch: (branch: FutureBranch) => void;

  // ---- 推演运行时 ----
  events: FutureEvent[];
  currentEvent: FutureEvent | null;
  eventIndex: number;
  totalEvents: number;
  previousChoices: (ChosenChoice & { source: FutureEventSource })[];
  narrativeState: string;
  characterName: string;
  simulationStatus: SimulationStatus;
  pendingChoiceId: string | null;
  selectedChoiceLabel: string | null;
  hasUndone: boolean;
  canReFork: boolean;
  setCurrentEvent: (event: FutureEvent) => void;
  setSimulationStatus: (status: SimulationStatus) => void;
  setPendingChoiceId: (id: string | null) => void;
  addChoice: (choice: ChosenChoice & { source: FutureEventSource }) => void;
  undoLastChoice: () => void;
  advanceToNextEvent: () => void;
  setCanReFork: (value: boolean) => void;

  // ---- 再分叉 ----
  isReForkModalOpen: boolean;
  subBranches: ReForkBranch[];
  isReForkActive: boolean;
  selectedReForkBranch: FutureBranch | null;
  reForkEvents: FutureEvent[];
  reForkChoices: (ChosenChoice & { source: "reFork" })[];
  reForkEventIndex: number;
  reForkNarrativeState: string;
  openReForkModal: () => void;
  closeReForkModal: () => void;
  setSubBranches: (branches: ReForkBranch[]) => void;
  selectReForkBranch: (branch: FutureBranch) => void;
  activateReFork: () => void;
  addReForkEvent: (event: FutureEvent) => void;
  addReForkChoice: (choice: ChosenChoice & { source: "reFork" }) => void;
  advanceReForkEvent: () => void;

  // ---- 总结数据 ----
  summary: FutureSummaryResponse | null;
  isSummaryGenerating: boolean;
  setSummary: (summary: FutureSummaryResponse) => void;

  // ---- 生命周期 ----
  reset: () => void;
  buildSession: () => FutureSession;
  restoreFromSession: (session: FutureSession) => void;
}

// ============================================================
// 11. localStorage Key 映射
// ============================================================

/**
 * Future Lab localStorage Keys
 *
 * future-confusion            string              用户写下的困惑
 * future-insight-data         Zustand persist     洞察 + 路线 + 选择
 * future-session              FutureSession       推演会话完整记录
 * future-summary-data         Zustand persist     总结缓存
 *
 * 复用的重启人生 Keys（只读）：
 * parallel-life-form          LifeModelInput      读取当前状态
 * parallel-life-dna           LifeDNA             读取人生画像
 */

// ============================================================
// 12. 导出聚合（方便导入）
// ============================================================

export type {
  LifeDNA,
  LifeChoice,
  ChosenChoice,
} from "./index";
