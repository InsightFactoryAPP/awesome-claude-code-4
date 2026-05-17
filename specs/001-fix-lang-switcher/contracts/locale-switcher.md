# Contract: LocaleSwitcher Component Interface

**Feature**: specs/001-fix-lang-switcher
**Date**: 2026-05-16

---

## Component Signature

```jsx
// Rendered as navbar.extraContent in theme.config.jsx
function LocaleSwitcher(): JSX.Element
```

No props — reads locale and routing state from `useRouter()` (Nextra context).

---

## DOM Contract

### Toggle Button
```
role="button"
aria-haspopup="listbox"
aria-expanded={open}
title="Switch language"
```
- Renders a globe SVG + current locale label + chevron SVG.
- `ref` attached for `getBoundingClientRect()` on open.

### Dropdown (portal, rendered in `document.body` when `open && mounted`)
```
role="listbox"
aria-label="Select language"
position: fixed  (viewport-relative, anchored below toggle button)
z-index: 99999
onMouseDown: stopPropagation  (prevents handleClose racing with onClick)
```

### Option Buttons
```
role="option"
aria-selected={locale === option.code}
onClick → switchLocale(option.code)
```

---

## Routing Contract

### `switchLocale(newLocale: string): void`

| Condition | Behaviour |
|-----------|-----------|
| `newLocale === locale` | Close dropdown; no navigation, no cookie write |
| `newLocale !== locale` | Close dropdown; write `preferred-locale` cookie; navigate to `/${newLocale}${pathWithoutLocale}` |

**Cookie written**: `preferred-locale=<newLocale>; path=/; max-age=31536000; SameSite=Lax`  
**Navigation**: `window.location.href` (hard reload, triggers middleware for future rootless navigations)

### URL Construction
```
pathWithoutLocale = asPath.replace(/^\/(zh|en)(?=\/|$)/, '') || '/'
targetUrl = `/${newLocale}` + (pathWithoutLocale === '/' ? '' : pathWithoutLocale)
```

---

## Dismissal Contract

| Trigger | Handler | Effect |
|---------|---------|--------|
| `mousedown` outside dropdown and toggle button | `document mousedown` listener | `setOpen(false)` |
| `Escape` key | `document keydown` listener | `setOpen(false)` |
| Page scroll | `window scroll` listener (passive) | `setOpen(false)` |
| Click on toggle button while open | `handleToggle` | `setOpen(false)` |
| Click on a locale option | `switchLocale` | `setOpen(false)` + navigate (if different locale) |

All document/window listeners are registered only when `open === true` and cleaned up on close.

---

## Upstream / Downstream

| Direction | Component | Interaction |
|-----------|-----------|-------------|
| Reads from | `nextra/hooks#useRouter` | `locale`, `asPath` |
| Writes to | `document.cookie` | `preferred-locale` persistence |
| Writes to | `window.location.href` | Hard navigation to locale URL |
| Reads by | `middleware.js` | `preferred-locale` cookie used for rootless redirects |
| Reads by | `pages/_app.jsx` | Syncs cookie after each navigation via `router.asPath` |
