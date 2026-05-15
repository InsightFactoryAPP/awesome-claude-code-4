# Website Renovation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Renovate Claude Code Academy website: clean up personal info/dead links, replace WeChat with Discord, add a closeable banner, and add Chinese/English i18n.

**Architecture:** Four sequential phases — content cleanup first (lowest risk), then Discord integration, then banner component, then i18n file restructuring last (highest blast radius). Each phase is independently committable.

**Tech Stack:** Next.js 14, Nextra 3, React 18, pnpm

---

## Task 1: Delete contributing.mdx and clean community _meta

**Files:**
- Delete: `pages/community/contributing.mdx`
- Modify: `pages/community/_meta.js`

- [ ] **Step 1: Delete the file**
```bash
rm pages/community/contributing.mdx
```

- [ ] **Step 2: Edit `pages/community/_meta.js`**
Replace contents with:
```js
export default {
  showcase: '案例展示',
  faq: '常见问题'
}
```

- [ ] **Step 3: Verify build**
```bash
pnpm build 2>&1 | tail -5
```
Expected: no errors about missing contributing page.

- [ ] **Step 4: Commit**
```bash
git rm pages/community/contributing.mdx
git add pages/community/_meta.js
git commit -m "remove: delete contributing page"
```

---

## Task 2: Remove personal info and old GitHub links from content

**Files:**
- Modify: `pages/index.mdx`
- Modify: `pages/getting-started/faq/index.mdx`
- Modify: `pages/examples/index.mdx`
- Modify: `pages/getting-started/common-errors/index.mdx`

- [ ] **Step 1: Edit `pages/index.mdx`**

Remove the "参与贡献" section's link to contributing page (change `[了解如何贡献](/community/contributing) →` to just remove that line). Remove the entire "🔗 快速链接" section (lines containing GitHub repo, issues, discussions links).

- [ ] **Step 2: Edit `pages/getting-started/faq/index.mdx`**

Replace the GitHub Discussions reference with:
```mdx
更多问题请访问 [Discord 社区](https://discord.gg/VCdTwvYBJd) 进行讨论。
```

- [ ] **Step 3: Edit `pages/examples/index.mdx`**

Find `href="https://github.com/zjh1943/awesome-claude-code/discussions"` and replace with `href="https://discord.gg/VCdTwvYBJd"`.

- [ ] **Step 4: Edit `pages/getting-started/common-errors/index.mdx`**

Replace:
```mdx
- 访问 [GitHub Issues](https://github.com/zjh1943/awesome-claude-code/issues) 搜索或提交问题
- 加入社区讨论寻求帮助
```
with:
```mdx
- 加入 [Discord 社区](https://discord.gg/VCdTwvYBJd) 寻求帮助
```

- [ ] **Step 5: Commit**
```bash
git add pages/index.mdx pages/getting-started/faq/index.mdx pages/examples/index.mdx pages/getting-started/common-errors/index.mdx
git commit -m "remove: strip personal GitHub links, replace with Discord"
```

---

## Task 3: Clean theme.config.jsx, package.json, _app.jsx

**Files:**
- Modify: `theme.config.jsx`
- Modify: `package.json`
- Modify: `pages/_app.jsx`

- [ ] **Step 1: Edit `theme.config.jsx`**

Remove `project` key entirely. Remove `docsRepositoryBase` key entirely. Replace `banner` with:
```jsx
banner: {
  key: 'welcome',
  text: '🎉 欢迎来到 Claude Code Academy！这是一个开源协作项目，欢迎贡献'
},
```

Replace `footer` with:
```jsx
footer: {
  text: (
    <>
      MIT {new Date().getFullYear()} © Claude Code Academy
      {' · '}
      Built with ❤️ by the community
    </>
  )
},
```

Remove `editLink` and `feedback` blocks entirely.

- [ ] **Step 2: Edit `package.json`**

Remove the entire `"repository"` field.

- [ ] **Step 3: Edit `pages/_app.jsx`**

Remove the `Script` import and the `<Script>` block for `webot.ai-code.club`. Final content:
```jsx
import { Analytics } from '@vercel/analytics/react'
import FloatingWidget from '../components/FloatingWidget'
import '../styles/global.css'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <FloatingWidget />
      <Analytics />
    </>
  )
}
```

