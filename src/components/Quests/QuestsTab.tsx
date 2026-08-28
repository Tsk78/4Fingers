import { GlassCard } from '@/components/GlassCard';
import { ProgressBar } from '@/components/ProgressBar';
import { XPBadge } from '@/components/XPBadge';
import { useAppState } from '@/hooks/useAppState';
import { getRankProgress } from '@/data/ranks';
import { DOUBLE_XP_QUEST_ID } from '@/data/map';

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

      {/* Dynamically-unlocked quests (e.g. Double XP from the Map tab, Req 3.5).
          Full quest cards + completion flow land in Phase 4. */}
      {state.unlockedQuests.length > 0 && (
        <GlassCard className="space-y-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-leaf-light">
            Newly unlocked
          </h2>
          <ul className="space-y-1">
            {state.unlockedQuests.map((questId) => (
              <li key={questId} className="text-sm text-mist/90">
                {QUEST_LABELS[questId] ?? questId}
              </li>
            ))}
          </ul>
        </GlassCard>
      )}
    </section>
  );
}

// Minimal label lookup until Phase 4 seeds full quest data.
const QUEST_LABELS: Record<string, string> = {
  [DOUBLE_XP_QUEST_ID]: 'Double XP Quest — Fragile Forest',
};
