# Implementation Plan: Fix Language Switcher

**Spec**: specs/001-fix-lang-switcher/spec.md  
**Branch**: feat/zh-restructure-and-en-translation  
**Date**: 2026-05-16  
**Status**: Implementation complete — verification pending

---

## Summary

Two defects in `theme.config.jsx` `LocaleSwitcher` component:
1. Dropdown rendered inside Nextra navbar's CSS stacking context → overlapped page content.
2. `document mousedown` listener unmounted the portal dropdown via React 18 synchronous flushing before the option button's `click` event fired → `switchLocale` never executed.

Both fixes are applied to a single file.

---

## Changes

### File: `theme.config.jsx`

#### Change 1 — `createPortal` import
```diff
+import { createPortal } from 'react-dom'
```
**Purpose**: Render the dropdown outside the navbar's stacking context.

#### Change 2 — `LocaleSwitcher` component rewrite (`navbar.extraContent`)

Key additions vs the original implementation:

| Addition | Addresses |
|----------|-----------|
| `mounted` state + `useEffect(() => setMounted(true), [])` | SSR guard: `document.body` unavailable server-side |
| `dropdownPos` state computed with `getBoundingClientRect()` | Viewport-relative anchor for `position:fixed` dropdown |
| `createPortal(..., document.body)` | Escapes navbar stacking context (FR-1) |
| `position: fixed; z-index: 99999` on portal `<ul>` | Floats above all Nextra chrome (FR-1) |
| `onMouseDown={e => e.stopPropagation()}` on portal `<ul>` | Prevents `handleClose` racing React flush (FR-2) |
| `window scroll` → `setOpen(false)` | Closes drifting fixed dropdown on scroll (FR-5) |
| `window.location.href = /${newLocale}${path}` | Hard-navigates to target locale (FR-2) |
| `preferred-locale` cookie before navigation | Middleware reads this on rootless visits (FR-6) |
| `if (newLocale === locale) return` | No-op re-selection (FR-4) |
| `aria-selected`, `role="option"`, `role="listbox"` | Accessibility |
| `chevron rotate(180deg)` when open | Visual affordance |

No other files changed.

---

## Verification Checklist

Work through each scenario in `spec.md` manually in the browser at `http://localhost:3001`.

| Scenario | Steps | Expected |
|----------|-------|----------|
| SC-1: zh→en | On `/zh/...`, click switcher, click "English" | Page reloads at `/en/...`; button shows "English" |
| SC-1: en→zh | On `/en/...`, click switcher, click "中文" | Page reloads at `/zh/...`; button shows "中文" |
| SC-2: no-op | On `/zh/...`, click "中文" | Dropdown closes; no reload |
| SC-3: no overlap | Open dropdown | No page text visible through dropdown |
| SC-4: Escape | Open dropdown, press Escape | Dropdown closes |
| SC-4: outside click | Open dropdown, click sidebar | Dropdown closes |
| SC-4: scroll | Open dropdown, scroll page | Dropdown closes |
| SC-5: persistence | Switch to English; navigate to 3 other pages | All load in English |

---

## Requirements Coverage

| FR | Description | Status |
|----|-------------|--------|
| FR-1 | Non-overlapping dropdown | ✅ `createPortal` + `position:fixed` + `z-index:99999` |
| FR-2 | Correct navigation on selection | ✅ `window.location.href`; unblocked by `stopPropagation` |
| FR-3 | Active locale on button | ✅ `current.label` derived from `locale` |
| FR-4 | No-op on re-selection | ✅ `if (newLocale === locale) return` |
| FR-5 | Dismiss on outside click / Escape / scroll | ✅ Three document/window event listeners |
| FR-6 | Language preference persisted | ✅ `preferred-locale` cookie + `middleware.js` redirect |

---

## Architecture Notes

- `useRouter` from `nextra/hooks` derives `locale` from `asPath.split("/")[1]` (not from Next.js i18n `router.locale`), so `locale` always equals the first URL path segment.
- `asPath` always includes the locale prefix (e.g. `/zh/getting-started/introduction`), making the `replace(/^\/(zh|en)(?=\/|$)/, '')` strip reliable.
- `middleware.js` uses `preferred-locale` (matching our cookie name), so persistence is correct without any middleware changes.
- `pages/_app.jsx` also syncs the cookie on navigation, providing a second layer of cookie maintenance.
