import { AnimatePresence, motion } from 'framer-motion';
import { Award } from 'lucide-react';
import type { RankName } from '@/types';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface RankUpCelebrationProps {
  rank: RankName | null;
  onDone: () => void;
}

/**
 * Full-screen rank-up flourish (Requirement 5.3). Animates scale/opacity only.
 * Reduced motion shows a brief static confirmation instead of a bounce.
 */
export function RankUpCelebration({ rank, onDone }: RankUpCelebrationProps) {
  const reducedMotion = useReducedMotion();

  return (
    <AnimatePresence>
      {rank && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-jungle-dark/80 backdrop-blur-glass"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.25 }}
          onClick={onDone}
          role="alertdialog"
          aria-label={`Rank up: ${rank}`}
        >
          <motion.div
            className="flex flex-col items-center gap-3 px-8 text-center"
            initial={reducedMotion ? { scale: 1 } : { scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={
              reducedMotion
                ? { duration: 0 }
                : { type: 'spring', stiffness: 260, damping: 16 }
            }
          >
            <Award size={72} className="text-amber" aria-hidden="true" />
            <p className="text-sm uppercase tracking-widest text-leaf-light">
              Rank up!
            </p>
            <h2 className="text-3xl font-bold text-mist">{rank}</h2>
            <p className="text-sm text-mist/70">Tap to continue</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
