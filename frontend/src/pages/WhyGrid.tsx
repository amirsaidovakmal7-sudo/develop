import type { PointerEvent, ReactNode } from 'react';
import { useInView } from '../hooks/useInView';
import styles from './WhyGrid.module.css';

const ICONS: ReactNode[] = [
  <>
    <circle cx="24" cy="17" r="7" pathLength={1} />
    <path d="M10 40 C12 31 18 28 24 28 C30 28 36 31 38 40" pathLength={1} />
  </>,
  <>
    <path d="M24 8 L40 16 L24 24 L8 16 Z" pathLength={1} />
    <path d="M8 24 L24 32 L40 24" pathLength={1} />
    <path d="M8 32 L24 40 L40 32" pathLength={1} />
  </>,
  <>
    <path d="M8 11 H40 V31 H22 L14 38 V31 H8 Z" pathLength={1} />
    <path d="M15 19 H33 M15 25 H27" pathLength={1} />
  </>,
  <>
    <circle cx="16" cy="24" r="7" pathLength={1} />
    <path d="M23 24 H41 M35 24 V30 M41 24 V29" pathLength={1} />
  </>,
];

export function WhyGrid({ items }: { items: { title: string; text: string }[] }) {
  const { ref, inView } = useInView<HTMLUListElement>({ amount: 0.2 });

  const onMove = (e: PointerEvent<HTMLLIElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--x', `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty('--y', `${e.clientY - r.top}px`);
  };

  return (
    <ul ref={ref} className={`${styles.grid} ${inView ? styles.in : ''}`}>
      {items.map((w, i) => (
        <li key={w.title} className={styles.tile} style={{ ['--i' as string]: i }} onPointerMove={onMove}>
          <span className={styles.spot} aria-hidden="true" />
          <div className={styles.top}>
            <svg className={styles.icon} viewBox="0 0 48 48" aria-hidden="true">
              {ICONS[i % ICONS.length]}
            </svg>
            <span className={styles.num}>{String(i + 1).padStart(2, '0')}</span>
          </div>
          <h3 className={styles.title}>{w.title}</h3>
          <p className={styles.text}>{w.text}</p>
        </li>
      ))}
    </ul>
  );
}
