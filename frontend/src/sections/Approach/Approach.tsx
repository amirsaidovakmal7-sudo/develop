import { useTranslation } from '../../i18n';
import { getCapabilityIcons } from '../../data/skillIcons';
import { Lines, Settle } from '../../components/Motion/Motion';
import { SectionMark } from '../../components/SectionMark/SectionMark';
import styles from './Approach.module.css';

/** Top to bottom: the path the positioning claims, in order. */
const LAYERS = [
  'capabilityFrontend',
  'capabilityBackend',
  'capabilityDatabase',
  'capabilityAutomation',
  'capabilityDeployment',
] as const;

/**
 * Who he is and what he actually operates.
 *
 * The capability list is ordered interface → server on purpose: read down,
 * it is the claim in the headline, and each row carries the real tools for
 * that layer rather than an invented proficiency percentage.
 *
 * A chip wall of every technology used to sit below this list. It repeated
 * the same tools without their context and told a prospective client
 * nothing they could act on, so it was removed rather than restyled; the
 * commercial facts that replaced it now have their own section.
 */
export function Approach() {
  const { t } = useTranslation();

  return (
    <section id="approach" className="section">
      <div className="shell">
        <SectionMark index="02" label={t.about.label} />

        <div className={styles.statementRow}>
          <Lines
            as="h2"
            className={styles.statement}
            step={100}
            lines={[t.hero.missionLine1, t.hero.missionLine2, t.hero.missionLine3]}
          />
          <Settle delay={160}>
            <p className={styles.paragraph}>{t.about.paragraph}</p>
            <a className={styles.telegram} href="https://t.me/akm0028" target="_blank" rel="noreferrer">
              {t.about.cta} ↗
            </a>
          </Settle>
        </div>

        <SectionMark index="02.1" label={t.about.capabilitiesLabel} className={styles.layersHead} />

        <ul className={styles.layers}>
          {LAYERS.map((key, i) => (
            <li key={key} className={styles.layer}>
              <span className={styles.layerNum}>L{String(i + 1).padStart(2, '0')}</span>
              <span className={styles.layerName}>{t.about[key]}</span>
              <span className={styles.tools}>
                {getCapabilityIcons(key).map((icon) => (
                  <span key={icon.id} className={styles.tool}>
                    <img className={styles.toolIcon} src={icon.src} alt="" width={18} height={18} loading="lazy" />
                    <span>{icon.title}</span>
                  </span>
                ))}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
