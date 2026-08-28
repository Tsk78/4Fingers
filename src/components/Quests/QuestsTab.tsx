import { GlassCard } from '@/components/GlassCard';
import { ProgressBar } from '@/components/ProgressBar';
import { XPBadge } from '@/components/XPBadge';
import { useAppState } from '@/hooks/useAppState';
import { getRankProgress } from '@/data/ranks';

// Placeholder — full quest list, badges, and rank-up flow land in Phase 4.
// Wired to shared state now so cross-tab reactivity is verifiable early.
export function QuestsTab() {
  const { state } = useAppState();
  const progress = getRankProgress(state.xp);

  return (
    <section aria-labelledby="quests-heading" className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 id="quests-heading" className="text-2xl font-bold text-mist">
          Ranger Quests
        </h1>
        <XPBadge xp={state.xp} />
      </div>
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
              : 'Max rank'
          }
        />
        <p className="text-sm text-mist/70">
          Completed quests: {state.completedQuests.length} · Badges:{' '}
          {state.badges.length}
        </p>
      </GlassCard>
    </section>
  );
}
