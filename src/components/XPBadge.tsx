import { Sparkles } from 'lucide-react';
import { AnimatedCounter } from './AnimatedCounter';

interface XPBadgeProps {
  xp: number;
}

/** Compact XP indicator with an animated count. */
export function XPBadge({ xp }: XPBadgeProps) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full bg-amber/20 px-3 py-1 text-sm font-semibold text-amber"
      aria-label={`${xp} experience points`}
    >
      <Sparkles size={16} aria-hidden="true" />
      <AnimatedCounter value={xp} />
      <span aria-hidden="true">XP</span>
    </span>
  );
}
