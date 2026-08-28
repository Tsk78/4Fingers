// The ONLY module (besides AppStateContext, which uses this) that touches
// localStorage. No UI component may import localStorage directly (Requirement 2.3).

const STORAGE_EVENT = 'wilddex-storage';

export const storage = {
  get<T>(key: string): T | null {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return null;
      return JSON.parse(raw) as T;
    } catch {
      // Corrupt JSON or unavailable storage — never throw outward (design.md §9).
      return null;
    }
  },

  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      // Notify same-tab subscribers (native `storage` event only fires cross-tab).
      window.dispatchEvent(new CustomEvent(STORAGE_EVENT, { detail: { key } }));
    } catch {
      // Quota exceeded or unavailable — swallow; state stays in memory.
    }
  },

  /** Clears all persisted state. Used by the ErrorBoundary reset action (design.md §9). */
  clear(): void {
    try {
      localStorage.clear();
    } catch {
      // ignore — a reload still yields a clean in-memory slate
    }
  },

  /** Subscribe to changes (same-tab custom event + cross-tab native storage event). */
  subscribe(callback: () => void): () => void {
    const handler = () => callback();
    window.addEventListener(STORAGE_EVENT, handler);
    window.addEventListener('storage', handler);
    return () => {
      window.removeEventListener(STORAGE_EVENT, handler);
      window.removeEventListener('storage', handler);
    };
  },
};
