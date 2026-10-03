import { useEffect, useRef, useState } from 'react';
import { useTranslation } from '../../i18n';
import type { ProjectDefinition } from '../../data/projects';
import { getProjectImages, getProjectPoster, getProjectVideos } from '../../lib/projectMedia';
import { useProjectCopy } from '../../lib/useProjectCopy';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { BrowserFrame, frameLabel } from '../BrowserFrame/BrowserFrame';
import { Button } from '../ui/Button';
import styles from './ProjectStack.module.css';

const SLIDE_MS = 2600;

function Screens({ project, playing }: { project: ProjectDefinition; playing: boolean }) {
  const images = getProjectImages(project.id);
  const poster = getProjectPoster(project.id);
  const frames = images.length ? images : poster ? [poster] : [];
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    if (!playing || frames.length < 2) return;
    const id = window.setInterval(() => setSlide((s) => (s + 1) % frames.length), SLIDE_MS);
    return () => window.clearInterval(id);
  }, [playing, frames.length]);

  return (
    <>
      <span className={styles.screens}>
        {frames.map((img, i) => (
          <img
            key={img.src}
            src={img.src}
            width={img.width}
            height={img.height}
            alt=""
            loading="lazy"
            decoding="async"
            className={i === slide ? styles.shown : undefined}
          />
        ))}
        {getProjectVideos(project.id).length ? (
          <span className={styles.play} aria-hidden="true">
            ▶
          </span>
        ) : null}
      </span>
      {frames.length > 1 ? (
        <span className={styles.dots} aria-hidden="true">
          {frames.map((_, i) => (
            <i key={i} className={i === slide ? styles.dotOn : undefined} />
          ))}
        </span>
      ) : null}
    </>
  );
}

function Card({
  project,
  i,
  total,
  active,
  onOpen,
  setRef,
}: {
  project: ProjectDefinition;
  i: number;
  total: number;
  active: boolean;
  onOpen: () => void;
  setRef: (el: HTMLElement | null) => void;
}) {
  const { t } = useTranslation();
  const copy = useProjectCopy(project);
  return (
    <article ref={setRef} className={styles.card} style={{ ['--i' as string]: i }} aria-label={copy.title}>
      <div className={styles.inner}>
        <div className={styles.info}>
          <p className={styles.meta}>
            <span className={styles.count}>
              {String(i + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </span>
            <span>{copy.category}</span>
            <span className={project.status === 'live' ? styles.live : undefined}>{copy.status}</span>
          </p>
          <h2 className={styles.title}>{copy.title}</h2>
          <p className={styles.subtitle}>{copy.subtitle}</p>
          <p className={styles.text}>{copy.description}</p>
          <ul className={styles.features}>
            {copy.features.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          <div className={styles.actions}>
            <Button onClick={onOpen}>{t.projects.viewCase}</Button>
            {project.url ? (
              <Button href={project.url} variant="ghost" arrow="↗">
                {t.projects.openSite}
              </Button>
            ) : null}
          </div>
        </div>
        <button type="button" className={styles.media} onClick={onOpen} aria-label={`${t.projects.viewCase}: ${copy.title}`}>
          <BrowserFrame label={frameLabel(project)} className={styles.frame}>
            <Screens project={project} playing={active} />
          </BrowserFrame>
        </button>
      </div>
    </article>
  );
}

/**
 * Projects page: full-width cards that stack while scrolling. Each new card
 * slides over the previous one, which settles back (scales and dims) like a
 * deck; the card on top plays through its screens.
 */
export function ProjectStack({ list, onOpen }: { list: ProjectDefinition[]; onOpen: (i: number) => void }) {
  const reduced = usePrefersReducedMotion();
  const cardsRef = useRef<(HTMLElement | null)[]>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const stackQuery = window.matchMedia('(min-width: 900px)');
    let raf = 0;
    let current = -1;
    const update = () => {
      raf = 0;
      const cards = cardsRef.current;
      const vh = window.innerHeight;
      let top = 0;
      cards.forEach((el, i) => {
        if (!el) return;
        const inner = el.firstElementChild as HTMLElement;
        const r = el.getBoundingClientRect();
        if (r.top < vh * 0.5) top = i;
        const next = cards[i + 1];
        if (!stackQuery.matches || reduced || !next) {
          inner.style.transform = '';
          inner.style.filter = '';
          return;
        }
        const covered = Math.min(1, Math.max(0, 1 - (next.getBoundingClientRect().top - r.top) / r.height));
        inner.style.transform = `scale(${(1 - covered * 0.06).toFixed(4)})`;
        inner.style.filter = covered > 0.001 ? `brightness(${(1 - covered * 0.55).toFixed(3)})` : '';
      });
      if (top !== current) {
        current = top;
        setActive(top);
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [reduced, list]);

  return (
    <div className={styles.stack}>
      {list.map((p, i) => (
        <Card
          key={p.id}
          project={p}
          i={i}
          total={list.length}
          active={i === active}
          onOpen={() => onOpen(i)}
          setRef={(el) => {
            cardsRef.current[i] = el;
          }}
        />
      ))}
    </div>
  );
}
