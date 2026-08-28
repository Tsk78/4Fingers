import { useCallback, useMemo, useState } from 'react';
import { GlassCard } from '@/components/GlassCard';
import { ProgressBar } from '@/components/ProgressBar';
import { XPBadge } from '@/components/XPBadge';
import { useAppState } from '@/hooks/useAppState';
import { useToast } from '@/hooks/useToast';
import { getRankForXP, getRankProgress } from '@/data/ranks';
import { QUESTS, STATIC_QUESTS, BADGES, type Quest } from '@/data/quests';
import type { RankName } from '@/types';
import { QuestCard, LockedQuestHint } from './QuestCard';
import { BadgeCard } from './BadgeCard';
import { RankUpCelebration } from './RankUpCelebration';

const ALL_BADGES = Object.values(BADGES);

export function QuestsTab() {
  const { state, dispatch } = useAppState();
  const { enqueue } = useToast();
  const progress = getRankProgress(state.xp);
  const [rankUp, setRankUp] = useState<RankName | null>(null);

  // Visible missions = static quests + any dynamically-unlocked quests (Req 3.5).
  const visibleQuests = useMemo(() => {
    const dynamicUnlocked = QUESTS.filter(
      (q) => q.dynamic && state.unlockedQuests.includes(q.id),
    );
    return [...STATIC_QUESTS, ...dynamicUnlocked];
  }, [state.unlockedQuests]);

  const hasLockedDynamic = useMemo(
    () => QUESTS.some((q) => q.dynamic && !state.unlockedQuests.includes(q.id)),
    [state.unlockedQuests],
  );

  const handleComplete = useCallback(
    (quest: Quest) => {
      if (state.completedQuests.includes(quest.id)) return;

      // Detect rank-up by projecting the new XP total (thresholds are the
      // single source of truth via getRankForXP).
      const prevRank = getRankForXP(state.xp);
      const nextRank = getRankForXP(state.xp + quest.xpReward);

      dispatch({
        type: 'QUEST_COMPLETED',
        payload: {
          questId: quest.id,
          xpAwarded: quest.xpReward,
          badgeId: quest.badge?.id,
        },
      });

      enqueue(`Quest complete: ${quest.title} (+${quest.xpReward} XP)`);
      if (nextRank !== prevRank) {
        setRankUp(nextRank);
      }
    },
    [state.completedQuests, state.xp, dispatch, enqueue],
  );

  return (
    <section aria-labelledby="quests-heading" className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 id="quests-heading" className="text-2xl font-bold text-mist">
          Ranger Quests
        </h1>
        <XPBadge xp={state.xp} />
      </div>

      {/* Rank + progress */}
      <GlassCard className="space-y-3">
        <div className="flex items-baseline justify-between">
          <span className="text-lg font-semibold text-mist">{state.rank}</span>
          {progress.nextRank && (
            <span className="text-sm text-mist/70">Next: {progress.nextRank}</span>
          )}
        </div>
        <ProgressBar
          ratio={progress.progressRatio}
          label="Rank progress"
          valueText={
            progress.nextBandFloor !== null
              ? `${state.xp} / ${progress.nextBandFloor} XP`
              : 'Max rank reached'
          }
        />
      </GlassCard>

      {/* Badges */}
      <div>
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-mist/60">
          Badges
        </h2>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
          {ALL_BADGES.map((badge) => (
            <BadgeCard
              key={badge.id}
              badge={badge}
              earned={state.badges.includes(badge.id)}
            />
          ))}
        </div>
      </div>

      {/* Missions */}
      <div className="space-y-2">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-mist/60">
          Missions
        </h2>
        {visibleQuests.map((quest) => (
          <QuestCard
            key={quest.id}
            quest={quest}
            completed={state.completedQuests.includes(quest.id)}
            onComplete={handleComplete}
          />
        ))}
        {hasLockedDynamic && <LockedQuestHint />}
      </div>

      <RankUpCelebration rank={rankUp} onDone={() => setRankUp(null)} />
    </section>
  );
}
