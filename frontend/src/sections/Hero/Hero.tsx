import { lazy, Suspense, useRef } from 'react';
import { motion, useScroll, useTransform, type Variants } from 'motion/react';
import { useTranslation } from '../../i18n';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import styles from './Hero.module.css';

// three.js/R3F pull in a large chunk — split it out of the main bundle so it
// streams in after first paint instead of blocking it (TECH_TASK_REDISIGN.md п.72).
const HeroScene = lazy(() => import('../../scenes/HeroScene/HeroScene').then((m) => ({ default: m.HeroScene })));

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};

const rise: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

export function Hero() {
  const { t } = useTranslation();
  const reducedMotion = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  // Scroll-based hero transition (REDIZIGN_TASK.md п.18): the headline
  // settles/fades/lifts slightly as the user starts scrolling away, instead
  // of just disappearing under the next section — a cheap motion-value
  // transform, not a per-frame React state update.
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const innerOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0.15]);
  const innerY = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const innerScale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);

  return (
    <section id="hero" ref={sectionRef} className={styles.hero}>
      <div className={styles.grid} aria-hidden="true" />
      <div className={styles.grain} aria-hidden="true" />
      <Suspense fallback={null}>
        <HeroScene containerRef={sectionRef} />
      </Suspense>

      <motion.div
        className={styles.inner}
        variants={reducedMotion ? undefined : container}
        initial={reducedMotion ? undefined : 'hidden'}
        animate={reducedMotion ? undefined : 'show'}
        style={reducedMotion ? undefined : { opacity: innerOpacity, y: innerY, scale: innerScale }}
      >
        <motion.div variants={reducedMotion ? undefined : rise} className={styles.badge}>
          <span className={styles.badgeDot} />
          {t.hero.badge}
        </motion.div>

        <h1>
          <motion.span variants={reducedMotion ? undefined : rise} className={styles.role}>
            {t.hero.roleLine}
          </motion.span>
          <span className={styles.mission}>
            <motion.span variants={reducedMotion ? undefined : rise} className={styles.line}>
              {t.hero.missionLine1}
            </motion.span>
            <motion.span variants={reducedMotion ? undefined : rise} className={styles.line}>
              {t.hero.missionLine2}
            </motion.span>
            <motion.span variants={reducedMotion ? undefined : rise} className={`${styles.line} ${styles.gradient}`}>
              {t.hero.missionLine3}
            </motion.span>
          </span>
        </h1>

        <motion.p variants={reducedMotion ? undefined : rise} className={styles.tagline}>
          {t.hero.tagline}
        </motion.p>

        <motion.p variants={reducedMotion ? undefined : rise} className={styles.description}>
          {t.hero.description}
        </motion.p>

        <motion.div variants={reducedMotion ? undefined : rise} className={styles.actions}>
          <a href="#work" className={styles.btnPrimary} data-cursor="view">
            {t.hero.ctaWork}
            <span className={styles.arrow} aria-hidden="true">
              →
            </span>
          </a>
          <a href="#contact" className={styles.btnGhost} data-cursor="explore">
            {t.hero.ctaOrder}
            <span className={styles.arrow} aria-hidden="true">
              →
            </span>
          </a>
        </motion.div>
      </motion.div>

      <div className={styles.scrollHint}>
        <span className={styles.scrollLine} />
        {t.common.scrollHint}
      </div>
    </section>
  );
}
