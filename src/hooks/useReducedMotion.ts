import { useEffect, useState } from 'react';
import { useAppState } from './useAppState';

/**
 * Single source of truth for reduced-motion (design.md §8).
 * True when either the user setting OR the OS `prefers-reduced-motion` is set.
 * Every Framer Motion consumer should read this to shorten/disable transitions.
 */
export function useReducedMotion(): boolean {
  const { state } = useAppState();
  const [osPrefersReduced, setOsPrefersReduced] = useState<boolean>(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e: MediaQueryListEvent) => setOsPrefersReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return state.settings.reducedMotion || osPrefersReduced;
}
