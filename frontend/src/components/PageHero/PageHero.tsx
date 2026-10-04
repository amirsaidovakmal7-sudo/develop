import type { ReactNode } from 'react';
import { Label } from '../ui/Label';
import { Reveal } from '../ui/Reveal';
import { MatterCanvas, type MatterVariant } from '../../scene/MatterCanvas';
import styles from './PageHero.module.css';

export function PageHero({
  label,
  title,
  titleSub,
  intro,
  matter,
  children,
}: {
  label: string;
  title: string;
  /** Second line of the H1 in the lead style: carries the search phrase under the big word. */
  titleSub?: string;
  intro: string;
  matter?: MatterVariant;
  children?: ReactNode;
}) {
  return (
    <section className={styles.hero}>
      <div className={`container ${styles.inner}`}>
        <Reveal className={styles.text}>
          <Label>{label}</Label>
          <h1 className={styles.title}>
            {title}
            {/* The space keeps the two lines separate words for crawlers; the block span hides it visually. */}
            {titleSub ? (
              <>
                {' '}
                <span className={styles.titleSub}>{titleSub}</span>
              </>
            ) : null}
          </h1>
          <p className={styles.intro}>{intro}</p>
          {children}
        </Reveal>
        {matter ? <MatterCanvas className={styles.knot} variant={matter} /> : null}
      </div>
    </section>
  );
}
