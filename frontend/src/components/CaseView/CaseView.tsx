import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { projects } from '../../data/projects';
import { useTranslation } from '../../i18n';
import { useProjectCopy } from '../../lib/useProjectCopy';
import { getProjectImages, getProjectPoster, getProjectVideos } from '../../lib/projectMedia';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { ButtonLink } from '../Button/Button';
import styles from './CaseView.module.css';

interface CaseViewProps {
  /** Index into `projects`, or null when closed. */
  index: number | null;
  onClose: () => void;
  onStep: (delta: number) => void;
}

function CaseBody({
  index,
  onClose,
  onStep,
  scrollRef,
}: {
  index: number;
  onClose: () => void;
  onStep: (d: number) => void;
  scrollRef: React.RefObject<HTMLDivElement | null>;
}) {
  const { t } = useTranslation();
  const project = projects[index];
  const copy = useProjectCopy(project);
  const images = getProjectImages(project.id);
  const videos = getProjectVideos(project.id);
  const poster = getProjectPoster(project.id);

  const prev = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];
  const prevCopy = useProjectCopy(prev);
  const nextCopy = useProjectCopy(next);

  // Stepping to another case should start that case at the top.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [index, scrollRef]);

  const num = String(index + 1).padStart(2, '0');
  const total = String(projects.length).padStart(2, '0');

  return (
    <>
      <div className={styles.bar}>
        <span className={styles.barNum}>
          {num} / {total}
        </span>
        <span className={styles.barTitle}>{copy.title}</span>
        <button
          type="button"
          className={styles.iconBtn}
          onClick={() => onStep(-1)}
          aria-label={t.common.ariaPrev}
        >
          ←
        </button>
        <button
          type="button"
          className={styles.iconBtn}
          onClick={() => onStep(1)}
          aria-label={t.common.ariaNext}
        >
          →
        </button>
        <button type="button" className={styles.iconBtn} onClick={onClose} aria-label={t.common.ariaClose}>
          ✕
        </button>
      </div>

      <div className={styles.body}>
        <div className={styles.head}>
          <div>
            <h2 id="case-title" className={styles.title}>
              {copy.title}
            </h2>
            <p className={styles.subtitle}>{copy.subtitle}</p>
            <p className={styles.description}>{copy.description}</p>
            <div className={styles.actions}>
              {project.url ? (
                <ButtonLink href={project.url} external variant="primary" arrow="↗">
                  {t.projects.openSite}
                </ButtonLink>
              ) : (
                <span className={styles.noLink}>{t.projects.noLiveLink}</span>
              )}
            </div>
          </div>

          <dl className={styles.meta}>
            <div className={styles.metaRow}>
              <dt className={styles.metaKey}>{t.projects.metaType}</dt>
              <dd className={styles.metaValue}>{copy.categoryLabel}</dd>
            </div>
            <div className={styles.metaRow}>
              <dt className={styles.metaKey}>{t.projects.metaRole}</dt>
              <dd className={styles.metaValue}>{t.projects.roleSolo}</dd>
            </div>
            <div className={styles.metaRow}>
              <dt className={styles.metaKey}>{t.projects.metaStack}</dt>
              <dd className={styles.metaValue}>
                <span className={styles.chips}>
                  {project.technologies.map((tech) => (
                    <span key={tech} className={styles.chip}>
                      {tech}
                    </span>
                  ))}
                </span>
              </dd>
            </div>
            <div className={styles.metaRow}>
              <dt className={styles.metaKey}>{t.projects.metaFeatures}</dt>
              <dd className={styles.metaValue}>
                <ul className={styles.features}>
                  {copy.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
              </dd>
            </div>
            <div className={styles.metaRow}>
              <dt className={styles.metaKey}>{t.projects.metaStatus}</dt>
              <dd className={`${styles.metaValue} ${project.status === 'live' ? styles.statusLive : ''}`}>
                {copy.statusLabel}
              </dd>
            </div>
          </dl>
        </div>

        <p className={styles.mediaNote}>
          {t.projects.mediaLabel} — {images.length + videos.length}
        </p>

        <div className={styles.media}>
          {images.map((image, i) => (
            <figure key={image.src} className={styles.shot}>
              <img
                src={image.src}
                width={image.width}
                height={image.height}
                alt={`${copy.title} — ${i + 1}`}
                loading={i === 0 ? 'eager' : 'lazy'}
                decoding="async"
              />
            </figure>
          ))}
          {videos.map((src, i) => (
            <figure key={src} className={styles.clip}>
              {/* These recordings are 38 MB and up. `preload="none"` behind a
                  captured poster means nothing downloads until the visitor
                  actually presses play. */}
              <video
                src={src}
                poster={i === 0 && images.length === 0 && poster ? poster.src : undefined}
                controls
                muted
                loop
                playsInline
                preload="none"
                aria-label={`${copy.title} — ${images.length + i + 1}`}
              />
            </figure>
          ))}
        </div>

        <nav className={styles.next} aria-label={t.projects.label}>
          <button type="button" className={`${styles.nextLink} ${styles.prevLink}`} onClick={() => onStep(-1)}>
            <span className={styles.nextLabel}>← {t.projects.prevCase}</span>
            {prevCopy.title}
          </button>
          <button type="button" className={styles.nextLink} onClick={() => onStep(1)}>
            <span className={styles.nextLabel}>{t.projects.nextCase} →</span>
            {nextCopy.title}
          </button>
        </nav>
      </div>
    </>
  );
}

