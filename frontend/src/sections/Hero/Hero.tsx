import { useTranslation } from '../../i18n';
import { Lines, Settle } from '../../components/Motion/Motion';
import { ButtonLink } from '../../components/Button/Button';
import { projects } from '../../data/projects';
import styles from './Hero.module.css';

/**
 * The hero states the one thing that distinguishes this developer — that a
 * single person owns the path from interface to server — and puts the
 * verifiable facts beside it in the mono voice.
 *
 * There is no separate hero graphic: the girih field behind the page is
 * already at full presence here and recedes as the reader descends, so the
 * first screen is the same space as the rest of the site rather than a
 * detachable splash.
 */
export function Hero() {
  const { t } = useTranslation();

  const spec: [string, string][] = [
    [t.hero.specLocation, t.footer.location],
    [t.hero.specStack, 'Python · Django · React'],
    [t.hero.specProjects, String(projects.length)],
    [t.hero.specLanguages, 'RU · UZ · EN'],
  ];

  return (
    <section id="top" className={styles.hero}>
      <div className="shell">
        <div className={styles.grid}>
          <div>
            <Settle className={styles.status} as="p">
              <span className={styles.dot} aria-hidden="true" />
              {t.hero.badge}
              <span className={styles.role}>— {t.hero.roleLine}</span>
            </Settle>

            <Lines
              as="h1"
              className={styles.statement}
              step={110}
              delay={120}
              lines={[
                t.about.statementLine1,
                t.about.statementLine2,
                <span key="accent" className={styles.accentLine}>
                  {t.about.statementLine3}
                </span>,
              ]}
            />

            <Settle className={styles.lead} as="p" delay={520}>
              {t.hero.description}
            </Settle>

            <Settle className={styles.actions} delay={620}>
              <ButtonLink href="#work" variant="primary">
                {t.hero.ctaWork}
              </ButtonLink>
              <ButtonLink href="#contact" variant="ghost">
                {t.hero.ctaOrder}
              </ButtonLink>
            </Settle>
          </div>

          <Settle className={styles.spec} delay={700} as="dl">
            {spec.map(([key, value]) => (
              <div key={key} className={styles.specRow}>
                <dt className={styles.specKey}>{key}</dt>
                <dd className={styles.specValue}>{value}</dd>
              </div>
            ))}
          </Settle>
        </div>
      </div>

      <div className={styles.hintWrap} aria-hidden="true">
        <div className="shell">
          <p className={styles.hint}>
            <span className={styles.hintLine} />
            {t.common.scrollHint}
          </p>
        </div>
      </div>
    </section>
  );
}
