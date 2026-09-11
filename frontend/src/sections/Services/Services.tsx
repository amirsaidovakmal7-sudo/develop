import { useState } from 'react';
import { services } from '../../data/services';
import { useTranslation } from '../../i18n';
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

/** TECH_TASK_REDISIGN.md п.15: large interactive list driving one shared visual stage. */
export function Services() {
  const { t } = useTranslation();
  const [activeId, setActiveId] = useState(services[0].id);

  return (
    <section id="services" className={`${styles.services} section`}>
      <div className="container">
        <span className="section-label">{t.services.label}</span>
        <h2 className={styles.title}>{t.services.title}</h2>

        <div className={styles.grid}>
          <div className={styles.list}>
            {services.map((service) => (
              <button
                key={service.id}
                type="button"
                className={`${styles.item} ${service.id === activeId ? styles.active : ''}`}
                onMouseEnter={() => setActiveId(service.id)}
                onFocus={() => setActiveId(service.id)}
                data-cursor="explore"
              >
                <span className={styles.num}>{service.num}</span>
                <span>
                  <span className={styles.itemTitle}>{t.services[TITLE_KEY[service.id]]}</span>
                  <span className={styles.itemDesc}>{t.services[DESC_KEY[service.id]]}</span>
                </span>
              </button>
            ))}
          </div>

          <ServiceStage activeId={activeId} />
        </div>
      </div>
    </section>
  );
}
