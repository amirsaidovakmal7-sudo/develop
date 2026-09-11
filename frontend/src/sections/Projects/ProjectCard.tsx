import type { ProjectDefinition } from '../../data/projects';
import { getProjectImages, getProjectVideos } from '../../lib/projectMedia';
import { useProjectCopy } from '../../lib/useProjectCopy';
import { useTranslation } from '../../i18n';
import styles from './ProjectCard.module.css';

export type Composition = 'split' | 'splitReverse' | 'full' | 'overlap' | 'video';

interface ProjectCardProps {
  project: ProjectDefinition;
  composition: Composition;
  index: number;
  onOpen: () => void;
}

function Media({
  src,
  isVideo,
  onOpen,
  label,
}: {
  src: string;
  isVideo: boolean;
  onOpen: () => void;
  label: string;
}) {
  return (
    <div
      className={styles.media}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpen();
        }
      }}
      data-cursor="view"
      role="button"
      tabIndex={0}
      aria-label={label}
    >
      {isVideo ? (
        <video src={src} muted loop playsInline autoPlay preload="metadata" />
      ) : (
        <img src={src} alt={label} loading="lazy" />
      )}
    </div>
  );
}

export function ProjectCard({ project, composition, index, onOpen }: ProjectCardProps) {
  const { t } = useTranslation();
  const copy = useProjectCopy(project);
  const images = getProjectImages(project.id);
  const videos = getProjectVideos(project.id);
  const isVideoProject = images.length === 0 && videos.length > 0;
  const num = String(index + 1).padStart(2, '0');

  const actions = (
    <div className={styles.actions}>
      <button type="button" className={styles.viewCase} onClick={onOpen} data-cursor="open">
        {t.projects.viewCase}
      </button>
      {project.url ? (
        <a
          href={project.url}
          target="_blank"
          rel="noreferrer"
          className={styles.openSite}
          data-cursor="open"
          onClick={(e) => e.stopPropagation()}
        >
          {t.projects.openSite} ↗
        </a>
      ) : (
        <span className={styles.openSite}>{t.projects.noLiveLink}</span>
      )}
    </div>
  );

  const textBlock = (
    <div className={styles.textCol}>
      <div className={styles.index}>{num}</div>
      <span className={styles.tag}>{copy.categoryLabel}</span>
      <h3 className={styles.title}>{copy.title}</h3>
      <p className={styles.subtitle}>{copy.subtitle}</p>
      <p className={styles.description}>{copy.description}</p>
      {copy.features.length > 0 && (
        <ul className={styles.features}>
          {copy.features.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      )}
      {actions}
    </div>
  );

  if (composition === 'overlap') {
    return (
      <article className={styles.card}>
        <div className={styles.overlapWrap}>
          <div className={styles.overlapMedia}>
            <Media src={images[1] ?? images[0]} isVideo={false} onOpen={onOpen} label={copy.title} />
            <Media src={images[0]} isVideo={false} onOpen={onOpen} label={copy.title} />
          </div>
          {textBlock}
        </div>
      </article>
    );
  }

  if (composition === 'video') {
    return (
      <article className={styles.card}>
        <div className={styles.videoWrap}>
          <Media src={isVideoProject ? videos[0] : images[0]} isVideo={isVideoProject} onOpen={onOpen} label={copy.title} />
          <div>
            <div className={styles.index}>{num}</div>
            <span className={styles.tag}>{copy.categoryLabel}</span>
            <h3 className={styles.title}>{copy.title}</h3>
            <p className={styles.subtitle}>{copy.subtitle}</p>
            <dl className={styles.metaTable}>
              <dt>{t.projects.metaType}</dt>
              <dd>{copy.categoryLabel}</dd>
              <dt>{t.projects.metaRole}</dt>
              <dd>{t.projects.roleSolo}</dd>
              <dt>{t.projects.metaStack}</dt>
              <dd>{project.technologies.join(', ')}</dd>
              <dt>{t.projects.metaStatus}</dt>
              <dd>{copy.statusLabel}</dd>
            </dl>
            {actions}
          </div>
        </div>
      </article>
    );
  }

  if (composition === 'full') {
    return (
      <article className={`${styles.card} ${styles.full}`}>
        <Media src={images[0]} isVideo={false} onOpen={onOpen} label={copy.title} />
        <div className={styles.index}>{num}</div>
        <span className={styles.tag}>{copy.categoryLabel}</span>
        <h3 className={styles.title}>{copy.title}</h3>
        <p className={styles.subtitle}>{copy.subtitle}</p>
        <p className={styles.description}>{copy.description}</p>
        {actions}
      </article>
    );
  }

  const wrapClass = composition === 'splitReverse' ? styles.splitReverse : styles.split;
  return (
    <article className={styles.card}>
      <div className={wrapClass}>
        <Media src={images[0]} isVideo={false} onOpen={onOpen} label={copy.title} />
        {textBlock}
      </div>
    </article>
  );
}
