import { useTranslation } from '../../i18n';
import type { Translations } from '../../i18n/ru';
import { Lines, Settle } from '../../components/Motion/Motion';
import { SectionMark } from '../../components/SectionMark/SectionMark';
import styles from './Terms.module.css';

type TermsDict = Translations['terms'];

const ITEMS = ['payment', 'ownership', 'hosting', 'revisions'] as const;

/**
 * The four commercial facts a client needs before they commit: who pays
 * what and when, who owns the result, what has to be bought separately, and
 * how changes are handled.
 *
 * Nothing here is new copy — these were already stated, but split between a
 * couple of process steps and a small note at the end of the section, which
 * is the last place someone deciding whether to hire you will look. Sitting
 * between the process and the order form, they answer the objection right
 * before the call to action.
 */
export function Terms() {
  const { t } = useTranslation();

  return (
    <section id="terms" className="section">
      <div className="shell">
        <SectionMark index="05" label={t.terms.label} />

        <div className={styles.head}>
          <Lines as="h2" className={styles.title} lines={[t.terms.title]} />
          <Settle className={styles.intro} as="p" delay={120}>
            {t.terms.intro}
          </Settle>
        </div>

        <dl className={styles.grid}>
          {ITEMS.map((item, i) => (
            <Settle key={item} className={styles.item} delay={i * 70} amount={0.25}>
              <span className={styles.num}>{String(i + 1).padStart(2, '0')}</span>
              <dt className={styles.itemTitle}>{t.terms[`${item}Title` as keyof TermsDict]}</dt>
              <dd className={styles.itemText}>{t.terms[`${item}Text` as keyof TermsDict]}</dd>
            </Settle>
          ))}
        </dl>
      </div>
    </section>
  );
}
