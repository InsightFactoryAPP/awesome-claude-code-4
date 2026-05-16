import { useState } from 'react'
import { useRouter } from 'next/router'
import styles from './FloatingWidget.module.css'

const TEXT = {
  zh: {
    joinTitle: '加入 Discord 社群',
    joinLabel: 'Discord',
    homeTitle: '返回 CC Club 官网',
    homeLabel: '官网',
    closeTitle: '关闭',
    modalTitle: '扫码或点击加入 Discord',
    qrAlt: 'Discord 群二维码',
    description: '加入我们，与全球开发者一起进步',
    joinButton: '直接加入 Discord →',
    loadError: '二维码图片加载失败，请稍后再试'
  },
  en: {
    joinTitle: 'Join Discord Community',
    joinLabel: 'Discord',
    homeTitle: 'Back to CC Club',
    homeLabel: 'Home',
    closeTitle: 'Close',
    modalTitle: 'Scan or click to join Discord',
    qrAlt: 'Discord QR code',
    description: 'Join us, grow with developers worldwide',
    joinButton: 'Join Discord →',
    loadError: 'Failed to load QR code, please try again later'
  }
}

export default function FloatingWidget() {
  const [showQRCode, setShowQRCode] = useState(false)
  const router = useRouter()
  const t = TEXT[router.locale === 'en' ? 'en' : 'zh']

  return (
    <>
      <div className={styles.widget}>
        <button
          onClick={() => setShowQRCode(true)}
          className={styles.widgetButton}
          title={t.joinTitle}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="#5865F2" xmlns="http://www.w3.org/2000/svg">
            <path d="M20.317 4.37a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
          </svg>
          <span>{t.joinLabel}</span>
        </button>

        <a
          href="https://claude-code.club"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.widgetButton}
          title={t.homeTitle}
        >
          <img src="/cc-club.svg" alt="CC Club" className={styles.ccLogo} />
          <span>{t.homeLabel}</span>
        </a>
      </div>

      {showQRCode && (
        <div onClick={() => setShowQRCode(false)} className={styles.modalOverlay}>
          <div onClick={(e) => e.stopPropagation()} className={styles.modalContent}>
            <button
              onClick={() => setShowQRCode(false)}
              className={styles.closeButton}
              title={t.closeTitle}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="4" y1="4" x2="16" y2="16" />
                <line x1="16" y1="4" x2="4" y2="16" />
              </svg>
            </button>
            <h3 className={styles.modalTitle}>{t.modalTitle}</h3>
            <div className={styles.qrCodeContainer}>
              <img
                src="/images/discord-group-qrcode.svg"
                alt={t.qrAlt}
                className={styles.qrCodeImage}
                onError={(e) => {
                  e.target.style.display = 'none'
                  e.target.parentElement.innerHTML = `<p style="color: #000;">${t.loadError}</p>`
                }}
              />
              <p className={styles.qrCodeDescription}>{t.description}</p>
              <a
                href="https://discord.gg/VCdTwvYBJd"
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'inline-block', marginTop: '0.75rem', padding: '0.5rem 1.25rem', background: '#5865F2', color: '#fff', borderRadius: '6px', textDecoration: 'none', fontWeight: 600 }}
              >
                {t.joinButton}
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
