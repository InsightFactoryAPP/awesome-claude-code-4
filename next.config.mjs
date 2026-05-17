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
  },
  async redirects() {
    const locales = ['zh', 'en']
    const rules = []
    for (const locale of locales) {
      const p = `/${locale}/getting-started`
      // Claude Code root
      rules.push({ source: `${p}/introduction`,  destination: `${p}/claude-code/introduction`,  permanent: true })
      rules.push({ source: `${p}/get-api-key`,   destination: `${p}/claude-code/get-api-key`,   permanent: true })
      rules.push({ source: `${p}/pricing`,        destination: `${p}/claude-code/pricing`,        permanent: true })
      rules.push({ source: `${p}/quick-start`,   destination: `${p}/claude-code/quick-start`,   permanent: true })
      // Claude Code installation
      rules.push({ source: `${p}/installation`,                          destination: `${p}/claude-code/installation`,                          permanent: true })
      rules.push({ source: `${p}/installation/windows`,                  destination: `${p}/claude-code/installation/windows`,                  permanent: true })
      rules.push({ source: `${p}/installation/macos`,                    destination: `${p}/claude-code/installation/macos`,                    permanent: true })
      rules.push({ source: `${p}/installation/linux`,                    destination: `${p}/claude-code/installation/linux`,                    permanent: true })
      rules.push({ source: `${p}/installation/ccswitch`,                 destination: `${p}/claude-code/installation/ccswitch`,                 permanent: true })
      rules.push({ source: `${p}/installation/diagnose`,                 destination: `${p}/claude-code/installation/diagnose`,                 permanent: true })
      rules.push({ source: `${p}/installation/diagnose/macos`,           destination: `${p}/claude-code/installation/diagnose/macos`,           permanent: true })
      rules.push({ source: `${p}/installation/diagnose/windows`,         destination: `${p}/claude-code/installation/diagnose/windows`,         permanent: true })
      rules.push({ source: `${p}/installation/diagnose/terminal-basics`, destination: `${p}/claude-code/installation/diagnose/terminal-basics`, permanent: true })
      // Claude Code how-to
      rules.push({ source: `${p}/how-to`,          destination: `${p}/claude-code/how-to`,        permanent: true })
      rules.push({ source: `${p}/how-to/:path*`,   destination: `${p}/claude-code/how-to/:path*`, permanent: true })
      // Claude Code FAQ
      rules.push({ source: `${p}/faq`,                             destination: `${p}/claude-code/faq`,                             permanent: true })
      rules.push({ source: `${p}/faq/basics`,                      destination: `${p}/claude-code/faq/basics`,                      permanent: true })
      rules.push({ source: `${p}/faq/config-baseurl-authtoken`,    destination: `${p}/claude-code/faq/config-baseurl-authtoken`,    permanent: true })
      rules.push({ source: `${p}/faq/use-in-ide`,                  destination: `${p}/claude-code/faq/use-in-ide`,                  permanent: true })
      rules.push({ source: `${p}/faq/fetch-websearch-alternatives`, destination: `${p}/claude-code/faq/fetch-websearch-alternatives`, permanent: true })
      rules.push({ source: `${p}/faq/connect-openai-model`,        destination: `${p}/claude-code/installation/connect-openai-model`,   permanent: true })
      rules.push({ source: `${p}/faq/claude-desktop-gateway`,      destination: `${p}/claude-code/installation/claude-desktop-gateway`, permanent: true })
      rules.push({ source: `${p}/faq/high-token-consumption`,      destination: `${p}/claude-code/common-errors/high-token-consumption`, permanent: true })
      rules.push({ source: `${p}/faq/slow-response`,               destination: `${p}/claude-code/common-errors/slow-response`,          permanent: true })
      rules.push({ source: `${p}/faq/network-diagnosis`,           destination: `${p}/claude-code/common-errors/network-diagnosis`,      permanent: true })
      // Claude Code common-errors
      rules.push({ source: `${p}/common-errors`,                                       destination: `${p}/claude-code/common-errors`,                                       permanent: true })
      rules.push({ source: `${p}/common-errors/error-400-context-management`,          destination: `${p}/claude-code/common-errors/error-400-context-management`,          permanent: true })
      rules.push({ source: `${p}/common-errors/error-400-invalid-signature-thinking`,  destination: `${p}/claude-code/common-errors/error-400-invalid-signature-thinking`,  permanent: true })
      rules.push({ source: `${p}/common-errors/syntax-error-node-version`,             destination: `${p}/claude-code/common-errors/syntax-error-node-version`,             permanent: true })
      rules.push({ source: `${p}/common-errors/get-session-file`,                      destination: `${p}/claude-code/common-errors/get-session-file`,                      permanent: true })
      // Codex
      rules.push({ source: `${p}/codex-installation`,    destination: `${p}/codex/installation`,    permanent: true })
      rules.push({ source: `${p}/codex-ccswitch`,        destination: `${p}/codex/ccswitch`,        permanent: true })
      rules.push({ source: `${p}/codex-desktop`,         destination: `${p}/codex/desktop`,         permanent: true })
      rules.push({ source: `${p}/codex-bootstrap-error`, destination: `${p}/codex/bootstrap-error`, permanent: true })
      // Gemini
      rules.push({ source: `${p}/gemini-introduction`,  destination: `${p}/gemini/introduction`,  permanent: true })
      rules.push({ source: `${p}/gemini-installation`,  destination: `${p}/gemini/installation`,  permanent: true })
      rules.push({ source: `${p}/gemini-quick-start`,   destination: `${p}/gemini/quick-start`,   permanent: true })
      rules.push({ source: `${p}/gemini-faq`,           destination: `${p}/gemini/faq`,           permanent: true })
      rules.push({ source: `${p}/gemini-common-errors`, destination: `${p}/gemini/common-errors`, permanent: true })
      // OpenCode
      rules.push({ source: `${p}/opencode-introduction`, destination: `${p}/opencode/introduction`, permanent: true })
      rules.push({ source: `${p}/opencode-installation`, destination: `${p}/opencode/installation`, permanent: true })
      // OpenClaw
      rules.push({ source: `${p}/clawdbot-introduction`, destination: `${p}/openclaw/introduction`, permanent: true })
      rules.push({ source: `${p}/clawdbot-installation`, destination: `${p}/openclaw/installation`, permanent: true })
    }
    return rules
  },
})
