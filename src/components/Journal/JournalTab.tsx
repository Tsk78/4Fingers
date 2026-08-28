import { useCallback } from 'react';
import { BookOpen } from 'lucide-react';
import { GlassCard } from '@/components/GlassCard';
import { JungleButton } from '@/components/JungleButton';
import { useAppState } from '@/hooks/useAppState';
import { useToast } from '@/hooks/useToast';
import { buildJournalEntry, todayKey } from '@/data/journal';
import { JournalCard } from './JournalCard';
import { Timeline } from './Timeline';

export function JournalTab() {
  const { state, dispatch } = useAppState();
  const { enqueue } = useToast();

  const today = todayKey();
  const todaysEntry = state.journalEntries.find((e) => e.date === today) ?? null;

  const handleGenerate = useCallback(() => {
    const entry = buildJournalEntry(state);
    // Reducer replaces any existing entry for today; other dates untouched (§5.3).
    dispatch({ type: 'JOURNAL_GENERATED', payload: entry });
    enqueue(
      todaysEntry
        ? "Today's journal updated!"
        : 'Daily Ranger Journal generated!',
    );
  }, [state, dispatch, enqueue, todaysEntry]);

  return (
    <section aria-labelledby="journal-heading" className="space-y-4">
      <h1 id="journal-heading" className="text-2xl font-bold text-mist">
        Souvenir Journal
      </h1>

      <GlassCard className="flex items-center gap-3">
        <BookOpen size={22} className="shrink-0 text-leaf-light" aria-hidden="true" />
        <p className="text-sm text-mist/80">
          Capture today's expedition — your species, quests, and badges become a
          shareable postcard.
        </p>
      </GlassCard>

      <JungleButton onClick={handleGenerate} className="w-full">
        {todaysEntry ? 'Regenerate Today’s Journal' : 'Generate Daily Ranger Journal'}
      </JungleButton>

      {todaysEntry ? (
        <div className="space-y-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-mist/60">
            Today
          </h2>
          <JournalCard entry={todaysEntry} highlight />
        </div>
      ) : (
        <p className="text-center text-sm text-mist/60">
          No journal yet today. Tap the button above to create one.
        </p>
      )}

      <Timeline entries={state.journalEntries} todayDate={today} />
    </section>
  );
}
