import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  FutureBranch,
  FutureInsight,
  FutureSummaryResponse,
  FutureSession,
  FutureEventSource,
} from "@/types/future";
import type { ChosenChoice, LifeEvent } from "@/types";

// ---- 推演运行时类型 ----
export type SimulationStatus =
  | "idle"
  | "generating"
  | "choosing"
  | "pending"
  | "selected"
  | "completed";

export interface FutureLabStore {
  // ===== 水合状态 =====
  _isHydrated: boolean;

  // ===== 用户数据 =====
  userConfusion: string;
  setUserConfusion: (confusion: string) => void;

  // ===== 洞察 + 路线 =====
  insight: FutureInsight | null;
  branches: FutureBranch[];
  selectedBranch: FutureBranch | null;
  branchComparison: string;
  setInsight: (insight: FutureInsight) => void;
  setBranches: (branches: FutureBranch[], comparison: string) => void;
  selectBranch: (branch: FutureBranch) => void;

  // ===== 推演运行时 =====
  simulationStatus: SimulationStatus;
  setSimulationStatus: (status: SimulationStatus) => void;

  // ===== 会话管理 =====
  session: FutureSession | null;
  buildSession: (params: BuildSessionParams) => FutureSession;
  restoreSession: () => FutureSession | null;
  updateSession: (partial: Partial<FutureSession>) => void;
  clearSession: () => void;

  // ===== 总结 =====
  summary: FutureSummaryResponse | null;
  setSummary: (summary: FutureSummaryResponse) => void;

  // ===== 生命周期 =====
  reset: () => void;
}

/** buildSession 的外部参数——来自 simulation 页面的运行时状态 */
export interface BuildSessionParams {
  mainEvents: LifeEvent[];
  mainChoices: ChosenChoice[];
  totalMainEvents: number;
  mainEventIndex: number;

  reForkUsed: boolean;
  reForkBranch?: FutureBranch;
  reForkEvents?: LifeEvent[];
  reForkChoices?: (ChosenChoice & { source: "reFork" })[];
  totalReForkEvents?: number;
  reForkEventIndex?: number;

  status: "idle" | "in_progress" | "completed" | "abandoned";
}

const initialState = {
  _isHydrated: false,
  userConfusion: "",
  insight: null,
  branches: [],
  selectedBranch: null,
  branchComparison: "",
  simulationStatus: "idle" as SimulationStatus,
  session: null as FutureSession | null,
  summary: null as FutureSummaryResponse | null,
};

export const useFutureLabStore = create<FutureLabStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      setUserConfusion: (confusion) => set({ userConfusion: confusion }),

      setInsight: (insight) => set({ insight }),

      setBranches: (branches, comparison) =>
        set({ branches, branchComparison: comparison }),

      selectBranch: (branch) => set({ selectedBranch: branch }),

      setSimulationStatus: (status) => set({ simulationStatus: status }),

      // ===== 会话管理 =====

      /** 从运行时状态构建完整的 FutureSession 并持久化 */
      buildSession: (params: BuildSessionParams): FutureSession => {
        const state = get();
        const session: FutureSession = {
          selectedBranch: state.selectedBranch!,
          mainEvents: params.mainEvents,
          mainChoices: params.mainChoices,
          totalMainEvents: params.totalMainEvents,
          mainEventIndex: params.mainEventIndex,
          reForkUsed: params.reForkUsed,
          reForkBranch: params.reForkBranch,
          reForkEvents: params.reForkEvents,
          reForkChoices: params.reForkChoices,
          totalReForkEvents: params.totalReForkEvents,
          reForkEventIndex: params.reForkEventIndex,
          status: params.status,
          createdAt: new Date().toISOString(),
          completedAt: params.status === "completed" ? new Date().toISOString() : undefined,
        };
        set({ session });
        // 同步写入 localStorage——Zustand persist 有延迟，关键路径直接写
        try {
          localStorage.setItem("future-session", JSON.stringify(session));
        } catch { /* quota exceeded */ }
        return session;
      },

      /** 从 localStorage 恢复 session。Zustand persist 通常已处理，这是显式恢复 */
      restoreSession: (): FutureSession | null => {
        try {
          const raw = localStorage.getItem("future-session");
          if (!raw) return null;
          const session: FutureSession = JSON.parse(raw);
          set({ session });
          return session;
        } catch {
          return null;
        }
      },

      /** 增量更新 session——追加事件或选择后调用 */
      updateSession: (partial: Partial<FutureSession>) => {
        const current = get().session;
        if (!current) return;
        const updated = { ...current, ...partial };
        set({ session: updated });
        try {
          localStorage.setItem("future-session", JSON.stringify(updated));
        } catch { /* quota exceeded */ }
      },

      /** 清除 session——用户点击"再来一次"时调用 */
      clearSession: () => {
        set({ session: null });
        try {
          localStorage.removeItem("future-session");
        } catch { /* ignore */ }
      },

      setSummary: (summary) => set({ summary }),

      reset: () => {
        set({ ...initialState, _isHydrated: true });
        try {
          localStorage.removeItem("future-session");
        } catch { /* ignore */ }
      },
    }),
    {
      name: "future-lab-store",
      partialize: (state) => ({
        userConfusion: state.userConfusion,
        insight: state.insight,
        branches: state.branches,
        selectedBranch: state.selectedBranch,
        branchComparison: state.branchComparison,
        session: state.session,
        summary: state.summary,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) state._isHydrated = true;
      },
    }
  )
);
