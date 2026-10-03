import type { ReactNode } from 'react';
import { Label } from '../ui/Label';
import { Reveal } from '../ui/Reveal';
import { MatterCanvas, type MatterVariant } from '../../scene/MatterCanvas';
import styles from './PageHero.module.css';

export function PageHero({
  label,
  title,
  intro,
  matter,
  children,
}: {
  label: string;
  title: string;
  intro: string;
  matter?: MatterVariant;
  children?: ReactNode;
}) {
  return (
    <section className={styles.hero}>
      <div className={`container ${styles.inner}`}>
        <Reveal className={styles.text}>
          <Label>{label}</Label>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.intro}>{intro}</p>
          {children}
        </Reveal>
        {matter ? <MatterCanvas className={styles.knot} variant={matter} /> : null}
      </div>
    </section>
  );
}