- [ ] **Step 4: Commit**
```bash
git add theme.config.jsx package.json pages/_app.jsx
git commit -m "remove: strip GitHub links and WeChat widget from config"
```

---

## Task 4: Remove sz.ai-code.club references

**Files:**
- Modify: `pages/getting-started/clawdbot-installation.mdx`
- Modify: `pages/getting-started/opencode-installation.mdx`
- Modify: `pages/getting-started/faq/slow-response.mdx`
- Modify: `pages/getting-started/faq/network-diagnosis.mdx`
- Modify: `CLAUDE.md`

- [ ] **Step 1: Edit `pages/getting-started/clawdbot-installation.mdx`**

Delete the table row containing `sz.ai-code.club`.

- [ ] **Step 2: Edit `pages/getting-started/opencode-installation.mdx`**

Delete both table rows containing `sz.ai-code.club`.

- [ ] **Step 3: Edit `pages/getting-started/faq/slow-response.mdx`**

Delete all `sz.ai-code.club` references:
- The `ping -c 20 sz.ai-code.club` line and its comment
- The `ping -n 20 sz.ai-code.club` line and its comment
- The `time curl -s https://sz.ai-code.club/api/health` line
- The PowerShell `Measure-Command` line for sz.ai-code.club
- The table row `| \`https://sz.ai-code.club/api\` | 中国深圳 | ...`
- Any paragraph mentioning "深圳节点 sz.ai-code.club"

- [ ] **Step 4: Edit `pages/getting-started/faq/network-diagnosis.mdx`**

Delete all `sz.ai-code.club` references:
- Table row for `sz.ai-code.club`
- `echo "=== 深圳节点（阿里云）==="` and its ping command
- `ping -n 30 sz.ai-code.club`
- `time curl -s https://sz.ai-code.club/api/health`
- PowerShell `Measure-Command` line for sz.ai-code.club
- `echo "=== 深圳节点 ==="` and its curl line
- `"sz.ai-code.club"` from the PowerShell array
- `export ANTHROPIC_BASE_URL="https://sz.ai-code.club/api"`
- Any paragraph mentioning "深圳节点 sz.ai-code.club"

- [ ] **Step 5: Edit `CLAUDE.md`**

Delete the row `| \`https://sz.ai-code.club/api\` | 深圳节点（国内，由服务器代为出境） |`.

- [ ] **Step 6: Commit**
```bash
git add pages/getting-started/clawdbot-installation.mdx pages/getting-started/opencode-installation.mdx pages/getting-started/faq/slow-response.mdx pages/getting-started/faq/network-diagnosis.mdx CLAUDE.md
git commit -m "remove: delete sz.ai-code.club (Shenzhen node) references"
```

---

## Task 5: Copy Discord QR code and create Discord SVG icon

**Files:**
- Create: `public/images/discord-group-qrcode.svg`
- Create: `public/icons/discord.svg`

- [ ] **Step 1: Copy QR code**
```bash
mkdir -p public/icons
cp ~/Downloads/claude-code-discrod-qr-code.svg public/images/discord-group-qrcode.svg
```

- [ ] **Step 2: Create `public/icons/discord.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
  <path d="M20.317 4.37a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
</svg>
```

- [ ] **Step 3: Verify files exist**
```bash
ls -la public/images/discord-group-qrcode.svg public/icons/discord.svg
```

- [ ] **Step 4: Commit**
```bash
git add public/images/discord-group-qrcode.svg public/icons/discord.svg
git commit -m "add: Discord QR code and icon SVG"
```

---

## Task 6: Update FloatingWidget to Discord

**Files:**
- Modify: `components/FloatingWidget.jsx`
- Delete: `public/wecom-group-qrcode.png`
- Delete: `public/images/cc-club-group-qrcode.png`

- [ ] **Step 1: Replace `components/FloatingWidget.jsx`**

