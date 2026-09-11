import { motion, type Variants } from 'motion/react';
import { useTranslation } from '../../i18n';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import styles from './About.module.css';

const CAPABILITY_KEYS = [
  'capabilityFrontend',
  'capabilityBackend',
  'capabilityDatabase',
  'capabilityAutomation',
  'capabilityDeployment',
] as const;

// Pattern A — mask reveal: each headline line is clipped by `overflow:
// hidden` (see .line in the module CSS) while this inner span rises from
// below (REDIZIGN_TASK.md п.14/20 — "line reveal", distinct from Hero's
// per-word stagger and Stack's connect-in-order reveal).
const maskLine: Variants = {
  hidden: { y: '100%' },
  show: { y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

// Pattern D — stagger: capability rows list themselves in one at a time.
const listContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};

/** TECH_TASK_REDISIGN.md п.13: statement + short paragraph + capabilities, not a plain skills list. */
export function About() {
  const { t } = useTranslation();
  const reducedMotion = usePrefersReducedMotion();

  return (
    <section id="about" className={`${styles.about} section`}>
      <div className={styles.glow} aria-hidden="true" />
      <div className="container">
        <div className={styles.grid}>
          <div>
            <span className="section-label">{t.about.label}</span>
            <p className={styles.statement}>
              {reducedMotion ? (
                <>
                  <span className={styles.line}>{t.about.statementLine1}</span>
                  <span className={`${styles.line} ${styles.accent}`}>{t.about.statementLine2}</span>
                  <span className={styles.line}>{t.about.statementLine3}</span>
                </>
              ) : (
                <motion.span initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.5 }}>
                  <span className={styles.line}>
                    <motion.span variants={maskLine} style={{ display: 'block' }}>
                      {t.about.statementLine1}
                    </motion.span>
                  </span>
                  <span className={`${styles.line} ${styles.accent}`}>
                    <motion.span variants={maskLine} transition={{ delay: 0.06 }} style={{ display: 'block' }}>
                      {t.about.statementLine2}
                    </motion.span>
                  </span>
                  <span className={styles.line}>
                    <motion.span variants={maskLine} transition={{ delay: 0.12 }} style={{ display: 'block' }}>
                      {t.about.statementLine3}
                    </motion.span>
                  </span>
                </motion.span>
              )}
            </p>
            <motion.p
              className={styles.paragraph}
              variants={reducedMotion ? undefined : fadeUp}
              initial={reducedMotion ? undefined : 'hidden'}
              whileInView={reducedMotion ? undefined : 'show'}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ delay: 0.15 }}
            >
              {t.about.paragraph}
            </motion.p>
            <motion.a
              href="https://t.me/akm0028"
              target="_blank"
              rel="noreferrer"
              className={styles.cta}
              data-cursor="open"
              variants={reducedMotion ? undefined : fadeUp}
              initial={reducedMotion ? undefined : 'hidden'}
              whileInView={reducedMotion ? undefined : 'show'}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ delay: 0.22 }}
            >
              {t.about.cta} ↗
            </motion.a>
          </div>

          <motion.div
            className={styles.capabilities}
            variants={reducedMotion ? undefined : listContainer}
            initial={reducedMotion ? undefined : 'hidden'}
            whileInView={reducedMotion ? undefined : 'show'}
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className={styles.capabilitiesLabel}>{t.about.capabilitiesLabel}</div>
            <ul className={styles.capabilityList}>
              {CAPABILITY_KEYS.map((key, i) => (
                <motion.li key={key} className={styles.capabilityItem} variants={reducedMotion ? undefined : fadeUp}>
                  <span className={styles.capabilityIndex}>0{i + 1}</span>
                  {t.about[key]}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
