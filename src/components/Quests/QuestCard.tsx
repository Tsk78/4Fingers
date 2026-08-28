import { memo } from 'react';
import { Check, Sparkles, Lock } from 'lucide-react';
import { GlassCard } from '@/components/GlassCard';
import { JungleButton } from '@/components/JungleButton';
import type { Quest } from '@/data/quests';

interface QuestCardProps {
  quest: Quest;
  completed: boolean;
  onComplete: (quest: Quest) => void;
}

// React.memo so an XP tick elsewhere doesn't re-render every quest (design.md §8).
export const QuestCard = memo(function QuestCard({
  quest,
  completed,
  onComplete,
}: QuestCardProps) {
  return (
    <GlassCard className={completed ? 'opacity-70' : ''}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-mist">{quest.title}</h3>
            {quest.dynamic && (
              <span className="rounded-full bg-amber/20 px-2 py-0.5 text-[10px] font-semibold uppercase text-amber">
                Bonus
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-mist/70">{quest.description}</p>
          <div className="mt-2 flex items-center gap-3 text-xs">
            <span className="inline-flex items-center gap-1 font-semibold text-amber">
              <Sparkles size={13} aria-hidden="true" />+{quest.xpReward} XP
            </span>
            {quest.badge && (
              <span className="text-mist/60">
                {quest.badge.icon} {quest.badge.name}
              </span>
            )}
          </div>
        </div>

        {completed ? (
          <span
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-leaf/20 text-leaf-light"
            aria-label="Completed"
          >
            <Check size={20} aria-hidden="true" />
          </span>
        ) : (
          <JungleButton
            onClick={() => onComplete(quest)}
            className="shrink-0 px-4 py-2 text-sm"
            aria-label={`Complete ${quest.title}`}
          >
            Complete
          </JungleButton>
        )}
      </div>
    </GlassCard>
  );
});

/** Placeholder shown for a locked/not-yet-unlocked dynamic quest slot. */
export const LockedQuestHint = memo(function LockedQuestHint() {
  return (
    <GlassCard className="flex items-center gap-3 text-mist/50">
      <Lock size={18} aria-hidden="true" />
      <p className="text-sm">
        A bonus quest can be unlocked from the Map tab during peak traffic.
      </p>
    </GlassCard>
  );
});
