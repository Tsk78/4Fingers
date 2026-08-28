import type { JournalEntry, UserState } from '@/types';
import { getSpeciesById } from '@/data/species';

// Journal construction (Requirement 6.1). Builds a JournalEntry snapshot from
// the current shared state. Kept out of components so the copy/logic lives in
// the data layer (design.md §10).

/** Local calendar date as an ISO day key, e.g. "2026-08-28". */
export function todayKey(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Human-friendly date for display, e.g. "28 August 2026". */
export function formatDisplayDate(isoDate: string): string {
  const [y, m, d] = isoDate.split('-').map(Number);
  const date = new Date(y, (m ?? 1) - 1, d ?? 1);
  return date.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

// Conservation messages scale with how much the visitor engaged (Req 6.1).
const CONSERVATION_MESSAGES = {
  none: 'Every great ranger starts with a single step. Come explore and discover the species that call Mandai home.',
  some: 'Thanks for getting to know our wildlife. Small actions — reducing waste, sharing what you learn — help protect these species.',
  many: 'What a dedicated ranger! The species you met today face real threats in the wild. Supporting habitat protection keeps their forests standing.',
  all: 'Master Ranger! You met every species on the trail. Carry their stories forward — awareness is the first act of conservation.',
} as const;

function pickConservationMessage(speciesCount: number): string {
  if (speciesCount === 0) return CONSERVATION_MESSAGES.none;
  if (speciesCount >= 4) return CONSERVATION_MESSAGES.all;
  if (speciesCount >= 2) return CONSERVATION_MESSAGES.many;
  return CONSERVATION_MESSAGES.some;
}

/**
 * Builds today's journal entry from a state snapshot. The `date` key makes it
 * unique per calendar day; the reducer replaces any existing entry for that day.
 */
export function buildJournalEntry(state: UserState, now: Date = new Date()): JournalEntry {
  return {
    date: todayKey(now),
    xpAtGeneration: state.xp,
    speciesDiscovered: [...state.unlockedSpecies],
    questsCompleted: [...state.completedQuests],
    badgesEarned: [...state.badges],
    conservationMessage: pickConservationMessage(state.unlockedSpecies.length),
  };
}

/** Resolves a species id to its common name for display (falls back to the id). */
export function speciesName(id: string): string {
  return getSpeciesById(id)?.commonName ?? id;
}
