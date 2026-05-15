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
