import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, type Variants } from 'motion/react';
import { projects, type ProjectDefinition } from '../../data/projects';
import { getProjectImages, getProjectVideos } from '../../lib/projectMedia';
import { useProjectCopy } from '../../lib/useProjectCopy';
import { useTranslation } from '../../i18n';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { useIsTouchDevice } from '../../hooks/useIsTouchDevice';
import { ensureGsapReady, ScrollTrigger } from '../../lib/gsapSetup';
import styles from './FeaturedWork.module.css';

const featured = projects.filter((p) => p.featured);

// One distinct entrance/exit per stage (REDIZIGN_TASK.md п.28) — each
// belongs to the same family (opacity + a single transform axis) so the
// sequence reads as one motion system, not four unrelated effects.
const STAGE_VARIANTS: Variants[] = [
  { enter: { opacity: 0, y: 60, scale: 0.96 }, center: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: -50, scale: 0.97 } },
  { enter: { opacity: 0, x: 140 }, center: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -140 } },
  { enter: { opacity: 0, scale: 0.72 }, center: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 1.12 } },
  { enter: { opacity: 0, y: 90 }, center: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -70 } },
];

function StageMedia({ project, onOpen }: { project: ProjectDefinition; onOpen: () => void }) {
  const copy = useProjectCopy(project);
  const images = getProjectImages(project.id);
  const videos = getProjectVideos(project.id);
  const isVideo = images.length === 0 && videos.length > 0;
  const src = isVideo ? videos[0] : images[0];

  return (
    <div className={styles.media} onClick={onOpen} data-cursor="view" role="button" tabIndex={0} aria-label={copy.title}>
      {isVideo ? (
        <video src={src} muted loop playsInline autoPlay preload="metadata" />
      ) : (
        <img src={src} alt={copy.title} loading="lazy" />
      )}
    </div>
  );
}

function StageText({
  project,
  index,
  onOpen,
}: {
  project: ProjectDefinition;
  index: number;
  onOpen: () => void;
}) {
  const { t } = useTranslation();
  const copy = useProjectCopy(project);

  return (
    <div>
      <div className={styles.index}>{String(index + 1).padStart(2, '0')}</div>
      <span className={styles.tag}>{copy.categoryLabel}</span>
      <h3 className={styles.projectTitle}>{copy.title}</h3>
      <p className={styles.subtitle}>{copy.subtitle}</p>
      <p className={styles.description}>{copy.description}</p>
      <div className={styles.actions}>
        <button type="button" className={styles.viewCase} onClick={onOpen} data-cursor="open">
          {t.projects.viewCase}
        </button>
        {project.url ? (
          <a href={project.url} target="_blank" rel="noreferrer" className={styles.openSite} data-cursor="open">
            {t.projects.openSite} ↗
          </a>
        ) : (
          <span className={styles.openSite}>{t.projects.noLiveLink}</span>
        )}
      </div>
    </div>
  );
}

function Stage({ project, index, onOpen }: { project: ProjectDefinition; index: number; onOpen: () => void }) {
  const reverse = index % 2 === 1;
  return (
    <div className={`${styles.stage} ${reverse ? styles.reverse : ''}`}>
      <StageMedia project={project} onOpen={onOpen} />
      <div className={styles.textCol}>
        <StageText project={project} index={index} onOpen={onOpen} />
      </div>
    </div>
  );
}

interface FeaturedWorkProps {
  onOpen: (project: ProjectDefinition) => void;
}

/**
 * Sticky, scroll-driven "Selected Work" sequence for the 4 flagship
 * projects (REDIZIGN_TASK.md п.25-33): one project fills the pinned stage
 * at a time, with a distinct transition per project, a progress indicator,
 * and scroll driving which one is active. GSAP ScrollTrigger owns the
 * pin/scroll-index mapping; Motion owns the actual stage transition —
 * matches the "one system per animation type" rule (п.36).
 *
 * Pinning is skipped for touch devices and prefers-reduced-motion — both
 * get the same 4 stages as a normal stacked, individually-revealed list
 * instead, so scroll is never forced/hijacked there (п.34).
 */
export function FeaturedWork({ onOpen }: FeaturedWorkProps) {
  const { t } = useTranslation();
  const reducedMotion = usePrefersReducedMotion();
  const isTouch = useIsTouchDevice();
  const pinned = !reducedMotion && !isTouch;

  const outerRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!pinned || !outerRef.current) return;
    ensureGsapReady();
    const el = outerRef.current;
    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top top',
      end: `+=${featured.length * 85}%`,
      pin: true,
      pinSpacing: true,
      scrub: 0.35,
      onUpdate: (self) => {
        setIndex(Math.min(featured.length - 1, Math.floor(self.progress * featured.length)));
      },
    });
    return () => trigger.kill();
  }, [pinned]);

  return (
    <div className={styles.wrap}>
      <div className="container">
        <div className={styles.header}>
          <span className="section-label">{t.projects.label}</span>
          <h2 className={styles.title}>{t.projects.title}</h2>
          <p className={styles.intro}>{t.projects.intro}</p>
        </div>
      </div>

      {pinned ? (
        <div ref={outerRef} className={styles.stageOuter}>
          <div className="container">
            <div className={styles.progress}>
              <span aria-hidden="true">{t.projects.progressLabel}</span>
              <span className={styles.progressCount}>
                {String(index + 1).padStart(2, '0')} / {String(featured.length).padStart(2, '0')}
              </span>
              <span className={styles.dots}>
                {featured.map((p, i) => (
                  <span key={p.id} className={`${styles.dot} ${i === index ? styles.active : ''}`} />
                ))}
              </span>
            </div>
            <AnimatePresence mode="wait" custom={index}>
              <motion.div
                key={featured[index].id}
                variants={STAGE_VARIANTS[index % STAGE_VARIANTS.length]}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              >
                <Stage project={featured[index]} index={index} onOpen={() => onOpen(featured[index])} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      ) : (
        featured.map((project, i) => (
          <div key={project.id} className={`${styles.stageOuter} ${styles.static}`}>
            <div className="container">
              <motion.div
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <Stage project={project} index={i} onOpen={() => onOpen(project)} />
              </motion.div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
