import { Analytics } from '@vercel/analytics/react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import FloatingWidget from '../components/FloatingWidget'
import '../styles/global.css'

const SUPPORTED_LOCALES = ['zh', 'en']
const LOCALE_COOKIE = 'preferred-locale'
const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365

function getLocaleFromPath(pathname) {
  const segment = pathname.split('/')[1]
  return SUPPORTED_LOCALES.includes(segment) ? segment : null
}

export default function App({ Component, pageProps }) {
  const router = useRouter()

  useEffect(() => {
    const locale = getLocaleFromPath(router.asPath)
    if (locale) {
      document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=${ONE_YEAR_SECONDS}; SameSite=Lax`
    }
  }, [router.asPath])

  // Fix Nextra's home-link highlight: Nextra marks the home link (/zh, /en)
  // as aria-current="true" on every page because it prefix-matches.
  // We override it: the home link is "current" only when the path equals /<locale>.
  useEffect(() => {
    const path = router.asPath.split(/[?#]/)[0]
    const homePaths = SUPPORTED_LOCALES.map((l) => `/${l}`)
    const isHomePage = homePaths.includes(path) || path === '/'

    document.querySelectorAll('nav a').forEach((a) => {
      const href = a.getAttribute('href')
      if (homePaths.includes(href) && !isHomePage) {
        a.setAttribute('aria-current', 'false')
      }
    })
  }, [router.asPath])

  return (
    <>
      <Component {...pageProps} />
      <FloatingWidget />
      <Analytics />
    </>
  )
}
