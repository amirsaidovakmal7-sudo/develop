import type { ReactNode } from 'react';
import type { ProjectDefinition } from '../../data/projects';
import styles from './BrowserFrame.module.css';

export function frameLabel(project: ProjectDefinition) {
  if (project.url) return project.url.replace(/^https?:\/\//, '').replace(/\/$/, '');
  if (project.category === 'bot') return 't.me/' + project.id.replace(/-/g, '_');
  return project.id + '.local';
}

/** Minimal browser chrome around project media — the real counterpart of the particle «website» form. */
export function BrowserFrame({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return (
    <div className={`${styles.frame} ${className ?? ''}`}>
      <div className={styles.bar} aria-hidden="true">
        <span className={styles.dots}>
          <i />
          <i />
          <i />
        </span>
        <span className={styles.url}>{label}</span>
      </div>
      <div className={styles.view}>{children}</div>
    </div>
  );
}
