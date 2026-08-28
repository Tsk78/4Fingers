# Design — Mandai WildDex & Ranger Expeditions

## 1. Environment & Pinned Dependencies

Do not install "latest" — pin these to avoid breaking API/config changes (e.g. Tailwind v4's config format differs substantially from v3):

| Package | Version |
|---|---|
| react / react-dom | ^18.3.x |
| vite | ^5.x |
| typescript | ^5.4.x |
| tailwindcss | ^3.4.x (v3, not v4 — config format assumed throughout this design) |
| framer-motion | ^11.x |
| lucide-react | ^0.4xx.x (latest 0.4xx patch) |
| vite-plugin-pwa | ^0.20.x |

Before running `npm install`, confirm the actual Node/npm version available in the environment and adjust only if a pinned package is incompatible — don't silently upgrade everything.

**Hard constraint:** this build must not call, provision, or configure any real AWS service under any circumstance, even if credentials are present in the environment. All AWS-shaped code is local interfaces only (Section 6).

---

## 2. Architecture Overview

```
┌─────────────────────────────────────────────┐
│                   App.tsx                    │
│  ErrorBoundary                                │
│    AppStateProvider (Context + useReducer)    │
│      BottomNavigation                         │
│      ┌─────────┬─────────┬─────────┬────────┐│
│      │  Map    │ Camera  │ Quests  │ Journal││
│      │  Tab    │  Tab    │  Tab    │  Tab   ││
│      └─────────┴─────────┴─────────┴────────┘│
└─────────────────────────────────────────────┘
              │
              ▼
      services/storage.ts  ──▶  LocalStorage
      services/aiDemo.ts   ──▶  data/species.ts
```

Single screen, tab-switched via local component state (no router). All four tab components are siblings under one `AppStateProvider`; none of them touches `localStorage` directly.

---

## 3. State Management

### 3.1 Context + Reducer (explicit exception to "avoid Context")

Cross-tab state (XP, rank, quests, badges, species, journal) must be visible from every tab simultaneously. Prop-drilling through four sibling tabs is impractical, so this is the one deliberate use of Context in the project — not a default reached for elsewhere.

```typescript
// context/AppStateContext.tsx
const AppStateContext = createContext<{
  state: UserState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appStateReducer, loadInitialState());

  useEffect(() => {
    storage.set('userState', state);
  }, [state]);

  return (
    <AppStateContext.Provider value={{ state, dispatch }}>
      {children}
    </AppStateContext.Provider>
  );
}
```

`hooks/useAppState.ts` wraps `useContext(AppStateContext)` with a null-check throw, so components get a clean typed hook rather than reaching into the raw context.

### 3.2 Data Model

```typescript
// types/index.ts

const SCHEMA_VERSION = 1;

interface UserState {
  schemaVersion: number;
  xp: number;
  rank: RankName;
  unlockedSpecies: string[];       // species IDs only
  completedQuests: string[];       // quest IDs
  badges: string[];                // badge IDs
  visitedExhibits: string[];       // exhibit IDs
  journalEntries: JournalEntry[];  // one per calendar date, keyed by date
  sessionHistory: SessionEvent[];
  settings: {
    demoMode: true;
    sound: boolean;
    reducedMotion: boolean;
  };
  hasSeenInstallPrompt: boolean;
}

type RankName = 'Explorer' | 'Junior Ranger' | 'Senior Ranger' | 'Master Ranger';

interface JournalEntry {
  date: string;           // ISO date, e.g. "2026-08-28" — acts as the entry's unique key
  xpAtGeneration: number;
  speciesDiscovered: string[];
  questsCompleted: string[];
  badgesEarned: string[];
  conservationMessage: string;
}

interface SessionEvent {
  type: 'scan' | 'quest_complete' | 'exhibit_visit' | 'rank_up';
  refId: string;
  timestamp: number;
}

interface SpeciesResult {
  id: string;
  commonName: string;
  scientificName: string;
  funFacts: string[];
  conservationStatus: string;
  xpAwarded: number;
  photoUrl: string;
}
```

**Rank thresholds (fixed, not to be re-derived elsewhere):**

| Rank | XP range |
|---|---|
| Explorer | 0–99 |
| Junior Ranger | 100–299 |
| Senior Ranger | 300–599 |
| Master Ranger | 600+ |

A pure function `getRankForXP(xp: number): RankName` in `data/quests.ts` (or a shared `data/ranks.ts`) is the single source of truth the reducer calls — never hardcode rank logic elsewhere.

### 3.3 Storage Service

```typescript
// services/storage.ts
export const storage = {
  get<T>(key: string): T | null { /* try/catch JSON.parse, null on failure */ },
  set<T>(key: string, value: T): void { /* JSON.stringify + localStorage.setItem */ },
  subscribe(callback: () => void): () => void { /* storage event listener, returns unsubscribe */ },
};

export function loadInitialState(): UserState {
  const stored = storage.get<UserState>('userState');
  if (!stored || stored.schemaVersion !== SCHEMA_VERSION) {
    return DEFAULT_USER_STATE;
  }
  return stored;
}
```

Only `AppStateProvider` calls `storage.get`/`storage.set`. No other file imports `localStorage` directly — enforce this in code review/self-check before marking any phase done.

**Storage size discipline:** never write base64 image data into `UserState`. Captured camera frames used for a result-card preview live only in local component state (e.g. `useState<string | null>` in the Camera tab) and are discarded on navigation away.

### 3.4 Toast Queue

A single `ToastContext`/`Toast` component owns a FIFO queue (array of pending messages + one "current" toast). New toasts push onto the queue; the current toast auto-dismisses after a fixed duration (~3s) and the next queued one takes its place. No two toasts render at once, regardless of how many events fire in the same tick (e.g. peak-traffic unlock + XP gain + badge unlock all queue in order).

---

## 4. Component Structure

```
src/
  App.tsx                     // ErrorBoundary + AppStateProvider + BottomNavigation + tab switch
  main.tsx

components/
  BottomNavigation.tsx
  GlassCard.tsx
  JungleButton.tsx
  Toast.tsx                   // queue-driven, one visible at a time
  ProgressBar.tsx
  XPBadge.tsx
  AnimatedCounter.tsx
  ErrorBoundary.tsx            // top-level crash containment, friendly fallback UI

  Map/
    ParkMap.tsx                // SVG, viewBox pan/zoom via native touch events
    CrowdOverlay.tsx
    AnimatedPath.tsx

  Camera/
    CameraHUD.tsx
    ScannerAnimation.tsx
    SpeciesResultCard.tsx
    CameraPermissionFallback.tsx  // shown on denial/unsupported browser

  Quests/
    QuestCard.tsx
    BadgeCard.tsx

  Journal/
    JournalCard.tsx
    Timeline.tsx

  Onboarding/
    InstallPromptOverlay.tsx   // iOS "Add to Home Screen" explainer

context/
  AppStateContext.tsx
  appStateReducer.ts

hooks/
  useCamera.ts                 // wraps getUserMedia + permission state machine
  useLocalStorage.ts
  useAppState.ts

services/
  aiDemo.ts                    // DemoAIAnalyzer implementing AIAnalyzer
  storage.ts
  sound.ts                     // two cues: scan-success chime, XP-gain tick

data/
  species.ts                   // 4 seeded species, real facts + XP values
  quests.ts                    // seeded missions + XP values + getRankForXP
  map.ts                       // node coordinates, habitat metadata

types/
  index.ts

public/
  manifest.json
  apple-touch-icon.png          // placeholder, commented as such
  icons/
  splash/
```

---

## 5. Key Flows

### 5.1 Camera Scan (Demo or Live)

```
User taps demo button OR captures frame
        │
        ▼
useCamera / demo button handler calls aiDemo.analyze({ speciesId? , imageDataUrl? })
        │
        ▼
DemoAIAnalyzer: look up species.ts record by ID, await ~1000ms delay
        │
        ▼
resolves SpeciesResult
        │
        ├─▶ dispatch({ type: 'SPECIES_UNLOCKED', payload: result })
        │      → reducer adds to unlockedSpecies, adds xp, recomputes rank via getRankForXP,
        │        appends SessionEvent, checks for rank-up
        ├─▶ sound.playScanChime() if settings.sound
        └─▶ Toast.enqueue("New species unlocked: {commonName}!")
```

`useCamera` hook owns the permission state machine: `idle → requesting → granted → active` or `idle → requesting → denied → fallback`. `CameraPermissionFallback` renders whenever state is `denied` or `unsupported`, showing only the four demo buttons.

### 5.2 Peak Traffic Simulation

```
User taps "Simulate Peak Traffic"
        │
        ▼
ParkMap local handler:
  - sets Orangutan node visual state to 'crowded' (local UI state, not persisted)
  - triggers AnimatedPath from current-location to Fragile Forest (Framer Motion)
  - Toast.enqueue("Heavy crowd at Orangutan exhibit! Double XP Quest unlocked...")
  - dispatch({ type: 'QUEST_UNLOCKED', payload: DOUBLE_XP_QUEST_ID })
        │
        ▼
Quests tab re-renders (subscribed to same context) showing the new quest immediately
```

### 5.3 Journal Generation

```
User taps "Generate Daily Ranger Journal"
        │
        ▼
Compute today's ISO date key
        │
        ▼
Build JournalEntry from current state snapshot (species, quests, badges, xp)
        │
        ▼
dispatch({ type: 'JOURNAL_GENERATED', payload: entry })
   reducer: journalEntries = [...entries.filter(e => e.date !== entry.date), entry]
            (replace-if-exists-for-today, never duplicate; other dates untouched)
```

---

## 6. Demo AI Interface (Future-AWS-Compatible, Local Only)

```typescript
interface AIAnalyzer {
  analyze(input: { speciesId?: string; imageDataUrl?: string }): Promise<SpeciesResult>;
}

// services/aiDemo.ts
export class DemoAIAnalyzer implements AIAnalyzer {
  async analyze(input: { speciesId?: string }): Promise<SpeciesResult> {
    await delay(1000);
    const record = SPECIES.find(s => s.id === input.speciesId);
    if (!record) throw new Error(`Unknown species id: ${input.speciesId}`);
    return record;
  }
}
```

No real classification occurs. No network call occurs. A future `ProductionAIAnalyzer` implementing the same interface (calling Rekognition/Bedrock through API Gateway/Lambda) is **out of scope for this build** — it is mentioned only so the interface boundary is drawn correctly now. Do not stub, mock, or scaffold any actual AWS SDK client, IAM role, or credentials file as part of this project.

```
Future-only reference (not built):
React PWA → CloudFront → API Gateway → Lambda → Bedrock/Rekognition
          → DynamoDB → Cognito → S3 → CloudWatch
```

---

## 7. PWA & Offline

- `vite-plugin-pwa` with `generateSW` strategy (simpler, sufficient for this scope over `injectManifest`).
- Precache: JS/CSS bundles, `manifest.json`, icons, and the static data modules' compiled output (species/quest data is bundled JS, so it's covered by default app-shell precaching — no extra runtime caching rules needed since there are no network calls to intercept).
- iOS meta tags set in `index.html`: `apple-mobile-web-app-capable`, `apple-mobile-web-app-status-bar-style`, `apple-mobile-web-app-title`, `theme-color`, manifest link, `display: standalone`.
- `InstallPromptOverlay` shown once, gated on `state.hasSeenInstallPrompt`; dismiss dispatches `INSTALL_PROMPT_DISMISSED`.
- Icons/splash: placeholder SVG-derived assets (simple leaf/badge motif in palette), explicitly commented in code as placeholders pending final art — no attempt to generate photorealistic PNG sets.

