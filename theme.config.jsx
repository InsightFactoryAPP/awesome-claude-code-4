import React from 'react'
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
      const containerRef = React.useRef(null)

      const LOCALES = [
        { code: 'zh', label: '中文' },
        { code: 'en', label: 'English' }
      ]

      React.useEffect(() => {
        function handleClickOutside(e) {
          if (containerRef.current && !containerRef.current.contains(e.target)) {
            setOpen(false)
          }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
      }, [])

      function switchLocale(newLocale) {
        setOpen(false)
        if (newLocale === locale) return
        const ONE_YEAR = 60 * 60 * 24 * 365
        document.cookie = `preferred-locale=${newLocale}; path=/; max-age=${ONE_YEAR}; SameSite=Lax`
        const pathWithoutLocale = asPath.replace(/^\/(zh|en)(?=\/|$)/, '') || '/'
        window.location.href = `/${newLocale}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`
      }

      const current = LOCALES.find((l) => l.code === locale) || LOCALES[0]

      return (
        <div ref={containerRef} style={{ position: 'relative', marginLeft: '0.5rem' }}>
          <button
            onClick={() => setOpen(!open)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.375rem',
              background: 'none',
              border: '1px solid var(--nextra-border, rgba(0,0,0,0.1))',
              borderRadius: '6px',
              cursor: 'pointer',
              padding: '0.3rem 0.6rem',
              fontSize: '0.875rem',
              color: 'inherit',
              lineHeight: 1
            }}
            aria-haspopup="listbox"
            aria-expanded={open}
            title="Language"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M2 12h20"></path>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
            </svg>
            <span>{current.label}</span>
          </button>
          {open && (
            <ul
              role="listbox"
              style={{
                position: 'absolute',
                top: 'calc(100% + 4px)',
                right: 0,
                minWidth: '8rem',
                margin: 0,
                padding: '0.25rem',
                listStyle: 'none',
                background: 'var(--nextra-bg, #fff)',
                border: '1px solid var(--nextra-border, rgba(0,0,0,0.1))',
                borderRadius: '6px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                zIndex: 50
              }}
            >
              {LOCALES.map((l) => (
                <li key={l.code}>
                  <button
                    onClick={() => switchLocale(l.code)}
                    role="option"
                    aria-selected={l.code === locale}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      background: l.code === locale ? 'rgba(0, 0, 0, 0.05)' : 'none',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      padding: '0.4rem 0.6rem',
                      fontSize: '0.875rem',
                      color: 'inherit',
                      fontWeight: l.code === locale ? 600 : 400
                    }}
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
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
