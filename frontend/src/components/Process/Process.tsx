import { useEffect, useRef, useState, type CSSProperties, type PointerEvent, type ReactNode } from 'react';
import { useTranslation } from '../../i18n';
import { Heading } from '../ui/Heading';
import { Label } from '../ui/Label';
import { Reveal } from '../ui/Reveal';
import styles from './Process.module.css';

const ICONS: ReactNode[] = [
  <>
    <circle cx="20" cy="20" r="11" pathLength={1} />
    <path d="M28 28 L39 39" pathLength={1} />
    <path d="M15 17 Q20 13 25 17" pathLength={1} />
  </>,
  <>
    <rect x="7" y="9" width="34" height="30" rx="3" pathLength={1} />
    <path d="M7 17 H41" pathLength={1} />
    <rect x="12" y="22" width="11" height="12" rx="1.5" pathLength={1} />
    <path d="M28 24 H36 M28 30 H34" pathLength={1} />
  </>,
  <>
    <path d="M17 14 L7 24 L17 34" pathLength={1} />
    <path d="M31 14 L41 24 L31 34" pathLength={1} />
    <path d="M27 10 L21 38" pathLength={1} />
  </>,
  <>
    <circle cx="24" cy="24" r="16" pathLength={1} />
    <path d="M16 24 L22 30 L33 18" pathLength={1} />
  </>,
  <>
    <path d="M24 6 C30 12 32 20 30 30 H18 C16 20 18 12 24 6 Z" pathLength={1} />
    <circle cx="24" cy="18" r="3" pathLength={1} />
    <path d="M18 30 L13 36 M30 30 L35 36" pathLength={1} />
    <path d="M21 34 L24 42 L27 34" pathLength={1} />
  </>,
  <>
    <path d="M38 20 A15 15 0 0 0 11 16" pathLength={1} />
    <path d="M11 8 V16 H19" pathLength={1} />
    <path d="M10 28 A15 15 0 0 0 37 32" pathLength={1} />
    <path d="M37 40 V32 H29" pathLength={1} />
  </>,
];

/**
 * Six steps on one route: the step crossing the middle of the viewport (or
 * the one under the cursor) is active — its icon draws itself, the route
 * fills up to it and the sticky counter rolls to its number.
 */
/** `titleA`/`titleB` override the shared heading where the block repeats, so the site never has two identical H2s. */
export function Process({ num, titleA, titleB }: { num?: string; titleA?: string; titleB?: string }) {
  const { t } = useTranslation();
  const p = t.process;
  const [scrollActive, setScrollActive] = useState(0);
  const [hover, setHover] = useState<number | null>(null);
  const itemsRef = useRef<(HTMLLIElement | null)[]>([]);
  const active = hover ?? scrollActive;
  const total = p.steps.length;

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setScrollActive(Number((e.target as HTMLElement).dataset.i));
        }
      },
      { rootMargin: '-48% 0px -48% 0px' },
    );
    itemsRef.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const onMove = (e: PointerEvent<HTMLLIElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--x', `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty('--y', `${e.clientY - r.top}px`);
  };

  return (
    <section id="process" className="section" aria-labelledby="process-title">
      <div className={`container ${styles.grid}`}>
        <div className={styles.aside}>
          <Reveal className={styles.head}>
            <Label num={num}>{p.label}</Label>
            <div id="process-title">
              <Heading a={titleA ?? p.titleA} b={titleB ?? p.titleB} className={styles.h2} />
            </div>
            <p className={styles.intro}>{p.intro}</p>
          </Reveal>
          <div className={styles.counter} aria-hidden="true" style={{ '--active': active } as CSSProperties}>
            <span className={styles.odo}>
              <span className={styles.strip}>
                {p.steps.map((_, i) => (
                  <span key={i}>{String(i + 1).padStart(2, '0')}</span>
                ))}
              </span>
            </span>
            <span className={styles.total}>/ {String(total).padStart(2, '0')}</span>
            <span className={styles.counterTitle} key={active}>
              {p.steps[active].title}
            </span>
          </div>
        </div>

        <ol className={styles.list} onPointerLeave={() => setHover(null)}>
          {p.steps.map((s, i) => {
            const state = i === active ? styles.on : i < active ? styles.past : '';
            return (
              <li
                key={s.title}
                ref={(el) => {
                  itemsRef.current[i] = el;
                }}
                data-i={i}
                className={`${styles.step} ${state}`}
                onPointerEnter={(e) => e.pointerType === 'mouse' && setHover(i)}
                onPointerMove={onMove}
              >
                <span className={styles.node} aria-hidden="true" />
                <div className={styles.card}>
                  <span className={styles.spot} aria-hidden="true" />
                  <svg className={styles.icon} viewBox="0 0 48 48" aria-hidden="true">
                    {ICONS[i]}
                  </svg>
                  <div className={styles.body}>
                    <span className={styles.num}>{String(i + 1).padStart(2, '0')}</span>
                    <h3 className={styles.title}>{s.title}</h3>
                    <p className={styles.text}>{s.text}</p>
                    <p className={styles.out}>
                      <span>{p.outLabel}</span>
                      <b>{s.out}</b>
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
