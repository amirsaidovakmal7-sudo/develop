import styles from './Armature.module.css';

/**
 * The fixed hairline grid every section aligns to. Purely structural and
 * decorative-free: it carries no content, takes no pointer events, and is
 * the reason the page reads as one continuous drawing.
 */
export function Armature() {
  return (
    <div className={styles.armature} aria-hidden="true">
      <div className={styles.inner}>
        <span className={`${styles.column} ${styles.margin} ${styles.marginLeft}`} />
        <span className={`${styles.column} ${styles.edge} ${styles.left}`} />
        <span className={`${styles.column} ${styles.split}`} />
        <span className={`${styles.column} ${styles.splitFar}`} />
        <span className={`${styles.column} ${styles.edge} ${styles.right}`} />
        <span className={`${styles.column} ${styles.margin} ${styles.marginRight}`} />
      </div>
    </div>
  );
}
