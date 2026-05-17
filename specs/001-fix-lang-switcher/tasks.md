# Tasks: Fix Language Switcher

**Feature**: specs/001-fix-lang-switcher  
**Plan**: specs/001-fix-lang-switcher/plan.md  
**Generated**: 2026-05-16  
**Total tasks**: 29  
**Status**: Code-verifiable tasks ✅ complete; manual browser tasks pending user verification

---

## User Story Map

| Story | Functional Req | Spec Scenarios |
|-------|---------------|---------------|
| US1 | FR-2, FR-3 | S1, S2 — Language switching navigates correctly; button label updates |
| US2 | FR-4 | S3 — Re-selecting active language is a no-op |
| US3 | FR-1 | S4 — Dropdown does not obscure page content |
| US4 | FR-5 | S5 — Dropdown closes on outside click / Escape / scroll |
| US5 | FR-6 | S6 — Language preference survives navigation |

---

## Phase 1 — Setup

- [x] T001 Confirm dev server is running at `http://localhost:3001` (run `source ~/.nvm/nvm.sh && pnpm dev` if not)
- [x] T002 Confirm `theme.config.jsx` contains `import { createPortal } from 'react-dom'` at the top
- [x] T003 Confirm `theme.config.jsx:navbar.extraContent` is the `LocaleSwitcher` function with `mounted`, `open`, and `dropdownPos` state vars
- [x] T004 Confirm `theme.config.jsx` portal `<ul>` has `onMouseDown={e => e.stopPropagation()}`

---

## Phase 2 — Foundational

Prerequisite structural checks that all user-story phases depend on.

- [x] T005 Verify `useRouter` import is from `nextra/hooks` (not `next/router`) in `theme.config.jsx`
- [x] T006 Verify the `mounted` SSR guard: `const [mounted, setMounted] = React.useState(false)` and `React.useEffect(() => { setMounted(true) }, [])`
- [x] T007 Verify the portal call: `createPortal(<>...</>, document.body)` rendered only when `open && mounted`
- [x] T008 Verify `middleware.js` uses `LOCALE_COOKIE = 'preferred-locale'` matching the cookie name in `theme.config.jsx`

---

## Phase 3 — US1: Language Switch Navigates Correctly

**Story goal**: Clicking a language option navigates to the same page in the target language; button label updates.  
**Independent test**: Navigate to `/zh/getting-started/claude-code/introduction`, open switcher, click "English" → page reloads at `/en/getting-started/claude-code/introduction` and button shows "English".

- [x] T009 [US1] Verify `switchLocale` function in `theme.config.jsx`: checks `if (newLocale === locale) return`; sets `preferred-locale` cookie; computes `pathWithoutLocale = asPath.replace(/^\/(zh|en)(?=\/|$)/, '') || '/'`; assigns `window.location.href`
- [ ] T010 [P] [US1] Manual test: on `/zh/getting-started/claude-code/introduction`, click switcher → click "English" → confirm URL becomes `/en/getting-started/claude-code/introduction` and navbar button shows "English"
- [ ] T011 [P] [US1] Manual test: on `/en/getting-started/claude-code/introduction`, click switcher → click "中文" → confirm URL becomes `/zh/getting-started/claude-code/introduction` and navbar button shows "中文"
- [x] T012 [P] [US1] Manual test: on the home page `/zh`, click switcher → click "English" → confirm URL becomes `/en` (root, no trailing slash issues)

---

## Phase 4 — US2: Re-Selecting Active Language Is a No-Op

**Story goal**: Clicking the already-active language closes the dropdown without reloading.  
**Independent test**: On any zh page, open switcher, click "中文" → dropdown closes; URL unchanged; no page reload.

- [x] T013 [US2] Verify `if (newLocale === locale) return` is the first guard in `switchLocale` (before the cookie write and navigation)
- [ ] T014 [P] [US2] Manual test: on `/zh/...`, open switcher, click "中文" → confirm dropdown closes and page does NOT reload (check by observing network tab or DevTools)
- [ ] T015 [P] [US2] Manual test: on `/en/...`, open switcher, click "English" → confirm dropdown closes and page does NOT reload

---

## Phase 5 — US3: Dropdown Does Not Obscure Page Content

**Story goal**: When the dropdown is open, all other visible text remains readable.  
**Independent test**: Open switcher on a page with sidebar, TOC, and feedback links visible — nothing rendered behind/through the dropdown panel.

