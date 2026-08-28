# Implementation Plan — Mandai WildDex & Ranger Expeditions

## How to work through this plan

- Execute phases **in order**. Do not start a phase until the previous phase's checklist is fully checked and verified.
- **Stop after each phase** and report: what was built, which checklist items were verified (and how — build output, manual click-through, etc.), and any assumption made. Wait for confirmation before starting the next phase.
- After each phase's checklist passes, commit to git with a message naming the phase (e.g. `feat: phase 2 - map tab crowd simulation`). If git isn't initialized, initialize it in Phase 0 first.
- If a task appears to require real AWS access, real device testing, or any capability not available in this environment, stop and flag it explicitly rather than skipping it silently or faking a result.
- Confirm the "Assumptions Requiring Confirmation" list at the bottom of `requirements.md` before starting Phase 0.

---

## Phase 0 — Environment Confirmation

- [ ] 0.1 Confirm Node.js/npm version available; note any incompatibility with pinned versions in `design.md` §1.
- [ ] 0.2 Confirm whether this is a fresh directory or existing repo; if existing, inspect before scaffolding over it.
- [ ] 0.3 Confirm whether a browser/dev-server preview is available for manual verification, or only headless build/typecheck.
- [ ] 0.4 Initialize git if not already present.
- [ ] 0.5 Explicitly confirm no AWS credentials will be used/invoked during this build, regardless of what's available in the environment.

_Requirements: 9.5. Design: §1._

---

## Phase 1 — Scaffold & App Shell

- [ ] 1.1 Scaffold Vite + React + TypeScript project with pinned dependency versions from `design.md` §1.
- [ ] 1.2 Configure Tailwind (v3.x config format) with the color palette and 24px corner-radius conventions from `design.md` §10.
- [ ] 1.3 Create the folder structure exactly as specified in `design.md` §4.
- [ ] 1.4 Implement `types/index.ts` with `UserState`, `JournalEntry`, `SessionEvent`, `SpeciesResult`, `RankName`, and `SCHEMA_VERSION`.
- [ ] 1.5 Implement `services/storage.ts` (`get`/`set`/`subscribe`, safe JSON parsing) per `design.md` §3.3.
- [ ] 1.6 Implement `context/AppStateContext.tsx` + `appStateReducer.ts` + `hooks/useAppState.ts` per `design.md` §3.1–3.2, including `getRankForXP`.
- [ ] 1.7 Implement `loadInitialState()` with schema-version/corruption fallback to `DEFAULT_USER_STATE`.
- [ ] 1.8 Implement `components/ErrorBoundary.tsx` with the "Something went off the trail" fallback and a reset action, wrapped around the whole app in `App.tsx`.
- [ ] 1.9 Implement `BottomNavigation.tsx` and four empty placeholder tab screens, wired to local tab-switch state (no router).
- [ ] 1.10 Implement base reusable components: `GlassCard`, `JungleButton`, `Toast` (with FIFO queue per `design.md` §3.4), `ProgressBar`, `XPBadge`, `AnimatedCounter`.

**Phase 1 Definition of Done** (Requirements 1.1–1.5, 2.1–2.3):
- [ ] App builds (`npm run build`) and typechecks (`tsc --noEmit`) with zero errors.
- [ ] Tapping all four bottom nav items switches screens with no console errors.
- [ ] Reloading the page preserves default/empty `UserState`.
- [ ] Manually corrupting the LocalStorage `userState` value and reloading falls back to defaults instead of crashing.
- [ ] Throwing a deliberate test error inside a tab renders the ErrorBoundary fallback, not a blank screen.
- [ ] No file outside `services/storage.ts` and `context/AppStateContext.tsx` calls `localStorage` directly (grep check).

---

## Phase 2 — Map Tab

