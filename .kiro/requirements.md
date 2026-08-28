# Requirements — Mandai WildDex & Ranger Expeditions

## Context

A demo-mode, offline-capable iOS PWA for a live executive/stakeholder demo. Four tabs: Map, Camera, Quests, Journal. No backend, no auth, no real AWS calls — everything runs locally against LocalStorage and mock services shaped to match a future AWS architecture.

**Non-negotiable constraint:** this environment may have real cloud credentials available. Nothing in this project may provision, call, or otherwise touch real AWS resources (Rekognition, Bedrock, S3, DynamoDB, Cognito, Lambda, etc.). All "AWS integration" work is confined to defining local TypeScript interfaces that a future implementation could satisfy. If at any point a task seems to require real AWS access, stop and flag it rather than proceeding.

---

## Requirement 1 — App Shell & Navigation

**User Story:** As a park visitor, I want to move between Map, Camera, Quests, and Journal without losing my progress, so the app feels like one continuous experience.

### Acceptance Criteria
1. WHEN the app loads THEN the system SHALL display a bottom navigation bar with four tabs: Map, Camera, Quests, Journal.
2. WHEN the user taps a tab THEN the system SHALL switch the visible screen without a full page reload or loss of in-memory state.
3. WHEN the user reloads the browser THEN the system SHALL restore all persisted user progress (XP, rank, unlocked species, completed quests, badges, journal entries) from LocalStorage.
4. IF LocalStorage contains no prior state OR the stored state fails to parse OR its `schemaVersion` does not match the app's expected version THEN the system SHALL fall back to a fresh default state rather than crashing.
5. IF an unhandled error occurs while rendering any tab THEN the system SHALL display a friendly fallback screen (via a top-level error boundary) instead of a blank page, with an action to reset app state.

---

## Requirement 2 — Shared App State

**User Story:** As a developer extending this app, I want a single source of truth for user progress, so that an action in one tab is immediately reflected in every other tab.

### Acceptance Criteria
1. WHEN XP, rank, unlocked species, completed quests, badges, or journal entries change anywhere in the app THEN the system SHALL update a single shared state store (React Context + reducer) that all tabs read from.
2. WHEN the shared state changes THEN the system SHALL persist the updated state to LocalStorage automatically, without requiring a manual save action.
3. THE system SHALL NOT allow any UI component to read or write `localStorage` directly — all persistence SHALL go through a single storage service exposing `get()`, `set()`, and `subscribe()`.
4. WHEN a quest is completed on the Quests tab THEN the Journal tab SHALL reflect it immediately if the journal is regenerated, without requiring a page reload.

---

## Requirement 3 — Map & Crowd Simulation (Tab 1)

**User Story:** As a park visitor, I want to see a live-feeling map with crowd conditions, so I can imagine navigating the park dynamically.

### Acceptance Criteria
1. WHEN the Map tab is opened THEN the system SHALL render an SVG map with three tappable habitat nodes: Orangutan, Fragile Forest, Night Trail.
2. WHEN the user taps "Simulate Peak Traffic" THEN the system SHALL change the Orangutan node's visual state to a glowing red (Danger Heat Zone color) within one second.
3. WHEN peak traffic is simulated THEN the system SHALL display a toast reading "Heavy crowd at Orangutan exhibit! Double XP Quest unlocked at Fragile Forest."
4. WHEN peak traffic is simulated THEN the system SHALL animate a green navigation path from the current-location indicator to the Fragile Forest node and pulse the destination marker.
5. WHEN peak traffic is simulated THEN the system SHALL add a "Double XP" quest to shared state such that it appears on the Quests tab without further user action.
6. WHEN the user performs a pinch gesture, drags, or taps +/- zoom controls on the map THEN the system SHALL pan/zoom the SVG viewBox accordingly, using native touch events rather than an external gesture library.
7. IF a second toast-worthy event occurs while one toast is visible THEN the system SHALL queue it and display it after the current toast dismisses, never overlapping two toasts.

---

## Requirement 4 — AR WildDex Camera (Tab 2)

**User Story:** As a park visitor, I want to "scan" animals with my camera and get a fun result card, so identifying wildlife feels rewarding.

### Acceptance Criteria
1. WHEN the Camera tab is opened AND the user grants camera permission THEN the system SHALL display a live camera feed within approximately one second.
2. IF the user denies camera permission OR `getUserMedia` is unavailable THEN the system SHALL display a friendly fallback message and show four demo species buttons (Bornean Orangutan, Two-Toed Sloth, Malayan Tapir, Clouded Leopard) as the only scan trigger.
3. WHEN the user captures a frame (or taps a demo species button) THEN the system SHALL show a scan animation for approximately one second before showing a result.
4. WHEN a scan resolves THEN the system SHALL display a Species Verified card containing photo, common name, scientific name, at least two fun facts, IUCN conservation status, and XP earned.
5. WHEN a scan resolves THEN the system SHALL award the species' defined XP to shared state, unlock the species in the WildDex, and show a confirmation toast.
6. WHEN a species is unlocked THEN the system SHALL persist a reference to the species ID only — THE system SHALL NOT persist raw captured camera frame data (base64 image bytes) into LocalStorage.
7. WHEN `settings.sound` is true AND a scan resolves successfully THEN the system SHALL play a short confirmation chime.
8. THE system SHALL implement the scan/analysis step behind an `AIAnalyzer` interface such that UI components do not know whether they are calling a demo or a future production (AWS-backed) implementation.

