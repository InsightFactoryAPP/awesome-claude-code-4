# Research: Fix Language Switcher

**Feature**: specs/001-fix-lang-switcher
**Date**: 2026-05-16

---

## Technical Context

### Stack
- **Next.js** 14.2.33 (Pages Router)
- **Nextra** 3.3.1 (docs theme)
- **React** 18 (concurrent mode, automatic batching)

### Routing Architecture

The site uses a **directory-based bilingual structure**: `pages/zh/` and `pages/en/` produce URLs at `/zh/...` and `/en/...` respectively. A custom `middleware.js` handles the root redirect.

| Component | Role |
|-----------|------|
| `middleware.js` | Intercepts requests with no locale prefix; reads `preferred-locale` cookie; redirects to `/{locale}/...` |
| `pages/_app.jsx` | On every route change, writes current locale from URL path into `preferred-locale` cookie |
| `theme.config.jsx` | Navbar `LocaleSwitcher` component; reads locale from Nextra router; sets cookie and navigates |
| `next.config.mjs` | Declares `i18n: { locales: ['zh','en'], defaultLocale: 'zh' }` |

**Cookie name**: `preferred-locale` (consistent across `middleware.js`, `_app.jsx`, and `LocaleSwitcher`).

**`useRouter` from `nextra/hooks`** overrides `locale` when `NEXTRA_DEFAULT_LOCALE` is set (which Nextra injects from `i18n.defaultLocale`):
```js
locale: router.asPath.split("/")[1]   // "zh" or "en"
```
So `locale` is always derived from the first URL segment, and `asPath` always includes the locale prefix (e.g. `/zh/getting-started/introduction`).

---

## Root Cause Analysis

### Bug 1 — Dropdown Overlaps Content (FR-1)

**Decision**: Render the dropdown via `createPortal` into `document.body`.  
**Rationale**: Nextra's navbar has `position: sticky; z-index: 20`, creating a CSS stacking context. Any `position: absolute` child is confined within that context regardless of its own `z-index`. Portaling to `document.body` escapes the navbar's stacking context; `position: fixed` + `z-index: 99999` then guarantees the dropdown floats above all other content.  
**Alternatives considered**:
- Setting `isolation: isolate` or `overflow: visible` on the navbar — not safe since Nextra internals own those styles.
- Using a very high `z-index` without a portal — fails because stacking context boundaries trump z-index values.

### Bug 2 — Language Switch Non-Functional After Portal Fix (FR-2)

**Decision**: Add `onMouseDown={e => e.stopPropagation()}` to the portal dropdown `<ul>`.  
**Rationale**: DOM event order is `mousedown → mouseup → click`. The `document`-level `mousedown` listener calls `setOpen(false)`. React 18 flushes state updates synchronously during user-initiated events; the portal `<ul>` is therefore unmounted from the DOM before the `click` event fires, preventing the language option's `onClick` handler (`switchLocale`) from executing. `stopPropagation` on the portal's `mousedown` prevents `handleClose` from running, so the click fires normally.  
**Alternatives considered**:
- Switching the document listener from `mousedown` to `click` with `stopPropagation` on option buttons — workable but requires coordinating two separate stop-propagation sites.
- Using `pointer-events` CSS toggling — fragile, breaks keyboard focus.
- Using a `setTimeout` to delay `setOpen(false)` — works but adds timing dependency; stop-propagation is semantically correct.

**Why `createPortal` broke a previously-working button**: The original pre-portal implementation rendered the dropdown inside the navbar's DOM. `buttonRef.current.contains(e.target)` returned `true` for option buttons (they were DOM descendants of the ref). After portaling, the options are in `document.body`, so `contains()` returns `false` and `handleClose` fires on every click inside the dropdown.

### Preference Persistence (FR-6)

No code changes needed. `middleware.js` already reads `preferred-locale` and redirects bare paths to the stored locale. `_app.jsx` keeps the cookie updated on every navigation.

---

## Decision Summary

| # | Decision | Rationale |
|---|----------|-----------|
| D-1 | `createPortal` to `document.body` with `position:fixed` | Escapes navbar stacking context |
| D-2 | `z-index: 99999` on portal dropdown | Floats above all Nextra chrome |
| D-3 | `onMouseDown={e => e.stopPropagation()}` on portal `<ul>` | Prevents `handleClose` from unmounting dropdown before click fires |
| D-4 | `preferred-locale` cookie set before navigation | Consistent with `middleware.js` cookie name; ensures redirect targets correct locale on next rootless visit |
| D-5 | Keep `mounted` guard for `createPortal` | Prevents `document.body` access during SSR |
