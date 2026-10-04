import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { useTranslation } from '../../i18n';
import type { ProjectDefinition } from '../../data/projects';
import { getProjectImages, getProjectPoster, getProjectVideos } from '../../lib/projectMedia';
import { useProjectCopy } from '../../lib/useProjectCopy';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { useInView } from '../../hooks/useInView';
import { BrowserFrame, frameLabel } from '../BrowserFrame/BrowserFrame';
import styles from './Showcase.module.css';

const PROJECT_MS = 7000;
const SLIDE_MS = 2300;

function Item({
  project,
  i,
  active,
  onSelect,
  onOpen,
}: {
  project: ProjectDefinition;
  i: number;
  active: boolean;
  onSelect: () => void;
  onOpen: () => void;
}) {
  const { t } = useTranslation();
  const copy = useProjectCopy(project);
  return (
    <li className={`${styles.item} ${active ? styles.itemOn : ''}`}>
      <button type="button" className={styles.itemBtn} onClick={active ? onOpen : onSelect} onPointerEnter={(e) => e.pointerType === 'mouse' && onSelect()} aria-current={active}>
        <span className={styles.itemNum}>{String(i + 1).padStart(2, '0')}</span>
        <span className={styles.itemTitle}>{copy.title}</span>
        <span className={styles.itemMeta}>
          {copy.category} · <span className={project.status === 'live' ? styles.live : undefined}>{copy.status}</span>
        </span>
        <span className={styles.itemMore}>
          <span>{copy.subtitle}</span>
          <span className={styles.itemCta}>
            {t.projects.viewCase} <span aria-hidden="true">→</span>
          </span>
        </span>
        <span className={styles.bar} aria-hidden="true" />
      </button>
    </li>
  );
}

/** Home projects: a numbered list on one side, a browser window on the other that plays through the active project's screens. */
export function Showcase({ list, onOpen }: { list: ProjectDefinition[]; onOpen: (i: number) => void }) {
  const reduced = usePrefersReducedMotion();
  const { ref, inView } = useInView<HTMLDivElement>({ amount: 0.3, once: false });
  const [active, setActive] = useState(0);
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);

  const project = list[active];
  const copy = useProjectCopy(project);
  const images = getProjectImages(project.id);
  const poster = getProjectPoster(project.id);
  const frames = images.length ? images : poster ? [poster] : [];
  const isVideo = getProjectVideos(project.id).length > 0;

  const running = inView && !paused && !reduced;

  useEffect(() => {
    if (!running) return;
    const id = window.setTimeout(() => {
      setActive((a) => (a + 1) % list.length);
      setSlide(0);
    }, PROJECT_MS);
    return () => window.clearTimeout(id);
  }, [running, active, list.length]);

  useEffect(() => {
    if (!running || frames.length < 2) return;
    const id = window.setInterval(() => setSlide((s) => (s + 1) % frames.length), SLIDE_MS);
    return () => window.clearInterval(id);
  }, [running, frames.length, active]);

  const select = (i: number) => {
    if (i === active) return;
    setActive(i);
    setSlide(0);
  };

  const onTilt = (e: PointerEvent<HTMLDivElement>) => {
    const el = stageRef.current;
    if (!el || e.pointerType !== 'mouse') return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--ry', `${(((e.clientX - r.left) / r.width - 0.5) * 8).toFixed(2)}deg`);
    el.style.setProperty('--rx', `${((0.5 - (e.clientY - r.top) / r.height) * 6).toFixed(2)}deg`);
  };

  return (
    <div
      ref={ref}
      className={`${styles.showcase} ${running ? styles.running : ''}`}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
    >
      <ol className={styles.list} style={{ ['--ms' as string]: `${PROJECT_MS}ms` }}>
        {list.map((p, i) => (
          <Item key={p.id} project={p} i={i} active={i === active} onSelect={() => select(i)} onOpen={() => onOpen(i)} />
        ))}
      </ol>

      <div ref={stageRef} className={styles.stage} onPointerMove={onTilt}>
        <button type="button" className={styles.stageBtn} onClick={() => onOpen(active)} aria-label={copy.title}>
          <BrowserFrame label={frameLabel(project)} className={styles.frame}>
            <span className={styles.screens}>
              {frames.map((img, i) => (
                <img
                  key={project.id + img.src}
                  src={img.src}
                  width={img.width}
                  height={img.height}
                  alt={copy.screenAlt(i + 1)}
                  loading="lazy"
                  decoding="async"
                  className={i === slide ? styles.shown : undefined}
                />
              ))}
              {isVideo ? <span className={styles.play} aria-hidden="true">▶</span> : null}
            </span>
          </BrowserFrame>
        </button>
        <div className={styles.slides} aria-hidden="true">
          {frames.map((_, i) => (
            <i key={i} className={i === slide ? styles.slideOn : undefined} />
          ))}
        </div>
      </div>
    </div>
  );
}