Full new content:
```jsx
import { useState } from 'react'
import styles from './FloatingWidget.module.css'

export default function FloatingWidget() {
  const [showQRCode, setShowQRCode] = useState(false)

  return (
    <>
      <div className={styles.widget}>
        <button
          onClick={() => setShowQRCode(true)}
          className={styles.widgetButton}
          title="加入 Discord 社群"
        >
          <img src="/icons/discord.svg" width="24" height="24" alt="Discord" style={{ filter: 'brightness(0) invert(1)' }} />
          <span>Discord 社群</span>
        </button>

        <a
          href="https://claude-code.club"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.widgetButton}
          title="返回 CC Club 官网"
        >
          <img src="/cc-club.svg" alt="CC Club" className={styles.ccLogo} />
          <span>返回官网</span>
        </a>
      </div>

      {showQRCode && (
        <div onClick={() => setShowQRCode(false)} className={styles.modalOverlay}>
          <div onClick={(e) => e.stopPropagation()} className={styles.modalContent}>
            <button
              onClick={() => setShowQRCode(false)}
              className={styles.closeButton}
              title="关闭"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="4" y1="4" x2="16" y2="16" />
                <line x1="16" y1="4" x2="4" y2="16" />
              </svg>
            </button>
            <h3 className={styles.modalTitle}>扫码或点击加入 Discord</h3>
            <div className={styles.qrCodeContainer}>
              <img
                src="/images/discord-group-qrcode.svg"
                alt="Discord 群二维码"
                className={styles.qrCodeImage}
                onError={(e) => {
                  e.target.style.display = 'none'
                  e.target.parentElement.innerHTML = '<p style="color: #000;">二维码图片加载失败，请稍后再试</p>'
                }}
              />
              <p className={styles.qrCodeDescription}>加入我们，与全球开发者一起进步</p>
              <a
                href="https://discord.gg/VCdTwvYBJd"
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'inline-block', marginTop: '0.75rem', padding: '0.5rem 1.25rem', background: '#5865F2', color: '#fff', borderRadius: '6px', textDecoration: 'none', fontWeight: 600 }}
              >
                直接加入 Discord →
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
```

- [ ] **Step 2: Delete old QR code images**
```bash
git rm public/wecom-group-qrcode.png public/images/cc-club-group-qrcode.png
```

- [ ] **Step 3: Commit**
```bash
git add components/FloatingWidget.jsx
git commit -m "feat: replace WeChat floating widget with Discord"
```

---

## Task 7: Update get-api-key.mdx QR code references

**Files:**
- Modify: `pages/getting-started/get-api-key.mdx`

- [ ] **Step 1: Replace first QR code occurrence (Steps section)**

Find the "加入社群" step and replace with:
```mdx
### 加入社群

扫描下方二维码或点击链接，加入 Claude Code Club Discord 社区。在这里你可以：
- 与优秀开发者交流 AI 编程经验，答疑解惑
- 获取最新的 Claude Code 使用技巧

<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', margin: '2rem 0', gap: '1rem' }}>
  <Image src="/images/discord-group-qrcode.svg" alt="Discord 群二维码" width={300} height={300} />
  <a href="https://discord.gg/VCdTwvYBJd" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', padding: '0.5rem 1.25rem', background: '#5865F2', color: '#fff', borderRadius: '6px', textDecoration: 'none', fontWeight: 600 }}>直接加入 Discord →</a>
</div>
```

- [ ] **Step 2: Replace second QR code occurrence (bottom Callout)**

Replace with:
```mdx
<Callout type="success">
🎉 准备好开启 AI 编程之旅了吗？立即加入 CC Club Discord，获取您的免费 API Key！
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', margin: '1rem 0', gap: '1rem' }}>
    <Image src="/images/discord-group-qrcode.svg" alt="Discord 群二维码" width={300} height={300} />
    <a href="https://discord.gg/VCdTwvYBJd" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', padding: '0.5rem 1.25rem', background: '#5865F2', color: '#fff', borderRadius: '6px', textDecoration: 'none', fontWeight: 600 }}>直接加入 Discord →</a>
  </div>
</Callout>
```

- [ ] **Step 3: Commit**
```bash
git add pages/getting-started/get-api-key.mdx
git commit -m "feat: replace WeChat QR with Discord in get-api-key page"
```

---

## Task 8: Add closeable top banner with 48h re-show

**Files:**
- Modify: `theme.config.jsx`

- [ ] **Step 1: Add React import at top of `theme.config.jsx`**

Add `import React from 'react'` alongside the existing `useConfig` import.

- [ ] **Step 2: Replace the `banner` section**