---

## 8. Performance Conventions

- `React.memo` on `QuestCard`, `BadgeCard`, `JournalCard`/`Timeline` items, and map habitat nodes, so an XP tick doesn't re-render unrelated lists.
- Framer Motion animations animate `transform`/`opacity` only, not layout-affecting properties.
- `useCamera` requests a modest resolution (e.g. `{ video: { facingMode: 'environment', width: { ideal: 720 } } }`) to keep camera start time low — do not request 4K.
- Reduced motion: a single `useReducedMotion()` hook reading both `settings.reducedMotion` and the OS `prefers-reduced-motion` media query; consumed by every Framer Motion component to shorten/disable transitions.

---

## 9. Error Handling

- One `ErrorBoundary` class component wraps the whole tree in `App.tsx`. Fallback UI: "Something went off the trail" + a button that clears LocalStorage and reloads.
- `storage.get` never throws outward — internally try/catches `JSON.parse` and returns `null`, letting `loadInitialState` fall back to defaults.
- `useCamera` treats `NotAllowedError`, `NotFoundError`, and insecure-context failures uniformly as "fallback to demo buttons" rather than differentiating error UI per case (keep it simple for demo purposes).

---

## 10. Conventions (treat as steering context — apply throughout, not just once)

- No `any` without an inline comment justifying it.
- No component reads/writes `localStorage` directly.
- No duplicated card/button markup — extend an existing reusable component with props instead of copy-pasting.
- Color palette, typography, and 24px corner-radius rule apply to every new UI surface, not just the ones explicitly called out in requirements.
- Every non-obvious numeric constant (XP values, thresholds, delay durations) lives in `data/` or a named constant, never inline magic numbers.