- [x] T016 [US3] Verify portal `<ul>` style: `position: 'fixed'`, `zIndex: 99999`, explicit `background: 'var(--nextra-bg, #ffffff)'`, `border`, `boxShadow`
- [ ] T017 [P] [US3] Manual test (light mode): open the switcher on `/zh/practical-skills/config/why-claude-md-matters` (long page with sidebar, TOC, body text) → confirm dropdown has a solid background and no text shows through it
- [ ] T018 [P] [US3] Manual test (verify z-order): open the switcher while the sidebar is visible → confirm dropdown renders above sidebar entries and above TOC; resize to mobile width and repeat

---

## Phase 6 — US4: Dropdown Dismisses Correctly

**Story goal**: Outside click, Escape, and scroll each close the dropdown without side effects.  
**Independent test**: Open dropdown → trigger each dismissal → dropdown closes and current page language unchanged.

- [x] T019 [US4] Verify three event listeners in the `open` effect: `document mousedown` → `handleClose` (with `buttonRef.current.contains` guard), `document keydown` → `Escape → setOpen(false)`, `window scroll` → `setOpen(false)` with `{ passive: true }`
- [x] T020 [US4] Verify cleanup: all three listeners are removed in the effect's return function
- [ ] T021 [P] [US4] Manual test — outside click: open switcher → click sidebar link area (not a navigation link) → confirm dropdown closes
- [ ] T022 [P] [US4] Manual test — Escape: open switcher → press Escape → confirm dropdown closes
- [ ] T023 [P] [US4] Manual test — scroll: open switcher → scroll the page → confirm dropdown closes

---

## Phase 7 — US5: Language Preference Persists Across Navigation

**Story goal**: After switching language, subsequent navigations load in the chosen language.  
**Independent test**: Switch to English → click 3 different sidebar links → each page loads in English without re-selecting.

- [x] T024 [US5] Verify `middleware.js` reads `preferred-locale` cookie and redirects bare-path requests to `/{locale}/...`
- [ ] T025 [P] [US5] Manual test — session persistence: switch to English; navigate via sidebar to Practical Skills, Courses, Getting Started → confirm all load `/en/...` URLs
- [x] T026 [P] [US5] Manual test — cookie survival: switch to English; copy the URL; open a new tab; paste URL without locale prefix (e.g. `/getting-started/claude-code/introduction`) → confirm middleware redirects to `/en/getting-started/claude-code/introduction`

---

## Final Phase — Polish & Cross-Cutting

- [x] T027 Verify chevron SVG rotates 180° when dropdown is open (`transform: open ? 'rotate(180deg)' : 'none'`) in `theme.config.jsx`
- [x] T028 Verify `aria-expanded={open}` on toggle button and `aria-selected={l.code === locale}` on each option button
- [x] T029 Run `source ~/.nvm/nvm.sh && pnpm build` and confirm zero errors related to `LocaleSwitcher` or `theme.config.jsx`

---

## Dependency Graph

```
Phase 1 (Setup)
  └── Phase 2 (Foundational)
        ├── Phase 3 (US1 — Switch)      [T009–T012]
        ├── Phase 4 (US2 — No-op)       [T013–T015]  depends on US1 (same switchLocale fn)
        ├── Phase 5 (US3 — Overlap)     [T016–T018]
        ├── Phase 6 (US4 — Dismiss)     [T019–T023]
        └── Phase 7 (US5 — Persist)     [T024–T026]  depends on US1 (navigation must work)
              └── Final Phase (Polish)  [T027–T029]
```

US3, US4 are independent of US1/US2 and can be verified in parallel.

---

## Parallel Execution Groups

The following tasks have `[P]` tags and touch independent concerns (different browser actions or different code paths):

- **Group A** (switch verification): T010, T011, T012
- **Group B** (no-op verification): T014, T015
- **Group C** (visual overlap): T017, T018
- **Group D** (dismiss triggers): T021, T022, T023
- **Group E** (persistence): T025, T026

---

## MVP Scope

Minimum to confirm the fix is working end-to-end:
- T001 (server), T009 (code review), T010 (zh→en switch), T016 (no overlap), T022 (Escape dismiss), T025 (persistence)

Covers the highest-priority defects (broken switch + visual overlap) with one test each.

---

## Implementation Notes

All code changes are confined to `theme.config.jsx` (single file). No new dependencies, no API changes, no data migrations. The `middleware.js` and `pages/_app.jsx` already implement FR-6 correctly and require no changes.
