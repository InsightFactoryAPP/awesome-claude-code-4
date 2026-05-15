import { useConfig } from 'nextra-theme-docs'

export default {
  logo:
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', height: '100%' }}>
      <img src="/cc-club.svg" alt="Logo" style={{ width: '40px', height: '40px', backgroundColor: '#030219', borderRadius: '4px' }} />
      <span style={{ marginLeft: 8, fontWeight: 'bold', fontSize: '24px' }}>CC Club</span>
      {/* <a href="https://claude-code.club" target="_blank" rel="noopener noreferrer" style={{ marginLeft: 8, fontSize: '14px', color: '#888' }}>by CC Club</a> */}
    </div>,
  logoLink: 'https://claude-code.club',
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
    key: 'welcome',
    text: '🎉 欢迎来到 Claude Code Academy！这是一个开源协作项目，欢迎贡献'
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
    title: '本页目录',
    backToTop: true
  },
  navigation: {
    prev: true,
    next: true
  },
  darkMode: false,
  search: {
    placeholder: '搜索文档...'
  },
  gitTimestamp: ({ timestamp }) => (
    <>最后更新于 {timestamp.toLocaleDateString('zh-CN')}</>
  )
}