---

## Requirement 5 — Ranger Quests & Progression (Tab 3)

**User Story:** As a park visitor, I want clear goals and visible progress, so I feel motivated to keep exploring.

### Acceptance Criteria
1. WHEN the Quests tab is opened THEN the system SHALL display current rank, current XP, an animated progress bar toward the next rank, earned badges, and a list of missions.
2. THE system SHALL define exactly four ranks with fixed XP thresholds: Explorer (0–99), Junior Ranger (100–299), Senior Ranger (300–599), Master Ranger (600+).
3. WHEN the user's XP crosses a threshold in Requirement 5.2 THEN the system SHALL update the displayed rank and trigger a rank-up celebration animation.
4. WHEN a mission is completed THEN the system SHALL award its defined XP, display a badge if the mission grants one, and update shared state immediately.
5. THE system SHALL seed mission and species XP values such that completing every example mission and scanning every demo species crosses into Master Ranger in a single demo playthrough.

---

## Requirement 6 — Souvenir Journal (Tab 4)

**User Story:** As a park visitor, I want a shareable summary of my visit, so I have something memorable at the end.

### Acceptance Criteria
1. WHEN the user taps "Generate Daily Ranger Journal" THEN the system SHALL compile a journal entry from current shared state: visited exhibits, unlocked species, completed quests, earned XP, badges, and a conservation message.
2. THE system SHALL allow at most one journal entry per calendar day. WHEN the user regenerates the journal on the same day THEN the system SHALL overwrite that day's entry rather than creating a duplicate.
3. WHEN a previous day's entry exists AND a new entry is generated THEN the system SHALL leave the previous entry unmodified in the timeline.
4. THE system SHALL render the journal as a styled, postcard-like card including date, journey summary, species discovered, a timeline, achievements, and a personalized conservation message.

---

## Requirement 7 — Installability & Offline Behavior

**User Story:** As a park visitor, I want to install this as an app on my iPhone and keep using it without signal, so it feels native and reliable inside the park.

### Acceptance Criteria
1. WHEN the app is opened in Safari and has not previously been installed (per a LocalStorage flag) THEN the system SHALL show an iOS-style overlay explaining how to use the Share button to Add to Home Screen.
2. WHEN the user dismisses the install overlay THEN the system SHALL store that dismissal in LocalStorage and SHALL NOT show it again.
3. THE system SHALL configure a valid `manifest.json` and iOS-specific meta tags (`apple-mobile-web-app-capable`, `apple-mobile-web-app-status-bar-style`, `apple-mobile-web-app-title`, `theme-color`) and SHALL set `display: standalone`.
4. THE system SHALL register a service worker (via `vite-plugin-pwa`) that precaches the app shell, species data, quest data, and icons.
5. WHEN the network is disabled after first load THEN the system SHALL still load the app shell and all previously cached data and functionality (map, camera demo flow, quests, journal).
6. THE system SHALL use placeholder icon/splash assets where photorealistic art cannot be generated, clearly marked in code as placeholders pending final art.

---

## Requirement 8 — Accessibility

**User Story:** As a visitor with accessibility needs, I want the app usable without fine motor control, without full color vision, or with a screen reader, so I'm not excluded from the experience.

### Acceptance Criteria
1. WHEN `settings.reducedMotion` is true OR the OS-level `prefers-reduced-motion` is set THEN the system SHALL disable or substantially simplify non-essential animations.
2. THE system SHALL make all interactive elements reachable and operable via keyboard navigation.
3. THE system SHALL provide ARIA labels on interactive and status-bearing elements (toasts, progress bars, badges).
4. THE system SHALL maintain a minimum touch target size of 44×44 px for interactive elements.
5. THE system SHALL support high-contrast rendering of key status indicators (e.g. heat zones, XP bars).

---

## Requirement 9 — Verifiable Quality Bar

**User Story:** As the person reviewing this before a live demo, I want confidence claims backed by something actually run, not assumed.

### Acceptance Criteria
1. WHEN the project is built THEN `npm run build` SHALL complete with no errors.
2. WHEN typechecked THEN `tsc --noEmit` SHALL report zero errors.
3. WHEN used normally (navigating all tabs, running the camera demo flow, completing a quest, generating a journal) THEN the system SHALL produce no errors in the browser console.
4. IF a claim cannot be verified in the current environment (e.g. Lighthouse score, real iOS device install, real-device frame rate) THEN the system's documentation SHALL state it as "configured, untested" rather than asserting it as passing.
5. THE system SHALL NOT provision, call, or configure any real AWS resource at any point during development or demo.

---

## Assumptions Requiring Confirmation Before Build

These are known gaps the requirements above depend on. Kiro should ask/confirm rather than silently decide:

- Node.js/npm version available in the target environment.
- Whether this is a fresh repository or an existing one with files already present.
- Whether the agent has a way to actually launch a browser/dev server to click through Definition-of-Done checks, or only headless build/typecheck.
- Whether git is initialized and commits are expected per phase.
- Exact pinned versions for React, Vite, Tailwind, Framer Motion, `lucide-react`, and `vite-plugin-pwa` (see design.md for proposed pins — confirm before installing).
