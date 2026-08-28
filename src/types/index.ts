// Core data model — single source of truth for shared app state.
// See design.md §3.2. No component should redefine these shapes.

// Bumped to 2 in Phase 2: added `unlockedQuests` so dynamically-unlocked
// quests (e.g. the Map's Double XP quest) surface on the Quests tab.
// Older persisted state without this field falls back to defaults.
export const SCHEMA_VERSION = 2;

export type RankName = 'Explorer' | 'Junior Ranger' | 'Senior Ranger' | 'Master Ranger';

export interface JournalEntry {
  /** ISO date, e.g. "2026-08-28" — acts as the entry's unique key (one per calendar day). */
  date: string;
  xpAtGeneration: number;
  speciesDiscovered: string[];
  questsCompleted: string[];
  badgesEarned: string[];
  conservationMessage: string;
}

export interface SessionEvent {
  type: 'scan' | 'quest_complete' | 'exhibit_visit' | 'rank_up';
  refId: string;
  timestamp: number;
}

export interface UserSettings {
  demoMode: true;
  sound: boolean;
  reducedMotion: boolean;
}

export interface UserState {
  schemaVersion: number;
  xp: number;
  rank: RankName;
  /** species IDs only — never raw image data (Requirement 4.6). */
  unlockedSpecies: string[];
  /** quest IDs made visible dynamically (e.g. Double XP from the Map tab). */
  unlockedQuests: string[];
  completedQuests: string[];
  badges: string[];
  visitedExhibits: string[];
  /** one entry per calendar date, keyed by `date`. */
  journalEntries: JournalEntry[];
  sessionHistory: SessionEvent[];
  settings: UserSettings;
  hasSeenInstallPrompt: boolean;
}

/**
 * Result of a species "scan" — returned by any AIAnalyzer implementation
 * (demo now, AWS-backed in the future). See design.md §6.
 */
export interface SpeciesResult {
  id: string;
  commonName: string;
  scientificName: string;
  funFacts: string[];
  conservationStatus: string;
  xpAwarded: number;
  photoUrl: string;
}