/**
 * Full-screen case view.
 *
 * The deliberate difference from the stage: here the screenshots are shown
 * at full width and uncropped, because in the index they are compositional
 * and here they are evidence. Arrow keys and the bar controls walk the
 * catalogue without going back to the list, which is what someone actually
 * does when they start looking at the work.
 */
export function CaseView({ index, onClose, onStep }: CaseViewProps) {
  const reduced = usePrefersReducedMotion();
  const open = index !== null;
  const restoreFocus = useRef<HTMLElement | null>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  // `shown` is the last index that was open, kept alive through the closing
  // transition so the panel fades out with its content still in it. Updating
  // it during render (rather than from an effect) means the new case is
  // already correct on the first paint after a step.
  const [shown, setShown] = useState<number | null>(index);
  const [entered, setEntered] = useState(false);
  if (open && shown !== index) setShown(index);
  const visible = open && entered;

  // Mount first, flip the class on the next frame: the browser needs a start
  // value to transition from.
  useEffect(() => {
    if (!open) return;
    const raf = window.requestAnimationFrame(() => setEntered(true));
    return () => {
      window.cancelAnimationFrame(raf);
      setEntered(false);
    };
  }, [open]);

  // Unmount once the fade-out has played.
  useEffect(() => {
    if (open || shown === null) return;
    const timer = window.setTimeout(() => setShown(null), reduced ? 0 : 280);
    return () => window.clearTimeout(timer);
  }, [open, shown, reduced]);

  useEffect(() => {
    if (!open) return;

    restoreFocus.current = document.activeElement as HTMLElement | null;
    document.body.classList.add('is-locked');

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onStep(1);
      if (e.key === 'ArrowLeft') onStep(-1);
      if (e.key !== 'Tab') return;

      // Keep Tab inside the overlay — the page behind it is inert while open.
      const focusables = shellRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), video[controls], [tabindex]:not([tabindex="-1"])',
      );
      if (!focusables?.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKey);
    // Move focus into the overlay so the first Tab lands inside it.
    const timer = window.setTimeout(() => {
      shellRef.current?.querySelector<HTMLElement>('button, a[href]')?.focus();
    }, 60);

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.classList.remove('is-locked');
      window.clearTimeout(timer);
      restoreFocus.current?.focus();
    };
  }, [open, onClose, onStep]);

  if (shown === null) return null;

  // Portalled to <body> deliberately: the work section is a positioned,
  // z-indexed block, so rendering the dialog inside it would trap it in that
  // stacking context and the fixed header would paint over the close button.
  return createPortal(
    <div
      ref={shellRef}
      className={`${styles.backdrop} ${visible ? styles.backdropOpen : ''}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="case-title"
    >
      <CaseBody index={shown} onClose={onClose} onStep={onStep} scrollRef={shellRef} />
    </div>,
    document.body,
  );
}
