import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

// FIFO toast queue — at most one toast visible at a time (design.md §3.4,
// Requirement 3.7). New toasts queue; the current one auto-dismisses and the
// next takes its place.

const TOAST_DURATION_MS = 3000;

interface ToastMessage {
  id: number;
  text: string;
}

interface ToastContextValue {
  enqueue: (text: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (ctx === null) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return ctx;
}

let nextToastId = 1;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [queue, setQueue] = useState<ToastMessage[]>([]);
  const [current, setCurrent] = useState<ToastMessage | null>(null);
  const reducedMotion = useReducedMotion();
  const timerRef = useRef<number | null>(null);

  const enqueue = useCallback((text: string) => {
    setQueue((q) => [...q, { id: nextToastId++, text }]);
  }, []);

  // Promote the next queued toast when nothing is currently showing.
  useEffect(() => {
    if (current === null && queue.length > 0) {
      setCurrent(queue[0]);
      setQueue((q) => q.slice(1));
    }
  }, [current, queue]);

  // Auto-dismiss the current toast.
  useEffect(() => {
    if (current === null) return;
    timerRef.current = window.setTimeout(() => {
      setCurrent(null);
    }, TOAST_DURATION_MS);
    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    };
  }, [current]);

  const duration = reducedMotion ? 0 : 0.25;

  return (
    <ToastContext.Provider value={{ enqueue }}>
      {children}
      <div
        className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4"
        aria-live="polite"
        aria-atomic="true"
      >
        <AnimatePresence>
          {current && (
            <motion.div
              key={current.id}
              role="status"
              initial={{ opacity: 0, y: reducedMotion ? 0 : -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reducedMotion ? 0 : -16 }}
              transition={{ duration }}
              className="pointer-events-auto max-w-sm rounded-card border border-white/15 bg-jungle-light/95 px-5 py-3 text-center text-sm font-medium text-mist shadow-glass backdrop-blur-glass"
            >
              {current.text}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
