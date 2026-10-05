import type { ReactNode } from 'react';
import styles from './Label.module.css';

/** Section marker `[ 02 · Услуги ]` with HUD corner brackets. */
export function Label({ num, children, className }: { num?: string; children: ReactNode; className?: string }) {
  return (
    <span className={`${styles.label} ${className ?? ''}`}>
      <i aria-hidden="true" />
      {num ? <b>{num}</b> : null}
      {num ? <span aria-hidden="true">·</span> : null}
      <span>{children}</span>
    </span>
  );
}