```jsx
banner: {
  key: 'cc-service-notice-v1',
  text: function BannerText() {
    const [visible, setVisible] = React.useState(false)

    React.useEffect(() => {
      const dismissedAt = localStorage.getItem('cc-banner-dismissed-at')
      if (!dismissedAt) {
        setVisible(true)
        return
      }
      const elapsed = Date.now() - parseInt(dismissedAt, 10)
      if (elapsed >= 2 * 24 * 60 * 60 * 1000) {
        setVisible(true)
      }
    }, [])

    if (!visible) return null

    function dismiss(e) {
      e.preventDefault()
      e.stopPropagation()
      localStorage.setItem('cc-banner-dismissed-at', Date.now().toString())
      setVisible(false)
    }

    return (
      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
        ⚠️ CC Club 的大模型 API 服务不向中国境内用户开放
        <button
          onClick={dismiss}
          style={{ marginLeft: '0.75rem', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', lineHeight: 1, padding: '0 0.25rem', color: 'inherit', opacity: 0.7 }}
          aria-label="关闭"
        >
          ×
        </button>
      </span>
    )
  }
},
```

- [ ] **Step 3: Test in browser**

Start dev server, verify:
1. Banner appears on page load
2. Clicking × hides the banner
3. Refreshing page — banner stays hidden
4. In console: `localStorage.removeItem('cc-banner-dismissed-at')` then reload — banner reappears

- [ ] **Step 4: Commit**
```bash
git add theme.config.jsx
git commit -m "feat: add closeable top banner with 48h re-show logic"
```

---

## Task 9: Configure i18n in next.config.mjs and theme.config.jsx

**Files:**
- Modify: `next.config.mjs`
- Modify: `theme.config.jsx`

- [ ] **Step 1: Update `next.config.mjs`**

```js
import nextra from 'nextra'

const withNextra = nextra({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.jsx'
})

export default withNextra({
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true
  },
  images: {
    unoptimized: true
  },
  i18n: {
    locales: ['zh', 'en'],
    defaultLocale: 'zh'
  }
})
```

- [ ] **Step 2: Add `useRouter` import and `i18n` config to `theme.config.jsx`**

Add at top:
```jsx
import { useRouter } from 'next/router'
```

Add to config object:
```jsx
i18n: [
  { locale: 'zh', name: '中文' },
  { locale: 'en', name: 'English' }
],
```

- [ ] **Step 3: Make all text strings locale-aware in `theme.config.jsx`**

Update banner to show English text when locale is 'en':
```jsx
{locale === 'en'
  ? "⚠️ CC Club's LLM API service is not available to users in mainland China"
  : '⚠️ CC Club 的大模型 API 服务不向中国境内用户开放'}
```

Update footer, search placeholder, toc title, gitTimestamp similarly.

- [ ] **Step 4: Verify dev server starts**
```bash
pnpm dev 2>&1 | head -10
```
Expected: no errors.

- [ ] **Step 5: Commit**
```bash
git add next.config.mjs theme.config.jsx
git commit -m "feat: configure Nextra i18n with zh/en locales"
```

---

## Task 10: Rename all MDX and _meta.js files for i18n

**Files:**
- Rename: all `pages/**/*.mdx` → `pages/**/*.zh.mdx`
- Rename: all `pages/**/_meta.js` → `pages/**/_meta.zh.js`

- [ ] **Step 1: Rename all MDX files**
```bash
find pages -name "*.mdx" | while read f; do
  mv "$f" "${f%.mdx}.zh.mdx"
done
```

- [ ] **Step 2: Rename all _meta.js files**
```bash
find pages -name "_meta.js" | while read f; do
  mv "$f" "${f%_meta.js}_meta.zh.js"
done
```

- [ ] **Step 3: Verify**
```bash
find pages -name "*.zh.mdx" | wc -l   # expect ~77 (78 minus deleted contributing)
find pages -name "_meta.zh.js" | wc -l  # expect ~10
find pages -name "*.mdx" | grep -v ".zh.mdx" | wc -l  # expect 0
find pages -name "_meta.js" | wc -l    # expect 0
```

- [ ] **Step 4: Verify dev server works**
```bash
pnpm dev 2>&1 | grep -E "error|Error|ready" | head -5
```

- [ ] **Step 5: Commit**
```bash
git add -A
git commit -m "refactor: rename .mdx to .zh.mdx and _meta.js to _meta.zh.js for i18n"
```

