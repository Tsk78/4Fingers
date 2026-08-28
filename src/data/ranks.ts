import type { RankName } from '@/types';

// Fixed rank thresholds (Requirement 5.2, design.md §3.2).
// This is the SINGLE source of truth — never hardcode rank logic elsewhere.
export interface RankThreshold {
  name: RankName;
  minXp: number;
}

// Ordered ascending by minXp.
export const RANK_THRESHOLDS: readonly RankThreshold[] = [
  { name: 'Explorer', minXp: 0 },
  { name: 'Junior Ranger', minXp: 100 },
  { name: 'Senior Ranger', minXp: 300 },
  { name: 'Master Ranger', minXp: 600 },
] as const;

/** Pure function: resolve an XP total to its rank. */
export function getRankForXP(xp: number): RankName {
  let current: RankName = RANK_THRESHOLDS[0].name;
  for (const threshold of RANK_THRESHOLDS) {
    if (xp >= threshold.minXp) {
      current = threshold.name;
    } else {
      break;
    }
  }
  return current;
}

/**
 * XP needed to reach the next rank and progress within the current band.
 * Returns null `nextRank` when already at the top rank.
 */
export function getRankProgress(xp: number): {
  currentRank: RankName;
  nextRank: RankName | null;
  currentBandFloor: number;
  nextBandFloor: number | null;
  progressRatio: number; // 0..1 within the current band
} {
  const currentRank = getRankForXP(xp);
  const currentIndex = RANK_THRESHOLDS.findIndex((t) => t.name === currentRank);
  const currentBandFloor = RANK_THRESHOLDS[currentIndex].minXp;
  const next = RANK_THRESHOLDS[currentIndex + 1] ?? null;

  if (!next) {
    return {
      currentRank,
      nextRank: null,
      currentBandFloor,
      nextBandFloor: null,
      progressRatio: 1,
    };
  }

  const bandSize = next.minXp - currentBandFloor;
  const progressRatio = bandSize > 0 ? (xp - currentBandFloor) / bandSize : 0;
  return {
    currentRank,
    nextRank: next.name,
    currentBandFloor,
    nextBandFloor: next.minXp,
    progressRatio: Math.min(1, Math.max(0, progressRatio)),
  };
}
