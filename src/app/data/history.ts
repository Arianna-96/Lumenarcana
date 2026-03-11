export interface HistoryEntry {
  date: string;
  cardId: number;
  cardName: string;
  cardNumber: string;
  reflection: string;
  question: string;
}

export const HISTORY_KEY = "tarot_history";

export function loadHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? (JSON.parse(raw) as HistoryEntry[]) : [];
  } catch {
    return [];
  }
}

export function appendHistory(entry: HistoryEntry): void {
  const existing = loadHistory();
  // Avoid exact-date duplicates (e.g. hot-reload during dev)
  const deduped = existing.filter((e) => e.date !== entry.date);
  localStorage.setItem(HISTORY_KEY, JSON.stringify([...deduped, entry]));
}

/** Patch an existing entry by date (e.g. to replace placeholder text with real AI copy). */
export function updateHistoryEntry(date: string, updates: Partial<HistoryEntry>): void {
  const existing = loadHistory();
  const patched = existing.map((e) => (e.date === date ? { ...e, ...updates } : e));
  localStorage.setItem(HISTORY_KEY, JSON.stringify(patched));
}