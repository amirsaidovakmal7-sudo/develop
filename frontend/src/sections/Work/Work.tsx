import { useCallback, useEffect, useRef, useState } from 'react';
import { projects, type ProjectDefinition } from '../../data/projects';
import { useTranslation } from '../../i18n';
import { useProjectCopy } from '../../lib/useProjectCopy';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useInView } from '../../hooks/useInView';
import { getProjectPoster } from '../../lib/projectMedia';
import { aimAtPanel, setCaseOpen } from '../../lib/sceneStore';
import { Lines, Settle } from '../../components/Motion/Motion';
import { SectionMark } from '../../components/SectionMark/SectionMark';
import { ButtonLink, Button } from '../../components/Button/Button';
import { CaseView } from '../../components/CaseView/CaseView';
import styles from './Work.module.css';

const num = (i: number) => String(i + 1).padStart(2, '0');

/**
 * The frame that represents a project. Always a still — for the two
 * projects that exist only as screen recordings it is a frame captured
 * from the recording by scripts/gen-video-posters.mjs, so the index never
 * starts a multi-megabyte video download just to draw a thumbnail.
 */
function Poster({ project, active = true }: { project: ProjectDefinition; active?: boolean }) {
  const copy = useProjectCopy(project);
  const poster = getProjectPoster(project.id);
  if (!poster) return null;

  return (
    <img
      className={active ? styles.frameActive : undefined}
      src={poster.src}
      width={poster.width}
      height={poster.height}
      alt={`${copy.title} — ${copy.subtitle}`}
      loading="lazy"
      decoding="async"
      // Eleven of the twelve stage frames are off-stage at any moment; they
      // are kept mounted for an instant cross-fade, but they should never
      // compete with the one being looked at.
      fetchPriority={active ? 'high' : 'low'}
    />
  );
}

function IndexRow({
  project,
  index,
  active,
  onActivate,
  onOpen,
}: {
  project: ProjectDefinition;
  index: number;
  active: boolean;
  onActivate: () => void;
  onOpen: () => void;
}) {
  const copy = useProjectCopy(project);

  return (
    <li>
      <button
        type="button"
        className={`${styles.row} ${active ? styles.rowActive : ''}`}
        onMouseEnter={onActivate}
        onFocus={onActivate}
        onClick={onOpen}
        aria-label={`${copy.title} — ${copy.subtitle}`}
      >
        <span className={styles.rowNum}>{num(index)}</span>
        <span className={styles.rowName}>{copy.title}</span>
        <span className={styles.rowMeta}>
          <span className={project.status === 'live' ? styles.liveDot : styles.doneDot} aria-hidden="true" />
          {copy.categoryLabel}
        </span>
      </button>
    </li>
  );
}

function WorkCard({ project, index, onOpen }: { project: ProjectDefinition; index: number; onOpen: () => void }) {
  const { t } = useTranslation();
  const copy = useProjectCopy(project);
  // There is no pointer to follow on a phone, so the card that is actually
  // on screen is what aims the lantern. Scrolling the list turns the body
  // panel by panel — the same twelve-to-twelve mapping the desktop index
  // gets from hover.
  const { ref, inView } = useInView<HTMLDivElement>({ amount: 0.55, once: false });

  useEffect(() => {
    if (inView) aimAtPanel(index);
  }, [inView, index]);

  return (
    <div ref={ref}>
      <Settle amount={0.12}>
        <button type="button" className={styles.card} onClick={onOpen}>
          <span className={styles.cardFrame}>
            <Poster project={project} />
          </span>
          <span className={styles.cardHead}>
            <span className={styles.cardNum}>{num(index)}</span>
            <span className={styles.cardTitle}>{copy.title}</span>
          </span>
          <span className={styles.cardSub}>{copy.subtitle}</span>
          <span className={styles.cardMeta}>
            <span className={project.status === 'live' ? styles.liveDot : styles.doneDot} aria-hidden="true" />
            {copy.categoryLabel}
            <span className={styles.cardOpen}>{t.projects.viewCase} →</span>
          </span>
        </button>
      </Settle>
    </div>
  );
}

