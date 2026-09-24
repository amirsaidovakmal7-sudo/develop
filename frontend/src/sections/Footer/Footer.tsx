import { useTranslation } from '../../i18n';
import { GirihMark } from '../../components/GirihMark/GirihMark';
import styles from './Footer.module.css';

/**
 * Closing well. Keeps the site's indexable navigation — the section links
 * and the external Telegram handle — without restating the whole page.
 */
export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className={styles.footer}>
      <div className="shell">
        <div className={styles.inner}>
          <div>
            <a href="#top" className={styles.brand}>
              <GirihMark className={styles.brandMark} radius={0.24} weight={1} />
              akmal<span className={styles.brandDim}>.dev</span>
            </a>
            <p className={styles.tagline}>{t.footer.tagline}</p>
          </div>

          <div className={styles.cols}>
            <div>
              <p className={styles.colLabel}>{t.projects.label}</p>
              <ul className={styles.list}>
                <li>
                  <a href="#work">{t.nav.work}</a>
                </li>
                <li>
                  <a href="#approach">{t.nav.about}</a>
                </li>
                <li>
                  <a href="#process">{t.nav.process}</a>
                </li>
                <li>
                  <a href="#contact">{t.nav.contact}</a>
                </li>
              </ul>
            </div>

            <div>
              <p className={styles.colLabel}>{t.contact.label}</p>
              <ul className={styles.list}>
                <li>
                  <a href="https://t.me/akm0028" target="_blank" rel="noreferrer">
                    {t.footer.telegram} — @akm0028 ↗
                  </a>
                </li>
                <li>
                  <span>{t.footer.location}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <span>akmal.dev</span>
          <a href="#top" className={styles.toTop}>
            ↑ {t.footer.toTop}
          </a>
        </div>
      </div>
    </footer>
  );
}
