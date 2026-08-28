// Park map data (design.md §4). Coordinates live in a fixed SVG user-space
// (VIEWBOX_WIDTH x VIEWBOX_HEIGHT); the backdrop image and nodes share it.

export const VIEWBOX_WIDTH = 1000;
export const VIEWBOX_HEIGHT = 1000;

/** Static backdrop served from public/ (placed in Phase 1). */
export const MAP_BACKGROUND_URL = '/map/habitat_map.png';

export type HabitatId = 'orangutan' | 'fragile-forest' | 'night-trail';

export interface HabitatNode {
  id: HabitatId;
  name: string;
  /** exhibit id used with EXHIBIT_VISITED in shared state. */
  exhibitId: string;
  x: number;
  y: number;
  /** short habitat descriptor shown on tap. */
  blurb: string;
}

// Positions roughly match the clover-trail regions of habitat_map.png.
export const HABITAT_NODES: readonly HabitatNode[] = [
  {
    id: 'orangutan',
    name: 'Orangutan Exhibit',
    exhibitId: 'exhibit-orangutan',
    x: 660,
    y: 300,
    blurb: 'Home of the Bornean orangutans, high in the canopy.',
  },
  {
    id: 'fragile-forest',
    name: 'Fragile Forest',
    exhibitId: 'exhibit-fragile-forest',
    x: 330,
    y: 470,
    blurb: 'A lush biodome — the calmer route during peak crowds.',
  },
  {
    id: 'night-trail',
    name: 'Night Trail',
    exhibitId: 'exhibit-night-trail',
    x: 560,
    y: 720,
    blurb: 'Nocturnal species along a dim, winding boardwalk.',
  },
] as const;

/** Visitor's current-location indicator (start of the navigation path). */
export const CURRENT_LOCATION = { x: 720, y: 560 } as const;

/**
 * Waypoints for the animated navigation path from the current location to
 * Fragile Forest (Requirement 3.4). Rendered as an SVG polyline/path.
 */
export const PATH_TO_FRAGILE_FOREST: ReadonlyArray<{ x: number; y: number }> = [
  { x: CURRENT_LOCATION.x, y: CURRENT_LOCATION.y },
  { x: 560, y: 520 },
  { x: 440, y: 500 },
  { x: 330, y: 470 },
] as const;

/**
 * Quest unlocked when peak traffic is simulated (design.md §5.2).
 * Shared constant so the Map tab and Quests tab reference the same id.
 */
export const DOUBLE_XP_QUEST_ID = 'quest-double-xp-fragile-forest';
