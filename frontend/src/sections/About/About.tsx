import { useTranslation } from '../../i18n';
import styles from './About.module.css';

const CAPABILITY_KEYS = [
  'capabilityFrontend',
  'capabilityBackend',
  'capabilityDatabase',
  'capabilityAutomation',
  'capabilityDeployment',
] as const;

/** TECH_TASK_REDISIGN.md п.13: statement + short paragraph + capabilities, not a plain skills list. */
export function About() {
  const { t } = useTranslation();

  return (
    <section id="about" className={`${styles.about} section`}>
      <div className={styles.glow} aria-hidden="true" />
      <div className="container">
        <div className={styles.grid}>
          <div>
            <span className="section-label">{t.about.label}</span>
            <p className={styles.statement}>
              <span>{t.about.statementLine1}</span>
              <span className={styles.accent}>{t.about.statementLine2}</span>
              <span>{t.about.statementLine3}</span>
            </p>
            <p className={styles.paragraph}>{t.about.paragraph}</p>
            <a href="https://t.me/akm0028" target="_blank" rel="noreferrer" className={styles.cta} data-cursor="open">
              {t.about.cta} ↗
            </a>
          </div>

          <div className={styles.capabilities}>
            <div className={styles.capabilitiesLabel}>{t.about.capabilitiesLabel}</div>
            <ul className={styles.capabilityList}>
              {CAPABILITY_KEYS.map((key, i) => (
                <li key={key} className={styles.capabilityItem}>
                  <span className={styles.capabilityIndex}>0{i + 1}</span>
                  {t.about[key]}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
