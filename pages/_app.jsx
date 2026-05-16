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

  return (
    <>
      <Component {...pageProps} />
      <FloatingWidget />
      <Analytics />
    </>
  )
}