---

## Task 11: Create English _meta.en.js files

**Files:**
- Create: `pages/_meta.en.js`
- Create: `pages/courses/_meta.en.js`
- Create: `pages/getting-started/_meta.en.js`
- Create: `pages/getting-started/faq/_meta.en.js`
- Create: `pages/getting-started/installation/_meta.en.js`
- Create: `pages/getting-started/how-to/_meta.en.js`
- Create: `pages/getting-started/common-errors/_meta.en.js`
- Create: `pages/getting-started/installation/diagnose/_meta.en.js`
- Create: `pages/practical-skills/_meta.en.js`
- Create: `pages/community/_meta.en.js`

- [ ] **Step 1: Create `pages/_meta.en.js`**
```js
export default {
  index: {
    title: 'Academy Home',
    type: 'page'
  },
  'getting-started': {
    title: 'Getting Started',
    type: 'page'
  },
  'practical-skills': {
    title: 'Practical Skills',
    type: 'page'
  },
  courses: {
    title: 'Courses',
    type: 'page'
  },
  examples: {
    title: 'Examples',
    type: 'page'
  },
  community: {
    title: 'Community',
    type: 'page'
  }
}
```

- [ ] **Step 2: Create remaining `_meta.en.js` files**

For each subdirectory, read the corresponding `_meta.zh.js` to get all keys, then create an English version with translated titles. Keep the same keys and structure, only translate the title strings.

- [ ] **Step 3: Commit**
```bash
git add pages/**/_meta.en.js pages/_meta.en.js
git commit -m "feat: add English _meta.en.js navigation files"
```

---

## Task 12: Create English homepage and placeholder files

**Files:**
- Create: `pages/index.en.mdx`
- Create: ~76 placeholder `.en.mdx` files

- [ ] **Step 1: Create `pages/index.en.mdx`**

Full English translation of the homepage:
```mdx
---
title: Claude Code Academy
---

import { Cards, Steps } from 'nextra/components'

<img src="/cc-club.svg" alt="Claude Code Academy Logo" style={{ height: '90px', backgroundColor: '#030219', borderRadius: '4px' }} />

# Claude Code Academy

<p className="text-xl mt-6 text-gray-600 dark:text-gray-400">Maintained by [Claude Code Club](https://claude-code.club), dedicated to promoting **Vibe Coding** worldwide.</p>

## Welcome!

Claude Code Academy is an open-source collaborative learning platform helping developers quickly master Claude Code's core features and improve development efficiency.

## ✨ Why Claude Code Academy?

Whether you're new to AI-assisted programming or looking to master advanced Claude Code features, you'll find learning paths and practical resources here.

**Key features:**

- **Continuously updated** — Tracks the latest Claude Code versions and features
- **Community-driven** — Open source, everyone can contribute
- **Practical focus** — Real-world use cases, not just theory

## 🎯 Learning Path

<Steps>

### Getting Started

New to Claude Code? Learn the basics, set up your environment, and complete your first project.

<Cards>
  <Cards.Card icon="📖" title="What is Claude Code" href="/getting-started/introduction" />
  <Cards.Card icon="🔑" title="Get API Key" href="/getting-started/get-api-key" />
  <Cards.Card icon="⚙️" title="Installation & Setup" href="/getting-started/installation" />
  <Cards.Card icon="💰" title="Pricing & Plans" href="/getting-started/pricing" />
  <Cards.Card icon="🚀" title="Quick Start" href="/getting-started/quick-start" />
  <Cards.Card icon="💡" title="How-To Guides" href="/getting-started/how-to" />
  <Cards.Card icon="🔧" title="Common Errors" href="/getting-started/common-errors" />
  <Cards.Card icon="❓" title="FAQ" href="/getting-started/faq" />
</Cards>

### Practical Skills

Master real-world Claude Code techniques.

<Cards>
  <Cards.Card icon="📚" title="General Resources" href="/practical-skills/general" />
  <Cards.Card icon="⚙️" title="Workflow" href="/practical-skills/workflow" />
  <Cards.Card icon="🎨" title="UI Design" href="/practical-skills/ui" />
  <Cards.Card icon="⌨️" title="Commands & Tips" href="/practical-skills/commands" />
  <Cards.Card icon="🤖" title="Subagents" href="/practical-skills/subagents" />
  <Cards.Card icon="🔌" title="MCP Tools" href="/practical-skills/mcp-tools" />
</Cards>

### Full Courses

Comprehensive, structured courses for immersive learners.

<Cards>
  <Cards.Card icon="🎓" title="Claude Code: Highly Agentic Coding Assistant" href="/courses/claude-code-highly-agentic-coding-assistant">
    Official Anthropic course on core features and best practices
  </Cards.Card>
  <Cards.Card icon="📺" title="Claude Code Tutorial" href="/courses/claude-code-tutorial">
    By Net Ninja — beginner-friendly
  </Cards.Card>
  <Cards.Card icon="➕" title="Browse All Courses" href="/courses">
    View the full course list
  </Cards.Card>
</Cards>

### Project Examples

Real project case studies to consolidate your learning.

<Cards>
  <Cards.Card icon="🏢" title="HCME Website" href="/examples#1-hcme-官网">
    Enterprise website — 20 hours, internationalized responsive site
  </Cards.Card>
  <Cards.Card icon="🌐" title="Claude Code Club Website" href="/examples#2-claude-code-club-官网">
    Community site — 6 hours, modern tech aesthetic
  </Cards.Card>
  <Cards.Card icon="📚" title="Claude Code Academy" href="/examples#3-claude-code-academy">
    Education platform — 8 hours, full documentation site
  </Cards.Card>
  <Cards.Card icon="➕" title="Browse All Examples" href="/examples">
    View all project case studies
  </Cards.Card>
</Cards>

### Community

Join the community to share experiences and contribute.

<Cards>
  <Cards.Card icon="🌟" title="Showcase" href="/community/showcase" />
  <Cards.Card icon="💬" title="FAQ" href="/community/faq" />
</Cards>

</Steps>

## 🤝 Contribute

This is a community-driven project. We welcome all contributions:

- 📝 Write courses and documentation
- 💡 Share practical examples
- 🔧 Recommend tools
- 🐛 Report issues
- 🌐 Translate content
```