- [ ] 2.1 Seed `data/map.ts` with the three habitat nodes (Orangutan, Fragile Forest, Night Trail) and coordinates.
- [ ] 2.2 Implement `Map/ParkMap.tsx` rendering the SVG map and tappable nodes.
- [ ] 2.3 Implement pan via drag and zoom via +/- buttons and native pinch touch events on the SVG viewBox (`design.md` §4, no external gesture library).
- [ ] 2.4 Implement `Map/CrowdOverlay.tsx` and `Map/AnimatedPath.tsx` using Framer Motion (transform/opacity only, per `design.md` §8).
- [ ] 2.5 Implement "Simulate Peak Traffic" button and its full flow per `design.md` §5.2: node turns red, toast enqueued, path animates, destination pulses, "Double XP" quest dispatched into shared state.
- [ ] 2.6 Wire `useReducedMotion()` into all Map animations.

**Phase 2 Definition of Done** (Requirements 3.1–3.7):
- [ ] All three habitat nodes render and are tappable.
- [ ] "Simulate Peak Traffic" turns Orangutan red within ~1s, shows the exact specified toast text, animates the path, and pulses the destination.
- [ ] The unlocked "Double XP" quest appears on the Quests tab immediately after triggering (cross-tab state confirmed — even though Quests tab UI isn't fully built yet, confirm via dev tools/state inspection).
- [ ] Pan/zoom works via touch and buttons without visibly dropping frames (throttled DevTools check if no real device available).
- [ ] Triggering two toast-worthy events in quick succession shows them one at a time, never overlapping.
- [ ] Build and typecheck remain clean.

---

## Phase 3 — Camera Tab

- [ ] 3.1 Seed `data/species.ts` with real, finalized content for all four demo species (common name, scientific name, 2–3 fun facts, IUCN status, `xpAwarded`, `photoUrl` placeholder) — no invented content later.
- [ ] 3.2 Implement `services/aiDemo.ts` (`DemoAIAnalyzer implements AIAnalyzer`) per `design.md` §6 — lookup by ID, ~1000ms simulated delay, no real image classification.
- [ ] 3.3 Implement `hooks/useCamera.ts` with the permission state machine (`idle → requesting → granted/denied/unsupported`) per `design.md` §5.1 and §9.
- [ ] 3.4 Implement `Camera/CameraHUD.tsx`, `Camera/ScannerAnimation.tsx` (scanner reticle, corner brackets, pulse).
- [ ] 3.5 Implement `Camera/CameraPermissionFallback.tsx` shown on denial/unsupported, exposing only the four demo buttons.
- [ ] 3.6 Implement `Camera/SpeciesResultCard.tsx` displaying photo, scientific name, fun facts, conservation status, XP earned.
- [ ] 3.7 Wire the full scan flow (real capture or demo button) to dispatch `SPECIES_UNLOCKED`, updating XP/rank/WildDex and enqueuing a toast.
- [ ] 3.8 Implement `services/sound.ts` with a scan-success chime and XP-gain tick, gated on `settings.sound`.
- [ ] 3.9 Confirm no raw base64 camera frame is ever written to `UserState` — local component state only, discarded on navigation away.

**Phase 3 Definition of Done** (Requirements 4.1–4.8):
- [ ] Granting camera permission shows a live feed within ~1s.
- [ ] Denying permission (or simulating unsupported) shows the fallback message + four demo buttons, no broken UI.
- [ ] All four demo buttons complete capture/tap → scan animation → result card → XP awarded → WildDex updated → toast.
- [ ] Reloading the page after unlocking a species preserves the unlock.
- [ ] LocalStorage size after several scans stays well under the ~5MB budget (no image bytes stored).
- [ ] Sound cues fire only when `settings.sound` is true.
- [ ] Build and typecheck remain clean.

---

## Phase 4 — Quests Tab

- [ ] 4.1 Seed `data/quests.ts` with example missions (Keeper-in-Training, Primate Tool Explorer, Night Trail Explorer, Conservation Champion) plus their XP values and any badge grants, calibrated so a full playthrough (all species + all quests) crosses into Master Ranger.
- [ ] 4.2 Implement `getRankForXP` (if not already in `data/quests.ts` from Phase 1) using the fixed thresholds table in `design.md` §3.2.
- [ ] 4.3 Implement `Quests/QuestCard.tsx` and `Quests/BadgeCard.tsx`.
- [ ] 4.4 Build the Quests tab screen: rank display, XP bar, badges, mission list (including any quest unlocked dynamically from the Map tab).
- [ ] 4.5 Implement mission completion flow: dispatch XP award, badge grant if applicable, rank recompute, rank-up celebration animation if the threshold is crossed.

**Phase 4 Definition of Done** (Requirements 5.1–5.5):
- [ ] XP bar and rank label update immediately from any XP source (camera scan or quest completion).
- [ ] Completing a quest awards correct XP, grants a badge where defined, and can trigger a rank-up with celebration animation.
- [ ] Rank thresholds exactly match the table in `design.md` §3.2 — verify with a manual XP-boundary test (e.g. force XP to 99 vs 100).
- [ ] The "Double XP" quest unlocked from the Map tab (Phase 2) appears and is completable here.
- [ ] Build and typecheck remain clean.

---

## Phase 5 — Journal Tab

- [ ] 5.1 Implement journal-entry construction from current shared state (species, quests, badges, XP, a conservation message).
- [ ] 5.2 Implement the "Generate Daily Ranger Journal" button and its dispatch, replacing-if-exists-for-today per `design.md` §5.3.
- [ ] 5.3 Implement `Journal/JournalCard.tsx` (postcard styling) and `Journal/Timeline.tsx`.
- [ ] 5.4 Build the Journal tab screen combining the above with the timeline of past entries.

**Phase 5 Definition of Done** (Requirements 6.1–6.4):
- [ ] Generating a journal accurately reflects current XP, species, quests, and badges.
- [ ] Regenerating on the same day overwrites today's entry (verify by checking `journalEntries` length stays the same, content updates).
- [ ] Simulating a stored entry from a prior date and generating today's leaves the prior entry untouched.
- [ ] Build and typecheck remain clean.

---

## Phase 6 — PWA, Install Flow, Accessibility, Polish

- [ ] 6.1 Configure `vite-plugin-pwa` (`generateSW`) per `design.md` §7; set iOS meta tags and `manifest.json`.
- [ ] 6.2 Create placeholder icons/splash assets, clearly commented as placeholders.
- [ ] 6.3 Implement `Onboarding/InstallPromptOverlay.tsx` gated on `state.hasSeenInstallPrompt`, dismissible and persisted.
- [ ] 6.4 Implement `useReducedMotion()` hook (combining `settings.reducedMotion` + OS media query) and confirm it's consumed by every Framer Motion animation across all tabs.
- [ ] 6.5 Add ARIA labels to interactive/status elements (toasts, progress bars, badges) and confirm keyboard reachability of every interactive control.
- [ ] 6.6 Confirm 44×44px minimum touch targets across all tappable elements.
- [ ] 6.7 Full accessibility and offline pass: disable network in dev tools and confirm app shell + cached data still function.

**Phase 6 Definition of Done** (Requirements 7.1–7.6, 8.1–8.5, 9.1–9.4):
- [ ] Manifest + service worker registered and visible in browser dev tools.
- [ ] Reloading with network disabled still loads the shell and all four tabs' functionality (camera demo flow, quests, journal).
- [ ] Reduced-motion setting visibly shortens/removes animations app-wide.
- [ ] Keyboard navigation reaches every interactive element across all four tabs.
- [ ] Install overlay shows once, never again after dismissal (verify via LocalStorage flag).
- [ ] `npm run build` and `tsc --noEmit` both clean; browser console clean during a full manual click-through of all four tabs.
- [ ] Any claim that can't be verified in this environment (Lighthouse score, real iOS device install/standalone rendering, real-device frame rate) is explicitly documented as "configured, untested" rather than asserted as passing.

---

## Final Wrap-Up

- [ ] Re-read `requirements.md` top to bottom and confirm every acceptance criterion maps to a completed, verified item above.
- [ ] Confirm no real AWS resource was provisioned or called at any point (Requirement 9.5).
- [ ] Final commit and summary of what was built, what was verified how, and what remains untested due to environment limitations.
