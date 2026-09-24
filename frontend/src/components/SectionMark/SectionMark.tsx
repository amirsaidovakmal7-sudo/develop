import { Rule, Scramble } from '../Motion/Motion';
import styles from './SectionMark.module.css';

interface SectionMarkProps {
  index: string;
  label: string;
  className?: string;
}

/** Counter · drawn rule · resolving label — the opening move of every section. */
export function SectionMark({ index, label, className }: SectionMarkProps) {
  return (
    <div className={[styles.mark, className].filter(Boolean).join(' ')}>
      <span className={styles.index}>{index}</span>
      <Rule className={styles.rule} />
      <Scramble className={styles.label} text={label} delay={160} />
    </div>
  );
}