- [ ] **Step 2: Create placeholder `.en.mdx` files for all other pages**

Use a script to generate placeholders:
```bash
find pages -name "*.zh.mdx" | grep -v "index.zh.mdx" | while read f; do
  en_file="${f%.zh.mdx}.en.mdx"
  if [ ! -f "$en_file" ]; then
    # Extract title from frontmatter
    title=$(grep -m1 "^title:" "$f" | sed 's/^title: *//')
    cat > "$en_file" << EOF
---
title: ${title}
---

# ${title}

> 🚧 English translation coming soon.
EOF
  fi
done
```

Also create `pages/index.en.mdx` separately (already done in Step 1 — skip it in the loop by checking `grep -v "pages/index.zh.mdx"`).

- [ ] **Step 3: Verify file count**
```bash
find pages -name "*.en.mdx" | wc -l  # expect ~77
```

- [ ] **Step 4: Verify dev server works and language switcher appears**
```bash
pnpm dev
# Visit http://localhost:3000 — should see language switcher in navbar
# Switch to English — should show English homepage
# Navigate to other pages — should show placeholder
```

- [ ] **Step 5: Commit**
```bash
git add pages/
git commit -m "feat: add English homepage translation and placeholder files"
```

---

## Task 13: Final verification

- [ ] **Step 1: Full build check**
```bash
pnpm build
```
Expected: successful build with no errors.

- [ ] **Step 2: Visual verification in browser**

Check:
1. Banner appears with warning text and close button works
2. FloatingWidget shows Discord icon, opens Discord QR modal with direct link
3. Language switcher in navbar works (zh/en)
4. English homepage renders correctly
5. No WeChat references remain anywhere visible
6. No `zjh1943` or `sz.ai-code.club` references visible
7. Footer has no GitHub link

- [ ] **Step 3: Grep for any remaining references**
```bash
grep -r "zjh1943\|sz\.ai-code\.club\|wecom\|微信群\|cc-club-group-qrcode" pages components theme.config.jsx --include="*.mdx" --include="*.jsx" --include="*.js"
```
Expected: no matches.

- [ ] **Step 4: Final commit (if any fixes needed)**
```bash
git add -A
git commit -m "fix: final cleanup from renovation verification"
```

