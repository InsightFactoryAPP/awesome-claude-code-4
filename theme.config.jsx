import React from 'react'
import { createPortal } from 'react-dom'
import { useRouter } from 'nextra/hooks'
import { useConfig } from 'nextra-theme-docs'

export default {
  logo:
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', height: '100%' }}>
      <img src="/cc-club.svg" alt="Logo" style={{ width: '40px', height: '40px', backgroundColor: '#030219', borderRadius: '4px' }} />
      <span style={{ marginLeft: 8, fontWeight: 'bold', fontSize: '24px' }}>CC Club</span>
      {/* <a href="https://claude-code.club" target="_blank" rel="noopener noreferrer" style={{ marginLeft: 8, fontSize: '14px', color: '#888' }}>by CC Club</a> */}
    </div>,
  logoLink: 'https://claude-code.club',
  i18n: [
    { locale: 'zh', name: '中文' },
    { locale: 'en', name: 'English' }
  ],
  head: () => {
    const { frontMatter, title } = useConfig()
    const pageTitle = title ? `CC Academy - ${title}` : 'CC Academy'
    return (
      <>
        <title>{pageTitle}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={frontMatter.description || "为 Claude Code 开发者提供的中文学习资源库"} />
        <link rel="icon" type="image/svg+xml" href="/cc-club.svg" />
      </>
    )
  },
  primaryHue: 220,
  primarySaturation: 90,
  banner: {
    key: 'cc-service-notice-v1',
    text: function BannerText() {
      const { locale } = useRouter()
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
          {locale === 'en'
            ? "⚠️ CC Club's LLM API service is not available to users in mainland China"
            : '⚠️ CC Club 的大模型 API 服务不向中国境内用户开放'}
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
  sidebar: {
    titleComponent({ title, type }) {
      if (type === 'separator') {
        return <span className="cursor-default">{title}</span>
      }
      return <>{title}</>
    },
    defaultMenuCollapseLevel: 1,
    toggleButton: true
  },
  footer: {
    text: (
      <>
        MIT {new Date().getFullYear()} © Claude Code Academy
        {' · '}
        Built with ❤️ by the community
      </>
    )
  },
  toc: {
    title: () => {
      const { locale } = useRouter()
      return locale === 'en' ? 'On This Page' : '本页目录'
    },
    backToTop: true
  },
  navigation: {
    prev: true,
    next: true
  },
  darkMode: false,
  navbar: {
    extraContent: function LocaleSwitcher() {
      const router = useRouter()
      const { locale, asPath } = router
      const [open, setOpen] = React.useState(false)
      const [dropdownPos, setDropdownPos] = React.useState({ top: 0, right: 0 })
      const [mounted, setMounted] = React.useState(false)
      const buttonRef = React.useRef(null)

      const LOCALES = [
        { code: 'zh', label: '中文' },
        { code: 'en', label: 'English' }
      ]

      React.useEffect(() => { setMounted(true) }, [])

      React.useEffect(() => {
        if (!open) return
        function handleClose(e) {
          if (buttonRef.current && buttonRef.current.contains(e.target)) return
          setOpen(false)
        }
        function handleKey(e) {
          if (e.key === 'Escape') setOpen(false)
        }
        // Close on scroll so fixed dropdown doesn't drift from button
        function handleScroll() { setOpen(false) }
        document.addEventListener('mousedown', handleClose)
        document.addEventListener('keydown', handleKey)
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => {
          document.removeEventListener('mousedown', handleClose)
          document.removeEventListener('keydown', handleKey)
          window.removeEventListener('scroll', handleScroll)
        }
      }, [open])

      function handleToggle() {
        if (!open && buttonRef.current) {
          const r = buttonRef.current.getBoundingClientRect()
          setDropdownPos({ top: r.bottom + 6, right: window.innerWidth - r.right })
        }
        setOpen((v) => !v)
      }

      function switchLocale(newLocale) {
        setOpen(false)
        if (newLocale === locale) return
        const ONE_YEAR = 60 * 60 * 24 * 365
        document.cookie = `preferred-locale=${newLocale}; path=/; max-age=${ONE_YEAR}; SameSite=Lax`
        const pathWithoutLocale = asPath.replace(/^\/(zh|en)(?=\/|$)/, '') || '/'
        window.location.href = `/${newLocale}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`
      }

      const current = LOCALES.find((l) => l.code === locale) || LOCALES[0]

      const dropdown = open && mounted && createPortal(
        <>
          <style>{`
            @keyframes _ls_fadein {
              from { opacity: 0; transform: translateY(-6px) scale(0.97); }
              to   { opacity: 1; transform: translateY(0)    scale(1);    }
            }
            ._ls_item:hover { background: var(--_ls_hover) !important; }
          `}</style>
          <ul
            role="listbox"
            aria-label="Select language"
            onMouseDown={e => e.stopPropagation()}
            style={{
              position: 'fixed',
              top: dropdownPos.top,
              right: dropdownPos.right,
              minWidth: '9rem',
              margin: 0,
              padding: '0.3rem',
              listStyle: 'none',
              /* Explicit solid backgrounds — never transparent */
              background: 'var(--nextra-bg, #ffffff)',
              border: '1px solid var(--nextra-border, rgba(0,0,0,0.12))',
              borderRadius: '8px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.14), 0 2px 6px rgba(0,0,0,0.08)',
              zIndex: 99999,
              animation: '_ls_fadein 0.14s ease-out both',
            }}
          >
            {LOCALES.map((l) => (
              <li key={l.code}>
                <button
                  className="_ls_item"
                  onClick={() => switchLocale(l.code)}
                  role="option"
                  aria-selected={l.code === locale}
                  style={{
                    '--_ls_hover': 'var(--nextra-border, rgba(0,0,0,0.06))',
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.5rem',
                    textAlign: 'left',
                    background: l.code === locale ? 'var(--nextra-border, rgba(0,0,0,0.06))' : 'transparent',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    padding: '0.45rem 0.65rem',
                    fontSize: '0.875rem',
                    color: 'inherit',
                    fontWeight: l.code === locale ? 600 : 400,
                    transition: 'background 0.1s',
                  }}
                >
                  <span>{l.label}</span>
                  {l.code === locale && (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </>,
        document.body
      )

      return (
        <>
          <button
            ref={buttonRef}
            onClick={handleToggle}
            aria-haspopup="listbox"
            aria-expanded={open}
            title="Switch language"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.375rem',
              background: 'none',
              border: '1px solid var(--nextra-border, rgba(0,0,0,0.12))',
              borderRadius: '6px',
              cursor: 'pointer',
              padding: '0.3rem 0.6rem',
              fontSize: '0.875rem',
              color: 'inherit',
              lineHeight: 1,
              marginLeft: '0.5rem',
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10"/>
              <path d="M2 12h20"/>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
            <span>{current.label}</span>
            <svg
              width="10" height="10" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
              aria-hidden="true"
              style={{ opacity: 0.5, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }}
            >
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>
          {dropdown}
        </>
      )
    }
  },
  search: {
    placeholder: () => {
      const { locale } = useRouter()
      return locale === 'en' ? 'Search docs...' : '搜索文档...'
    }
  },
  gitTimestamp: ({ timestamp }) => {
    const { locale } = useRouter()
    return locale === 'en'
      ? <>Last updated: {timestamp.toLocaleDateString('en-US')}</>
      : <>最后更新于 {timestamp.toLocaleDateString('zh-CN')}</>
  }
}
