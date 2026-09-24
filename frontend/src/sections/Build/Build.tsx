import { services } from '../../data/services';
import { useTranslation } from '../../i18n';
import type { Translations } from '../../i18n/ru';
import { Lines, Settle } from '../../components/Motion/Motion';
import { SectionMark } from '../../components/SectionMark/SectionMark';
import styles from './Build.module.css';

type ServicesDict = Translations['services'];

/** What he builds — the five offers, read as a list rather than a card grid. */
export function Build() {
  const { t } = useTranslation();

  return (
    <section id="build" className="section">
      <div className="shell">
        <SectionMark index="03" label={t.services.label} />

        <Lines as="h2" className={styles.title} lines={[t.services.title]} />

        <ul className={styles.list}>
          {services.map((service, i) => (
            <Settle as="li" key={service.id} className={styles.row} delay={i * 60} amount={0.3}>
              <span className={styles.num}>{service.num}</span>
              <h3 className={styles.name}>{t.services[`${service.i18nKey}Title` as keyof ServicesDict]}</h3>
              <p className={styles.desc}>{t.services[`${service.i18nKey}Desc` as keyof ServicesDict]}</p>
            </Settle>
          ))}
        </ul>
      </div>
    </section>
  );
}
