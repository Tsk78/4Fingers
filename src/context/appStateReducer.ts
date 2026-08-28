import type { JournalEntry, SpeciesResult, UserState } from '@/types';
import { SCHEMA_VERSION } from '@/types';
import { getRankForXP } from '@/data/ranks';

export const DEFAULT_USER_STATE: UserState = {
  schemaVersion: SCHEMA_VERSION,
  xp: 0,
  rank: 'Explorer',
  unlockedSpecies: [],
  unlockedQuests: [],
  completedQuests: [],
  badges: [],
  visitedExhibits: [],
  journalEntries: [],
  sessionHistory: [],
  settings: {
    demoMode: true,
    sound: true,
    reducedMotion: false,
  },
  hasSeenInstallPrompt: false,
};

export type AppAction =
  | { type: 'SPECIES_UNLOCKED'; payload: SpeciesResult }
  | { type: 'QUEST_UNLOCKED'; payload: { questId: string } }
  | {
      type: 'QUEST_COMPLETED';
      payload: { questId: string; xpAwarded: number; badgeId?: string };
    }
  | { type: 'EXHIBIT_VISITED'; payload: { exhibitId: string } }
  | { type: 'JOURNAL_GENERATED'; payload: JournalEntry }
  | { type: 'INSTALL_PROMPT_DISMISSED' }
  | { type: 'SETTINGS_CHANGED'; payload: Partial<UserState['settings']> }
  | { type: 'RESET_STATE' };

const now = () => Date.now();

/**
 * Applies an XP delta, recomputes rank via the single source of truth, and
 * appends a rank_up SessionEvent when a threshold is crossed.
 */
function applyXp(state: UserState, delta: number): UserState {
  const xp = state.xp + delta;
  const rank = getRankForXP(xp);
  const rankChanged = rank !== state.rank;
  return {
    ...state,
    xp,
    rank,
    sessionHistory: rankChanged
      ? [...state.sessionHistory, { type: 'rank_up', refId: rank, timestamp: now() }]
      : state.sessionHistory,
  };
}

export function appStateReducer(state: UserState, action: AppAction): UserState {
  switch (action.type) {
    case 'SPECIES_UNLOCKED': {
      const { id, xpAwarded } = action.payload;
      // Idempotent: re-scanning an already-unlocked species awards nothing.
      if (state.unlockedSpecies.includes(id)) {
        return state;
      }
      const withSpecies: UserState = {
        ...state,
        unlockedSpecies: [...state.unlockedSpecies, id],
        sessionHistory: [
          ...state.sessionHistory,
          { type: 'scan', refId: id, timestamp: now() },
        ],
      };
      return applyXp(withSpecies, xpAwarded);
    }

    case 'QUEST_UNLOCKED': {
      const { questId } = action.payload;
      // Unlocking makes a quest visible on the Quests tab (Requirement 3.5);
      // it does not complete it. Idempotent — no duplicate if already unlocked
      // or already completed.
      if (
        state.unlockedQuests.includes(questId) ||
        state.completedQuests.includes(questId)
      ) {
        return state;
      }
      return { ...state, unlockedQuests: [...state.unlockedQuests, questId] };
    }

    case 'QUEST_COMPLETED': {
      const { questId, xpAwarded, badgeId } = action.payload;
      if (state.completedQuests.includes(questId)) {
        return state;
      }
      const withQuest: UserState = {
        ...state,
        completedQuests: [...state.completedQuests, questId],
        badges:
          badgeId && !state.badges.includes(badgeId)
            ? [...state.badges, badgeId]
            : state.badges,
        sessionHistory: [
          ...state.sessionHistory,
          { type: 'quest_complete', refId: questId, timestamp: now() },
        ],
      };
      return applyXp(withQuest, xpAwarded);
    }

    case 'EXHIBIT_VISITED': {
      const { exhibitId } = action.payload;
      if (state.visitedExhibits.includes(exhibitId)) {
        return state;
      }
      return {
        ...state,
        visitedExhibits: [...state.visitedExhibits, exhibitId],
        sessionHistory: [
          ...state.sessionHistory,
          { type: 'exhibit_visit', refId: exhibitId, timestamp: now() },
        ],
      };
    }

    case 'JOURNAL_GENERATED': {
      const entry = action.payload;
      // Replace-if-exists-for-today, never duplicate; other dates untouched.
      return {
        ...state,
        journalEntries: [
          ...state.journalEntries.filter((e) => e.date !== entry.date),
          entry,
        ],
      };
    }

    case 'INSTALL_PROMPT_DISMISSED':
      return { ...state, hasSeenInstallPrompt: true };

    case 'SETTINGS_CHANGED':
      return { ...state, settings: { ...state.settings, ...action.payload } };

    case 'RESET_STATE':
      return { ...DEFAULT_USER_STATE };

    default:
      return state;
  }
}
