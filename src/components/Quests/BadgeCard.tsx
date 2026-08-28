import { memo } from 'react';
import type { Badge } from '@/data/quests';

interface BadgeCardProps {
  badge: Badge;
  earned: boolean;
}

// React.memo — badges shouldn't re-render on unrelated state changes (design.md §8).
export const BadgeCard = memo(function BadgeCard({ badge, earned }: BadgeCardProps) {
  return (
    <div
      className={`flex flex-col items-center gap-1 rounded-card border p-3 text-center transition-colors ${
        earned
          ? 'border-amber/40 bg-amber/10'
          : 'border-white/10 bg-white/5 opacity-50 grayscale'
      }`}
      aria-label={`${badge.name} badge, ${earned ? 'earned' : 'not yet earned'}`}
    >
      <span className="text-2xl" aria-hidden="true">
        {badge.icon}
      </span>
      <span className="text-[11px] font-medium leading-tight text-mist/80">
        {badge.name}
      </span>
    </div>
  );
});
