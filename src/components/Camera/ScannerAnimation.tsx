import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/**
 * Scanner reticle: corner brackets + a sweeping scan line + pulse.
 * Shown for ~1s while the DemoAIAnalyzer "processes" (Requirement 4.3).
 * Animates transform/opacity only (design.md §8); reduced motion shows a
 * static reticle with no sweep.
 */
export function ScannerAnimation() {
  const reducedMotion = useReducedMotion();

  return (
    <div
      className="pointer-events-none absolute inset-0 flex items-center justify-center"
      aria-hidden="true"
    >
      <div className="relative h-56 w-56">
        {/* Corner brackets */}
        {(['tl', 'tr', 'bl', 'br'] as const).map((corner) => (
          <span
            key={corner}
            className={[
              'absolute h-8 w-8 border-leaf-light',
              corner === 'tl' && 'left-0 top-0 border-l-4 border-t-4 rounded-tl-lg',
              corner === 'tr' && 'right-0 top-0 border-r-4 border-t-4 rounded-tr-lg',
              corner === 'bl' && 'bottom-0 left-0 border-b-4 border-l-4 rounded-bl-lg',
              corner === 'br' && 'bottom-0 right-0 border-b-4 border-r-4 rounded-br-lg',
            ]
              .filter(Boolean)
              .join(' ')}
          />
        ))}

        {/* Sweeping scan line */}
        {!reducedMotion && (
          <motion.div
            className="absolute inset-x-2 h-0.5 bg-leaf-light shadow-[0_0_12px_2px_rgba(111,215,154,0.8)]"
            initial={{ top: '8%', opacity: 0.9 }}
            animate={{ top: ['8%', '92%', '8%'] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}

        {/* Center pulse */}
        {!reducedMotion && (
          <motion.div
            className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-leaf-light"
            initial={{ scale: 0.6, opacity: 0.8 }}
            animate={{ scale: 1.6, opacity: 0 }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeOut' }}
          />
        )}
      </div>
    </div>
  );
}
