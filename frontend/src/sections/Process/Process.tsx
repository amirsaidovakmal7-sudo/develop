import { useEffect, useRef, useState } from 'react';
import { useTranslation } from '../../i18n';
import type { Translations } from '../../i18n/ru';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { Lines, Settle } from '../../components/Motion/Motion';
import { SectionMark } from '../../components/SectionMark/SectionMark';
import styles from './Process.module.css';

type ProcessDict = Translations['process'];
const STEPS = [1, 2, 3, 4, 5] as const;

/**
 * Five steps from brief to deploy.
 *
 * The rail fills with the reader's position through the section — one
 * rAF-throttled scroll read writing a transform, no per-frame React state
 * beyond the node count. With reduced motion the rail is simply drawn full,
 * so the sequence still reads as a path.
 */
export function Process() {
  const { t } = useTranslation();
  const reduced = usePrefersReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const [scrolled, setScrolled] = useState(0);
  // With reduced motion the rail is simply drawn full: the sequence still
  // reads as a path, it just does not follow the reader.
  const reached = reduced ? STEPS.length : scrolled;

  useEffect(() => {
    if (reduced) {
      if (fillRef.current) fillRef.current.style.transform = 'scaleY(1)';
      return;
    }

    let raf = 0;
    const update = () => {
      raf = 0;
      const el = trackRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      // Fills between the rail entering the lower third and leaving the top.
      const anchor = window.innerHeight * 0.62;
      const progress = Math.min(1, Math.max(0, (anchor - rect.top) / Math.max(rect.height, 1)));
      if (fillRef.current) fillRef.current.style.transform = `scaleY(${progress})`;
      setScrolled(Math.round(progress * STEPS.length));
    };

    const onScroll = () => {
      if (!raf) raf = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [reduced]);

  return (
    <section id="process" className="section">
      <div className="shell">
        <SectionMark index="04" label={t.process.label} />

        <div className={styles.head}>
          <Lines as="h2" className={styles.title} lines={[t.process.title]} />
          <Settle className={styles.intro} as="p" delay={120}>
            {t.process.intro}
          </Settle>
        </div>

        <div className={styles.track} ref={trackRef}>
          <span className={styles.rail} aria-hidden="true" />
          <span ref={fillRef} className={styles.fill} aria-hidden="true" />

          <ol className={styles.steps}>
            {STEPS.map((n, i) => (
              <li key={n} className={styles.step}>
                <span className={`${styles.node} ${i < reached ? styles.nodeReached : ''}`} aria-hidden="true" />
                <div>
                  <span className={styles.stepNum}>{t.process[`step${n}Num` as keyof ProcessDict]}</span>
                  <h3 className={styles.stepTitle}>{t.process[`step${n}Title` as keyof ProcessDict]}</h3>
                </div>
                <p className={styles.stepText}>{t.process[`step${n}Text` as keyof ProcessDict]}</p>
              </li>
            ))}
          </ol>
        </div>

      </div>
    </section>
  );
}
