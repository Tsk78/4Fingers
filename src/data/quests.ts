import { DOUBLE_XP_QUEST_ID } from '@/data/map';
import { TOTAL_SPECIES_XP } from '@/data/species';

// Re-export the rank source of truth so quest consumers have one import site.
export { getRankForXP, getRankProgress, RANK_THRESHOLDS } from '@/data/ranks';

// Seeded missions (Requirement 5.1, 5.4). Each may grant a badge on completion.
//
// XP calibration (Requirement 5.5): the four STATIC missions total 330 XP.
// Combined with all species (280 XP), a playthrough reaches 610 XP — past the
// Master Ranger threshold (600) WITHOUT relying on the dynamic Double XP quest.
// The dynamic Double XP quest (unlocked from the Map tab) adds a further bonus.

export interface Badge {
  id: string;
  name: string;
  icon: string; // emoji placeholder (design.md §7 placeholder convention)
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  badge?: Badge;
  /** Dynamically-unlocked quests are hidden until added to state.unlockedQuests. */
  dynamic?: boolean;
}

export const BADGES: Record<string, Badge> = {
  keeper: { id: 'keeper', name: 'Keeper-in-Training', icon: '🪣' },
  primate: { id: 'primate', name: 'Primate Pal', icon: '🦧' },
  nightOwl: { id: 'night-owl', name: 'Night Owl', icon: '🦉' },
  champion: { id: 'champion', name: 'Conservation Champion', icon: '🌿' },
  crowdBeater: { id: 'crowd-beater', name: 'Crowd Beater', icon: '⚡' },
};

export const QUESTS: readonly Quest[] = [
  {
    id: 'quest-keeper-in-training',
    title: 'Keeper-in-Training',
    description: 'Visit your first habitat exhibit on the park map.',
    xpReward: 70,
    badge: BADGES.keeper,
  },
  {
    id: 'quest-primate-tool-explorer',
    title: 'Primate Tool Explorer',
    description: 'Scan a great ape in the WildDex camera.',
    xpReward: 80,
    badge: BADGES.primate,
  },
  {
    id: 'quest-night-trail-explorer',
    title: 'Night Trail Explorer',
    description: 'Discover a nocturnal species along the Night Trail.',
    xpReward: 80,
    badge: BADGES.nightOwl,
  },
  {
    id: 'quest-conservation-champion',
    title: 'Conservation Champion',
    description: 'Learn the conservation status of three different species.',
    xpReward: 100,
    badge: BADGES.champion,
  },
  {
    // Dynamically unlocked by "Simulate Peak Traffic" on the Map tab (design.md §5.2).
    id: DOUBLE_XP_QUEST_ID,
    title: 'Double XP — Fragile Forest',
    description: 'Beat the crowd! Head to Fragile Forest for a limited-time XP boost.',
    xpReward: 120,
    badge: BADGES.crowdBeater,
    dynamic: true,
  },
] as const;

/** Static (always-available) missions. */
export const STATIC_QUESTS = QUESTS.filter((q) => !q.dynamic);

/** Total XP from static quests only (calibration check). */
export const TOTAL_STATIC_QUEST_XP = STATIC_QUESTS.reduce(
  (sum, q) => sum + q.xpReward,
  0,
);

/**
 * Sanity value used in a build-time console note: species + static quests.
 * Must be >= 600 (Master Ranger) per Requirement 5.5.
 */
export const FULL_PLAYTHROUGH_XP = TOTAL_SPECIES_XP + TOTAL_STATIC_QUEST_XP;

export function getQuestById(id: string): Quest | undefined {
  return QUESTS.find((q) => q.id === id);
}
