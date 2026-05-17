# Data Model: LocaleSwitcher Component

**Feature**: specs/001-fix-lang-switcher
**Date**: 2026-05-16

---

## Component State

```
LocaleSwitcher
├── open: boolean          — dropdown is visible
├── dropdownPos: { top: number, right: number }   — fixed-position anchor (px from viewport)
└── mounted: boolean       — true after first client render (SSR guard for createPortal)
```

### State Transitions

```
Initial:  open=false, dropdownPos={0,0}, mounted=false

useEffect []              → mounted=true

handleToggle()            → open=true, dropdownPos=computed from button rect
handleToggle() (again)    → open=false
mousedown outside         → open=false  (via handleClose)
Escape key                → open=false  (via handleKey)
scroll                    → open=false  (via handleScroll)
switchLocale(same)        → open=false, no navigation
switchLocale(different)   → open=false, cookie set, page navigates
```

---

## Derived Values

| Name | Source | Description |
|------|--------|-------------|
| `locale` | `useRouter().locale` (= `asPath.split("/")[1]`) | Current active locale code |
| `asPath` | `useRouter().asPath` | Full path including locale prefix |
| `current` | `LOCALES.find(l => l.code === locale)` | Active locale display label |
| `pathWithoutLocale` | `asPath.replace(/^\/(zh|en)(?=\/|$)/, '')` | Path segment used when constructing target URL |

---

## Constants

```js
LOCALES = [
  { code: 'zh', label: '中文' },
  { code: 'en', label: 'English' }
]
COOKIE_NAME = 'preferred-locale'
ONE_YEAR = 60 * 60 * 24 * 365   // max-age seconds
```

---

## External Dependencies

| Dependency | Version | Usage |
|------------|---------|-------|
| `nextra/hooks#useRouter` | 3.3.1 | Provides `locale` (derived from asPath) and `asPath` |
| `react#createPortal` | 18 | Mounts dropdown into `document.body` |
| `document.body` | browser | Portal target; guarded by `mounted` flag |
| `window.location.href` | browser | Hard-navigates to target locale URL |
| `document.cookie` | browser | Persists `preferred-locale` |
