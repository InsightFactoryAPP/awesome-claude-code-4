import { NextResponse } from 'next/server'

const SUPPORTED_LOCALES = ['zh', 'en']
const DEFAULT_LOCALE = 'zh'
const LOCALE_COOKIE = 'preferred-locale'

const REGION_RESTRICTION_HTML = `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>服务区域限制</title>
  <style>
    :root { color-scheme: light; }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      min-height: 100vh;
      display: grid;
      place-items: center;
      padding: 24px;
      background: #f5f7fb;
      color: #172033;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
    }
    main {
      width: min(100%, 620px);
      padding: 48px;
      background: #fff;
      border: 1px solid #e5e9f0;
      border-radius: 20px;
      box-shadow: 0 18px 50px rgba(25, 39, 64, .10);
    }
    .status {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 18px;
      padding: 7px 11px;
      color: #9f1239;
      background: #fff1f2;
      border-radius: 999px;
      font-size: 14px;
      font-weight: 600;
    }
    .dot { width: 8px; height: 8px; background: currentColor; border-radius: 50%; }
    h1 { margin: 0; font-size: clamp(28px, 5vw, 38px); line-height: 1.22; letter-spacing: -.03em; }
    p { margin: 18px 0 0; color: #536075; font-size: 17px; line-height: 1.75; }
    @media (max-width: 520px) { body { padding: 16px; } main { padding: 32px 24px; border-radius: 16px; } p { font-size: 16px; } }
  </style>
</head>
<body>
  <main>
    <div class="status"><span class="dot"></span>访问受限</div>
    <h1>暂不支持当前访问区域</h1>
    <p>您的 IP 地址来自中国，不在我们的服务区域。</p>
  </main>
</body>
</html>`

function regionRestrictedResponse() {
  return new NextResponse(REGION_RESTRICTION_HTML, {
    status: 403,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  })
}

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
  const country = request.headers.get('x-vercel-ip-country')?.toUpperCase()

  if (country === 'CN') {
    return regionRestrictedResponse()
  }

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
