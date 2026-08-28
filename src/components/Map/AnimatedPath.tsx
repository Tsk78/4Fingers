import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface AnimatedPathProps {
  points: ReadonlyArray<{ x: number; y: number }>;
}

/**
 * Green navigation path that draws itself from start to destination
 * (Requirement 3.4). Animates stroke draw only (via pathLength) — no layout
 * properties. Reduced motion renders the full path instantly.
 */
export function AnimatedPath({ points }: AnimatedPathProps) {
  const reducedMotion = useReducedMotion();
  if (points.length < 2) return null;

  const d = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ');

  return (
    <motion.path
      d={d}
      fill="none"
      stroke="#3fae6b"
      strokeWidth={10}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray="2 18"
      initial={reducedMotion ? { pathLength: 1 } : { pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: reducedMotion ? 0 : 1.1, ease: 'easeInOut' }}
      style={{ filter: 'drop-shadow(0 0 6px rgba(63,174,107,0.8))' }}
    />
  );
}
