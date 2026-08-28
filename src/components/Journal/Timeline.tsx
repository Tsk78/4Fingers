import { memo } from 'react';
import type { JournalEntry } from '@/types';
import { JournalCard } from './JournalCard';

interface TimelineProps {
  entries: JournalEntry[];
  /** date key of today's entry, rendered separately above the timeline. */
  todayDate: string;
}

// Past entries (all except today's), newest first. Memoized (design.md §8).
export const Timeline = memo(function Timeline({ entries, todayDate }: TimelineProps) {
  const past = entries
    .filter((e) => e.date !== todayDate)
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  if (past.length === 0) return null;

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-mist/60">
        Past entries
      </h2>
      <ol className="space-y-3">
        {past.map((entry) => (
          <li key={entry.date}>
            <JournalCard entry={entry} />
          </li>
        ))}
      </ol>
    </div>
  );
});