function Stage({ active, onOpen }: { active: number; onOpen: () => void }) {
  const { t } = useTranslation();
  const project = projects[active];
  const copy = useProjectCopy(project);

  return (
    <div className={styles.stageCol}>
      <div className={styles.frame}>
        {/* Stills stay mounted and cross-fade, so moving down the index
            never shows an empty frame while the next file decodes. */}
        {projects.map((p, i) => (
          <Poster key={p.id} project={p} active={i === active} />
        ))}
      </div>

      <div className={styles.caption}>
        <div className={styles.captionText}>
          <h3 className={styles.captionTitle}>{copy.title}</h3>
          <p className={styles.captionSub}>{copy.subtitle}</p>
          <p className={styles.captionStack}>{project.technologies.join(' · ')}</p>
        </div>
        <div className={styles.captionActions}>
          <Button variant="primary" arrow="→" onClick={onOpen}>
            {t.projects.viewCase}
          </Button>
          {project.url && (
            <ButtonLink href={project.url} external variant="ghost" arrow="↗">
              {t.projects.openSite}
            </ButtonLink>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Work is an index and a stage, not a grid of cards.
 *
 * The list is the whole catalogue at a glance — twelve real projects,
 * numbered, with their status — and the panel beside it holds whichever one
 * the reader is pointing at, large enough to actually judge. Nothing
 * depends on hover: every row is a button, so a keyboard moves the stage
 * exactly the way a pointer does. Below 1025px the stage is not shrunk, it
 * is replaced by full-width blocks.
 *
 * Opening a row goes to the case view, where every screenshot is shown
 * uncropped and the live site is one click away.
 */
export function Work() {
  const { t } = useTranslation();
  const wide = useMediaQuery('(min-width: 1025px)');
  const [active, setActive] = useState(0);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // The lantern has twelve panels and the catalogue has twelve projects, so
  // one index addresses both. Pointing at a row turns that project's panel
  // to the camera; opening its case lifts the panel off the body.
  const setActivePanel = useCallback((index: number) => {
    setActive(index);
    aimAtPanel(index);
  }, []);

  const open = useCallback((index: number) => {
    setOpenIndex(index);
    aimAtPanel(index);
    setCaseOpen(true);
  }, []);

  const close = useCallback(() => {
    setOpenIndex(null);
    setCaseOpen(false);
    aimAtPanel(null);
  }, []);
  const step = useCallback(
    (delta: number) =>
      setOpenIndex((i) => {
        if (i === null) return null;
        const next = (i + delta + projects.length) % projects.length;
        aimAtPanel(next);
        setActive(next);
        return next;
      }),
    [],
  );

  // Release the aim when the section leaves the screen. `mouseleave` is not
  // enough: scrolling away with the wheel or the keyboard never moves the
  // pointer out of the list, so the lantern would stay locked to whichever
  // project was last pointed at for the rest of the page — including over
  // the order form, where it has its own job to do.
  const sectionRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) aimAtPanel(null);
      },
      { threshold: 0 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      aimAtPanel(null);
      setCaseOpen(false);
    };
  }, []);

  return (
    <section id="work" ref={sectionRef} className={`${styles.work} section`}>
      <div className="shell">
        <SectionMark index="01" label={t.projects.label} />

        <div className={styles.head}>
          <Lines as="h2" className={styles.title} lines={[t.projects.title]} />
          <Settle className={styles.intro} as="p" delay={120}>
            {t.projects.intro}
          </Settle>
        </div>

        {!wide && (
          <div className={styles.cards}>
            {projects.map((project, i) => (
              <WorkCard key={project.id} project={project} index={i} onOpen={() => open(i)} />
            ))}
          </div>
        )}
      </div>

      {/* Outside `.shell` on purpose: the stage has to reach the right edge
          of the screen, and an element inside a centred column cannot. */}
      {wide && (
        <div className={styles.layout}>
          <ul className={styles.index}>
            {projects.map((project, i) => (
              <IndexRow
                key={project.id}
                project={project}
                index={i}
                active={i === active}
                onActivate={() => setActivePanel(i)}
                onOpen={() => open(i)}
              />
            ))}
          </ul>
          <Stage active={active} onOpen={() => open(active)} />
        </div>
      )}

      <CaseView index={openIndex} onClose={close} onStep={step} />
    </section>
  );
}
