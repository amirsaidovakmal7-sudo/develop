import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { useTranslation } from '../../i18n';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { ensureGsapReady, ScrollTrigger } from '../../lib/gsapSetup';
import styles from './Process.module.css';

const STEP_KEYS = [
  { num: 'step1Num', title: 'step1Title', text: 'step1Text' },
  { num: 'step2Num', title: 'step2Title', text: 'step2Text' },
  { num: 'step3Num', title: 'step3Title', text: 'step3Text' },
  { num: 'step4Num', title: 'step4Title', text: 'step4Text' },
  { num: 'step5Num', title: 'step5Title', text: 'step5Text' },
] as const;

/** TECH_TASK_REDISIGN.md п.23: horizontal timeline that fills as the user scrolls, driven by GSAP ScrollTrigger. */
export function Process() {
  const { t } = useTranslation();
  const reducedMotion = usePrefersReducedMotion();
  const timelineRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (reducedMotion || !timelineRef.current) {
      setProgress(1);
      return;
    }
    ensureGsapReady();
    const trigger = ScrollTrigger.create({
      trigger: timelineRef.current,
      start: 'top 75%',
      end: 'bottom 60%',
      scrub: 0.4,
      onUpdate: (self) => setProgress(self.progress),
    });
    return () => trigger.kill();
  }, [reducedMotion]);

  const activeIndex = Math.min(STEP_KEYS.length - 1, Math.floor(progress * STEP_KEYS.length));

  return (
    <section id="process" className={`${styles.process} section`}>
      <div className="container">
        <motion.div
          initial={reducedMotion ? undefined : { opacity: 0, y: 20 }}
          whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="section-label">{t.process.label}</span>
          <h2 className={styles.title}>{t.process.title}</h2>
          <p className={styles.intro}>{t.process.intro}</p>
        </motion.div>

        <div className={styles.timeline} ref={timelineRef} style={{ ['--progress' as string]: progress }}>
          <div className={styles.track} />
          <div className={styles.trackFill} />
          {STEP_KEYS.map((step, i) => (
            <div key={step.num} className={`${styles.step} ${i <= activeIndex ? styles.active : ''}`}>
              <span className={styles.dot} />
              <div className={styles.num}>{t.process[step.num]}</div>
              <div className={styles.stepTitle}>{t.process[step.title]}</div>
              <p className={styles.stepText}>{t.process[step.text]}</p>
            </div>
          ))}
        </div>

        <p className={styles.note}>{t.process.note}</p>
      </div>
    </section>
  );
}
