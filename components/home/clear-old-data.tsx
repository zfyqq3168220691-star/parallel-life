"use client";

import { useEffect } from "react";

/** 所有需要清除的 localStorage key */
const OLD_KEYS = [
  // 重启人生模式
  "parallel-life-dna",
  "parallel-life-form",
  "parallel-life-session",
  "parallel-life-mode",
  "parallel-life-background-mode",
  "parallel-life-background-description",
  "parallel-life-canon-events",
  "parallel-life-divergence-index",
  "parallel-life-alternative-choice",
  "parallel-life-divergence-summary",
  // 未来推演模式
  "future-user-data",
  "future-session",
  "future-insight-data",
  "future-summary-data",
  "future-lab-store",
];

/**
 * 首页加载时自动清除旧数据，确保每次打开都是全新的开始。
 * 不渲染任何 UI。
 */
export function ClearOldData() {
  useEffect(() => {
    for (const key of OLD_KEYS) {
      try {
        localStorage.removeItem(key);
      } catch {
        // 安全忽略（隐私模式、配额超限等）
      }
    }
  }, []);

  return null;
}
