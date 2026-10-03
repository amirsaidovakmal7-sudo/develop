import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from '../../i18n';
import type { ProjectDefinition } from '../../data/projects';
import { getProjectImages, getProjectPoster, getProjectVideos } from '../../lib/projectMedia';
import { useProjectCopy } from '../../lib/useProjectCopy';
import { Button } from '../ui/Button';
import { BrowserFrame, frameLabel } from '../BrowserFrame/BrowserFrame';
import styles from './CaseView.module.css';

type Props = {
  list: ProjectDefinition[];
  index: number | null;
  onClose: () => void;
  onStep: (delta: number) => void;
};

function Body({ project, num, total }: { project: ProjectDefinition; num: number; total: number }) {
  const { t } = useTranslation();
  const copy = useProjectCopy(project);
  const images = getProjectImages(project.id);
  const videos = getProjectVideos(project.id);
  const poster = getProjectPoster(project.id);

  return (
    <div className={styles.body}>
      <header className={styles.head}>
        <p className={styles.meta}>
          <span>
            {String(num).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </span>
          <span aria-hidden="true">·</span>
          <span>{copy.category}</span>
          <span aria-hidden="true">·</span>
          <span className={project.status === 'live' ? styles.live : undefined}>{copy.status}</span>
        </p>
        <h2 id="case-title" className={styles.title}>
          {copy.title}
        </h2>
        <p className={styles.subtitle}>{copy.subtitle}</p>
      </header>

      <div className={styles.grid}>
        <div>
          <h3 className={styles.kicker}>{t.projects.doneLabel}</h3>
          <p className={styles.text}>{copy.description}</p>
        </div>
        <div>
          <h3 className={styles.kicker}>{t.projects.featuresLabel}</h3>
          <ul className={styles.features}>
            {copy.features.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          <div className={styles.actions}>
            {project.url ? (
              <Button href={project.url} arrow="↗">
                {t.projects.openSite}
              </Button>
            ) : (
              <span className={styles.noLink}>{t.projects.noLink}</span>
            )}
          </div>
        </div>
      </div>

      <section className={styles.media} aria-label={videos.length ? t.projects.videoLabel : t.projects.mediaLabel}>
        {videos.map((src) => (
          <BrowserFrame key={src} label={frameLabel(project)}>
            <video className={styles.shot} src={src} poster={poster?.src} controls playsInline preload="none" />
          </BrowserFrame>
        ))}
        {images.map((img) => (
          <BrowserFrame key={img.src} label={frameLabel(project)}>
            <img
              className={styles.shot}
              src={img.src}
              width={img.width}
              height={img.height}
              alt={copy.title}
              loading="lazy"
              decoding="async"
            />
          </BrowserFrame>
        ))}
      </section>
    </div>
  );
}

export function CaseView({ list, index, onClose, onStep }: Props) {
  const { t } = useTranslation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const open = index !== null;

  useEffect(() => {
    if (!open) return;
    const prevFocus = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onStep(1);
      if (e.key === 'ArrowLeft') onStep(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
      prevFocus?.focus();
    };
  }, [open, onClose, onStep]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [index]);

  if (index === null) return null;
  const project = list[index];

  return createPortal(
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-labelledby="case-title">
      <button type="button" className={styles.backdrop} aria-label={t.common.close} tabIndex={-1} onClick={onClose} />
      <div className={styles.sheet}>
        <div className={styles.bar}>
          <div className={styles.nav}>
            <button type="button" onClick={() => onStep(-1)} aria-label={t.common.prev}>
              ←
            </button>
            <button type="button" onClick={() => onStep(1)} aria-label={t.common.next}>
              →
            </button>
          </div>
          <button ref={closeRef} type="button" className={styles.close} onClick={onClose} aria-label={t.common.close}>
            ✕
          </button>
        </div>
        <div ref={scrollRef} className={styles.scroll}>
          <Body key={project.id} project={project} num={index + 1} total={list.length} />
        </div>
      </div>
    </div>,
    document.body,
  );
}
