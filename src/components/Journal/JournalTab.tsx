import { GlassCard } from '@/components/GlassCard';
import { useAppState } from '@/hooks/useAppState';

// Placeholder — journal generation, postcard card, and timeline land in Phase 5.
export function JournalTab() {
  const { state } = useAppState();
  return (
    <section aria-labelledby="journal-heading" className="space-y-4">
      <h1 id="journal-heading" className="text-2xl font-bold text-mist">
        Souvenir Journal
      </h1>
      <GlassCard>
        <p className="text-mist/80">
          Daily Ranger Journal coming in Phase 5. Entries so far:{' '}
          <strong>{state.journalEntries.length}</strong>.
        </p>
      </GlassCard>
    </section>
  );
}
