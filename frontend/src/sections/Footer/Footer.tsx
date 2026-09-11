import { useTranslation } from '../../i18n';
import styles from './Footer.module.css';

export function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.top}>
          <div>
            <div className={styles.logo}>
              akmal<span>.dev</span>
            </div>
            <p style={{ color: 'var(--color-text-faint)', marginTop: '0.5rem', maxWidth: '32ch' }}>{t.footer.tagline}</p>
          </div>
          <div className={styles.tags}>
            <span className={styles.tag}>{t.footer.linkWeb}</span>
            <span className={styles.tag}>{t.footer.linkApps}</span>
            <span className={styles.tag}>{t.footer.linkBots}</span>
            <span className={styles.tag}>{t.footer.linkBackend}</span>
          </div>
        </div>

        <div className={styles.meta}>
          <span>
            © {year} akmal.dev — {t.footer.location}
          </span>
          <a href="https://t.me/akm0028" target="_blank" rel="noreferrer" data-cursor="open">
            {t.footer.telegram} ↗
          </a>
        </div>
      </div>
    </footer>
  );
}
