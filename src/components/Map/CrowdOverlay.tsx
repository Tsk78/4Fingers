import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

type OverlayVariant = 'heat' | 'destination';

interface CrowdOverlayProps {
  x: number;
  y: number;
  variant: OverlayVariant;
}

const COLORS: Record<OverlayVariant, string> = {
  heat: '#e2413b', // Danger Heat Zone (Requirement 3.2)
  destination: '#3fae6b', // navigation destination pulse (Requirement 3.4)
};

/**
 * A pulsing ring drawn over a map node. Used both for the crowded Orangutan
 * "heat zone" and the pulsing Fragile Forest destination marker.
 * Animates scale/opacity only (design.md §8). Reduced motion shows a static glow.
 */
export function CrowdOverlay({ x, y, variant }: CrowdOverlayProps) {
  const reducedMotion = useReducedMotion();
  const color = COLORS[variant];

  return (
    <g pointerEvents="none">
      {/* static glow disc */}
      <circle cx={x} cy={y} r={34} fill={color} opacity={variant === 'heat' ? 0.35 : 0.25} />
      {/* pulsing ring */}
      {reducedMotion ? (
        <circle cx={x} cy={y} r={40} fill="none" stroke={color} strokeWidth={4} opacity={0.6} />
      ) : (
        <motion.circle
          cx={x}
          cy={y}
          r={30}
          fill="none"
          stroke={color}
          strokeWidth={4}
          initial={{ scale: 0.8, opacity: 0.8 }}
          animate={{ scale: 1.8, opacity: 0 }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
          style={{ transformOrigin: `${x}px ${y}px` }}
        />
      )}
    </g>
  );
}
