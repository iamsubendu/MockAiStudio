import type { HistoryItem } from "../types";

const HISTORY_KEY = "ai-studio-history";
const MAX_HISTORY_ITEMS = 5;

export const storageService = {
  getHistory(): HistoryItem[] {
    try {
      const stored = localStorage.getItem(HISTORY_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  addToHistory(item: HistoryItem): HistoryItem[] {
    try {
      const history = this.getHistory();
      const filteredHistory = history.filter((h) => h.id !== item.id);
      const newHistory = [item, ...filteredHistory].slice(0, MAX_HISTORY_ITEMS);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
      return newHistory;
    } catch {
      return [];
    }
  },

  clearHistory(): void {
    try {
      localStorage.removeItem(HISTORY_KEY);
    } catch {}
  },
};
