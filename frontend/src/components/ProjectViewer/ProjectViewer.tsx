import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import type { ProjectDefinition } from '../../data/projects';
import { getProjectImages, getProjectVideos } from '../../lib/projectMedia';
import { useProjectCopy } from '../../lib/useProjectCopy';
import { useTranslation } from '../../i18n';
import styles from './ProjectViewer.module.css';

interface ProjectViewerProps {
  project: ProjectDefinition | null;
  onClose: () => void;
}

/**
 * Immersive case-study viewer (TECH_TASK_REDISIGN.md п.22/52): body freeze,
 * background dim, gallery + metadata + live link, closes back to page
 * context (no full navigation/routing involved).
 */
export function ProjectViewer({ project, onClose }: ProjectViewerProps) {
  const { t } = useTranslation();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [project]);

  useEffect(() => {
    if (!project) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') setIndex((i) => Math.max(0, i - 1));
      if (e.key === 'ArrowRight') setIndex((i) => i + 1);
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    };
  }, [project, onClose]);

  if (!project) return null;

  const images = getProjectImages(project.id);
  const videos = getProjectVideos(project.id);
  const media: { src: string; isVideo: boolean }[] = [
    ...images.map((src) => ({ src, isVideo: false })),
    ...videos.map((src) => ({ src, isVideo: true })),
  ];
  const current = media[Math.min(index, media.length - 1)];

  return (
    <ProjectViewerContent
      project={project}
      onClose={onClose}
      media={media}
      current={current}
      index={index}
      setIndex={setIndex}
      t={t}
    />
  );
}

function ProjectViewerContent({
  project,
  onClose,
  media,
  current,
  index,
  setIndex,
  t,
}: {
  project: ProjectDefinition;
  onClose: () => void;
  media: { src: string; isVideo: boolean }[];
  current: { src: string; isVideo: boolean } | undefined;
  index: number;
  setIndex: (updater: (i: number) => number) => void;
  t: ReturnType<typeof useTranslation>['t'];
}) {
  const copy = useProjectCopy(project);

  return (
    <AnimatePresence>
      <motion.div
        className={styles.backdrop}
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label={copy.title}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
      >
        <motion.div
          className={styles.panel}
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 10 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label={t.common.ariaClose} data-cursor="close">
            ✕
          </button>

          <div className={styles.gallery}>
            {current &&
              (current.isVideo ? (
                <video src={current.src} controls autoPlay muted loop playsInline />
              ) : (
                <img src={current.src} alt={copy.title} />
              ))}
            {media.length > 1 && (
              <>
                <button
                  type="button"
                  className={`${styles.galleryNav} ${styles.prev}`}
                  aria-label={t.common.ariaPrev}
                  onClick={() => setIndex((i) => (i - 1 + media.length) % media.length)}
                >
                  ←
                </button>
                <button
                  type="button"
                  className={`${styles.galleryNav} ${styles.next}`}
                  aria-label={t.common.ariaNext}
                  onClick={() => setIndex((i) => (i + 1) % media.length)}
                >
                  →
                </button>
                <span className={styles.counter}>
                  {index + 1} / {media.length}
                </span>
              </>
            )}
          </div>

          <div className={styles.body}>
            <span className={styles.tag}>{copy.categoryLabel}</span>
            <h3 className={styles.title}>{copy.title}</h3>
            <p className={styles.subtitle}>{copy.subtitle}</p>
            <p className={styles.description}>{copy.description}</p>

            <dl className={styles.metaTable}>
              <dt>{t.projects.metaType}</dt>
              <dd>{copy.categoryLabel}</dd>
              <dt>{t.projects.metaRole}</dt>
              <dd>{t.projects.roleSolo}</dd>
              <dt>{t.projects.metaStack}</dt>
              <dd>{project.technologies.join(', ')}</dd>
              {copy.features.length > 0 && (
                <>
                  <dt>{t.projects.metaFeatures}</dt>
                  <dd>{copy.features.join(', ')}</dd>
                </>
              )}
              <dt>{t.projects.metaStatus}</dt>
              <dd>{copy.statusLabel}</dd>
            </dl>

            {project.url && (
              <a href={project.url} target="_blank" rel="noreferrer" className={styles.liveLink} data-cursor="open">
                {t.projects.openSite} ↗
              </a>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
