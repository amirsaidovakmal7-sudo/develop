import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { services } from '../../data/services';
import { useTranslation } from '../../i18n';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { ServiceStage } from './ServiceStage';
import styles from './Services.module.css';

const TITLE_KEY: Record<string, 'websitesTitle' | 'webappsTitle' | 'botsTitle' | 'backendTitle' | 'automationTitle'> = {
  websites: 'websitesTitle',
  webapps: 'webappsTitle',
  bots: 'botsTitle',
  backend: 'backendTitle',
  automation: 'automationTitle',
};
const DESC_KEY: Record<string, 'websitesDesc' | 'webappsDesc' | 'botsDesc' | 'backendDesc' | 'automationDesc'> = {
  websites: 'websitesDesc',
  webapps: 'webappsDesc',
  bots: 'botsDesc',
  backend: 'backendDesc',
  automation: 'automationDesc',
};

/**
 * TECH_TASK_REDISIGN.md п.15: large interactive list driving one shared
 * visual stage. REVISION 02 (REDIZIGN_TASK.md п.24): the description no
 * longer just snaps into view — it grows in height/opacity, and the active
 * title gets a touch of letter-spacing "expand" instead of only a color
 * change, so switching services reads as one continuous morph rather than
 * an instant state swap.
 */
export function Services() {
  const { t } = useTranslation();
  const reducedMotion = usePrefersReducedMotion();
  const [activeId, setActiveId] = useState(services[0].id);

  return (
    <section id="services" className={`${styles.services} section`}>
      <div className="container">
        <motion.div
          initial={reducedMotion ? undefined : { opacity: 0, y: 20 }}
          whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="section-label">{t.services.label}</span>
          <h2 className={styles.title}>{t.services.title}</h2>
        </motion.div>

        <motion.div
          className={styles.grid}
          initial={reducedMotion ? undefined : { opacity: 0, y: 24 }}
          whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className={styles.list}>
            {services.map((service) => {
              const active = service.id === activeId;
              return (
                <button
                  key={service.id}
                  type="button"
                  className={`${styles.item} ${active ? styles.active : ''}`}
                  onMouseEnter={() => setActiveId(service.id)}
                  onFocus={() => setActiveId(service.id)}
                  data-cursor="explore"
                >
                  <span className={styles.num}>{service.num}</span>
                  <span>
                    <span className={styles.itemTitle}>{t.services[TITLE_KEY[service.id]]}</span>
                    <AnimatePresence initial={false}>
                      {active && (
                        <motion.span
                          className={styles.itemDescClip}
                          initial={reducedMotion ? undefined : { height: 0, opacity: 0 }}
                          animate={reducedMotion ? undefined : { height: 'auto', opacity: 1 }}
                          exit={reducedMotion ? undefined : { height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                          style={{ display: 'block' }}
                        >
                          <span className={styles.itemDesc}>{t.services[DESC_KEY[service.id]]}</span>
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </span>
                </button>
              );
            })}
          </div>

          <ServiceStage activeId={activeId} />
        </motion.div>
      </div>
    </section>
  );
}
