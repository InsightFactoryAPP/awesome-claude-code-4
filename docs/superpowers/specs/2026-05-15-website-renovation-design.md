# Website Renovation Design

**Date:** 2026-05-15  
**Approach:** Plan A — Progressive refactoring

---

## Overview

Eight changes to the Claude Code Academy website, executed in order of risk (lowest first):

1. Content cleanup (personal info, dead endpoints, old GitHub links)
2. WeChat → Discord replacement
3. Closeable top banner (re-shows every 2 days)
4. i18n support (Chinese default + English)

---

## Phase 1: Content Cleanup

### 1a. Delete `pages/community/contributing.mdx`
Delete the entire file. Remove its entry from `pages/community/_meta.js`.

### 1b. Remove personal info and old GitHub links

| File | Action |
|------|--------|
| `pages/index.mdx` | Remove "快速链接" section (GitHub repo, issues, discussions links) |
| `pages/getting-started/faq/index.mdx` | Remove GitHub Discussions link; replace with Discord link |
| `pages/examples/index.mdx` | Remove GitHub discussions href |
| `pages/getting-started/common-errors/index.mdx` | Remove GitHub Issues link; replace with Discord link |
| `theme.config.jsx` | Remove `project.link`, `docsRepositoryBase`, GitHub link in banner, GitHub link in footer |
| `package.json` | Remove `repository.url` field |
| `pages/_app.jsx` | Remove the `<Script>` block for `webot.ai-code.club` (WeChat customer service widget) |

### 1c. Remove sz.ai-code.club references

| File | Action |
|------|--------|
| `pages/getting-started/clawdbot-installation.mdx` | Delete "深圳节点" table row |
| `pages/getting-started/opencode-installation.mdx` | Delete both "深圳节点" table rows |
| `pages/getting-started/faq/slow-response.mdx` | Delete all sz.ai-code.club ping/curl commands, table row, and explanatory text |
| `pages/getting-started/faq/network-diagnosis.mdx` | Delete all sz.ai-code.club references: table row, ping/curl/PowerShell commands, bash export example |
| `CLAUDE.md` | Delete "深圳节点" table row |

---

## Phase 2: Discord Integration

### 2a. Copy Discord QR code
Copy `~/Downloads/claude-code-discrod-qr-code.svg` → `public/images/discord-group-qrcode.svg`

### 2b. Create Discord SVG icon
Create `public/icons/discord.svg` with the official Discord brand icon path.

### 2c. Update `components/FloatingWidget.jsx`
- Replace WeChat SVG path with `<img src="/icons/discord.svg">` 
- Button title: `加入微信社群` → `加入 Discord 社群`
- Button label: `加入社群` → `Discord 社群`
- Modal title: `扫码加入微信社群` → `扫码或点击加入 Discord`
- QR code src: `/images/cc-club-group-qrcode.png` → `/images/discord-group-qrcode.svg`
- QR code alt: `微信群二维码` → `Discord 群二维码`
- Description: `与 3000+ 名 Vibe Coding 先行者一起进步` → `加入我们，与全球开发者一起进步`
- Add a direct link button below QR code: `https://discord.gg/TaeaUp3cYv`

### 2d. Update MDX files with WeChat QR codes
- `pages/getting-started/get-api-key.mdx` (2 occurrences): replace image src, alt text, and surrounding copy

### 2e. Delete old QR code images
- `public/wecom-group-qrcode.png`
- `public/images/cc-club-group-qrcode.png`

---

## Phase 3: Top Banner

### Banner behavior
- Shown at top of every page
- User can close it; dismissal timestamp saved to `localStorage` under key `cc-banner-dismissed-at`
- Re-shows after 48 hours (2 × 24 × 60 × 60 × 1000 ms)

### Implementation
Use Nextra's built-in `banner` config in `theme.config.jsx`. The `banner.text` renders a React component that:
1. On mount, reads `localStorage` to decide whether to render
2. Renders a warning message with a close (×) button
3. On close, writes `Date.now()` to `localStorage`

The `banner.key` must change whenever the message changes (controls Nextra's own dismiss cookie — we override with our own logic but still set a stable key).

**Banner text:**
- Chinese: `⚠️ CC Club 的大模型 API 服务不向中国境内用户开放`
- English: `⚠️ CC Club's LLM API service is not available to users in mainland China`  
  (shown based on active locale)

---

## Phase 4: i18n (Chinese + English)

### Strategy
- Use Nextra's built-in i18n support (Next.js `i18n` routing)
- Default locale: `zh`; second locale: `en`
- URL scheme: Chinese at `/`, English at `/en/`
- Language switcher: Nextra renders it automatically in the navbar via `theme.config.jsx`'s `i18n` array
- MDX files: rename all `*.mdx` → `*.zh.mdx`; rename all `_meta.js` → `_meta.zh.js`; create `_meta.en.js` mirrors
- English content: full translation for `index.en.mdx`; all other pages get a placeholder `.en.mdx`:
  ```mdx
  # [Page Title]
  > 🚧 English translation coming soon.
  ```

### Config changes

**`next.config.mjs`** — add:
```js
i18n: {
  locales: ['zh', 'en'],
  defaultLocale: 'zh'
}
```

**`theme.config.jsx`** — add:
```js
i18n: [
  { locale: 'zh', name: '中文' },
  { locale: 'en', name: 'English' }
]
```

Also update all hardcoded Chinese strings in `theme.config.jsx` (banner text, footer, editLink, feedback, toc title, search placeholder, gitTimestamp) to switch based on `useRouter().locale`.

### File rename scope
- 78 `.mdx` files → renamed to `.zh.mdx`
- ~10 `_meta.js` files → renamed to `_meta.zh.js`
- ~10 new `_meta.en.js` files created
- 1 full English translation: `pages/index.en.mdx`
- 77 English placeholder files created

---

## Files touched summary

| Category | Files |
|----------|-------|
| Deleted | `pages/community/contributing.mdx`, `public/wecom-group-qrcode.png`, `public/images/cc-club-group-qrcode.png` |
| New | `public/images/discord-group-qrcode.svg`, `public/icons/discord.svg`, `pages/index.en.mdx`, ~77 placeholder `.en.mdx` files, ~10 `_meta.en.js` files |
| Modified | `theme.config.jsx`, `package.json`, `pages/_app.jsx`, `pages/_meta.js`, `CLAUDE.md`, `next.config.mjs`, `components/FloatingWidget.jsx`, `pages/index.mdx`, `pages/getting-started/get-api-key.mdx`, `pages/getting-started/faq/index.mdx`, `pages/examples/index.mdx`, `pages/getting-started/common-errors/index.mdx`, `pages/getting-started/clawdbot-installation.mdx`, `pages/getting-started/opencode-installation.mdx`, `pages/getting-started/faq/slow-response.mdx`, `pages/getting-started/faq/network-diagnosis.mdx` |
| Renamed | All 78 `.mdx` → `.zh.mdx`, all `_meta.js` → `_meta.zh.js` |
