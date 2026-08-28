import { memo } from 'react';
import { Leaf, Sparkles, Award } from 'lucide-react';
import type { JournalEntry } from '@/types';
import { formatDisplayDate, speciesName } from '@/data/journal';
import { getQuestById, BADGES } from '@/data/quests';

interface JournalCardProps {
  entry: JournalEntry;
  /** Highlight styling for today's freshly-generated entry. */
  highlight?: boolean;
}

const badgeById = (id: string) =>
  Object.values(BADGES).find((b) => b.id === id);

// Postcard-style card (Requirement 6.4). Memoized so timeline items don't
// re-render on unrelated state changes (design.md §8).
export const JournalCard = memo(function JournalCard({
  entry,
  highlight,
}: JournalCardProps) {
  return (
    <article
      className={`rounded-card border p-5 shadow-glass ${
        highlight
          ? 'border-amber/40 bg-gradient-to-br from-jungle-light/80 to-jungle-dark'
          : 'border-white/10 bg-white/5'
      }`}
      aria-label={`Ranger journal for ${formatDisplayDate(entry.date)}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <Leaf size={18} className="text-leaf-light" aria-hidden="true" />
          <h3 className="font-semibold text-mist">Ranger Journal</h3>
        </div>
        <time className="text-xs text-mist/70" dateTime={entry.date}>
          {formatDisplayDate(entry.date)}
        </time>
      </div>

      {/* Summary */}
      <div className="mt-3 flex flex-wrap gap-4 text-sm text-mist/80">
        <span className="inline-flex items-center gap-1">
          <Sparkles size={14} className="text-amber" aria-hidden="true" />
          {entry.xpAtGeneration} XP
        </span>
        <span>{entry.speciesDiscovered.length} species</span>
        <span>{entry.questsCompleted.length} quests</span>
        <span>{entry.badgesEarned.length} badges</span>
      </div>

      {/* Species discovered */}
      {entry.speciesDiscovered.length > 0 && (
        <div className="mt-3">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-mist/60">
            Species discovered
          </h4>
          <ul className="mt-1 flex flex-wrap gap-1.5">
            {entry.speciesDiscovered.map((id) => (
              <li
                key={id}
                className="rounded-full bg-leaf/15 px-2.5 py-0.5 text-xs text-leaf-light"
              >
                {speciesName(id)}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Achievements */}
      {(entry.questsCompleted.length > 0 || entry.badgesEarned.length > 0) && (
        <div className="mt-3">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-mist/60">
            Achievements
          </h4>
          <ul className="mt-1 space-y-1 text-sm text-mist/80">
            {entry.questsCompleted.map((id) => (
              <li key={id} className="flex items-center gap-1.5">
                <Award size={13} className="text-amber" aria-hidden="true" />
                {getQuestById(id)?.title ?? id}
              </li>
            ))}
          </ul>
          {entry.badgesEarned.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {entry.badgesEarned.map((id) => {
                const badge = badgeById(id);
                return (
                  <span key={id} className="text-lg" title={badge?.name} aria-label={badge?.name}>
                    {badge?.icon ?? '🏅'}
                  </span>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Conservation message */}
      <p className="mt-4 rounded-2xl bg-jungle-dark/40 p-3 text-sm italic text-mist/90">
        {entry.conservationMessage}
      </p>
    </article>
  );
});
