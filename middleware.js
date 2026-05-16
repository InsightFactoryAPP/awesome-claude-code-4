import { NextResponse } from 'next/server'

const SUPPORTED_LOCALES = ['zh', 'en']
const DEFAULT_LOCALE = 'zh'
const LOCALE_COOKIE = 'preferred-locale'

function detectLocaleFromHeader(acceptLanguage) {
  if (!acceptLanguage) return DEFAULT_LOCALE

  const languages = acceptLanguage
    .split(',')
    .map((lang) => {
      const [code, q = 'q=1'] = lang.trim().split(';')
      const quality = parseFloat(q.split('=')[1]) || 1
      return { code: code.toLowerCase(), quality }
    })
    .sort((a, b) => b.quality - a.quality)

  for (const { code } of languages) {
    if (code.startsWith('zh')) return 'zh'
    if (code.startsWith('en')) return 'en'
  }

  return DEFAULT_LOCALE
}

export function middleware(request) {
  const { pathname } = request.nextUrl

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') ||
    SUPPORTED_LOCALES.some((locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`))
  ) {
    return NextResponse.next()
  }

  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value
  const locale =
    cookieLocale && SUPPORTED_LOCALES.includes(cookieLocale)
      ? cookieLocale
      : detectLocaleFromHeader(request.headers.get('accept-language'))

  const url = request.nextUrl.clone()
  url.pathname = `/${locale}${pathname === '/' ? '' : pathname}`
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)']
}
