import { createElement, useEffect, useRef, useState, type CSSProperties, type JSX, type ReactNode } from 'react';
import { useInView } from '../../hooks/useInView';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import styles from './Motion.module.css';

type Delay = { delay?: number };

/**
 * Which element a reveal wraps. These are intrinsic tags, not components, so
 * they go through createElement rather than being aliased to a capitalised
 * local — aliasing reads as "component created during render", and would
 * remount the subtree if the tag ever changed.
 */
type Tag = keyof JSX.IntrinsicElements;

function delayStyle(delay?: number): CSSProperties | undefined {
  return delay ? ({ '--reveal-delay': `${delay}ms` } as CSSProperties) : undefined;
}

/**
 * Display type rising out from behind its own baseline. One `<Lines>` per
 * block of display type; pass the lines as an array so each gets its own
 * mask and the stagger stays in one place.
 */
export function Lines({
  lines,
  as = 'span',
  className,
  step = 90,
  delay = 0,
}: {
  lines: ReactNode[];
  as?: Tag;
  className?: string;
  step?: number;
} & Delay) {
  const reduced = usePrefersReducedMotion();
  const { ref, inView } = useInView<HTMLDivElement>({ amount: 0.2 });

  return createElement(
    as,
    { ref, className },
    lines.map((line, i) =>
      createElement(
        'span',
        {
          // Lines are a fixed authored list per block, so index is the identity.
          key: i,
          className: `${styles.line} ${reduced || inView ? styles.in : ''}`,
          style: delayStyle(delay + i * step),
        },
        createElement('span', { className: styles.lineInner }, line),
      ),
    ),
  );
}

/** A hairline that draws itself from its anchored end. */
export function Rule({
  vertical = false,
  className,
  delay = 0,
  style,
}: { vertical?: boolean; className?: string; style?: CSSProperties } & Delay) {
  const reduced = usePrefersReducedMotion();
  const { ref, inView } = useInView<HTMLSpanElement>({ amount: 0.01 });

  return (
    <span
      ref={ref}
      aria-hidden="true"
      className={[styles.rule, vertical ? styles.ruleVertical : '', reduced || inView ? styles.ruleIn : '', className]
        .filter(Boolean)
        .join(' ')}
      style={{ ...delayStyle(delay), ...style }}
    />
  );
}

/** The quiet reveal, for reading text and media. */
export function Settle({
  children,
  as = 'div',
  className,
  delay = 0,
  amount = 0.2,
}: { children: ReactNode; as?: Tag; className?: string; amount?: number } & Delay) {
  const reduced = usePrefersReducedMotion();
  const { ref, inView } = useInView<HTMLDivElement>({ amount });

  return createElement(
    as,
    {
      ref,
      className: [styles.settle, reduced || inView ? styles.settleIn : '', className].filter(Boolean).join(' '),
      style: delayStyle(delay),
    },
    children,
  );
}

const GLYPHS = '#*+-=/\\<>[]{}()01';

/**
 * A mono label resolving character by character, like a terminal settling.
 *
 * This is the one piece of text motion that belongs specifically to this
 * site's voice, so it is reserved for mono labels and counters — never for
 * prose. The animated text is hidden from assistive technology and the real
 * string is exposed alongside it, so a screen reader never hears noise.
 */
export function Scramble({ text, className, delay = 0 }: { text: string; className?: string } & Delay) {
  const reduced = usePrefersReducedMotion();
  const { ref, inView } = useInView<HTMLSpanElement>({ amount: 0.6 });
  // null until the animation starts, so the settled text is what renders
  // both before the label scrolls in and whenever motion is reduced —
  // derived, rather than written back from the effect.
  const [scrambled, setScrambled] = useState<string | null>(null);
  const shown = reduced || !inView || scrambled === null ? text : scrambled;
  const frame = useRef(0);

  useEffect(() => {
    if (reduced || !inView) return;

    let raf = 0;
    let timer = 0;
    frame.current = 0;
    const chars = [...text];
    // Roughly 26ms per frame; every character settles within ~3 frames of
    // its own slot, so a 12-character label resolves in about half a second.
    const perChar = 1.6;

    const tick = () => {
      const f = frame.current++;
      setScrambled(
        chars
          .map((ch, i) => {
            if (ch === ' ') return ch;
            const start = i * perChar;
            if (f >= start + 3) return ch;
            if (f < start) return ' ';
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          })
          .join(''),
      );
      if (f < chars.length * perChar + 4) {
        raf = window.setTimeout(tick, 26);
      } else {
        setScrambled(text);
      }
    };

    timer = window.setTimeout(tick, delay);
    return () => {
      window.clearTimeout(timer);
      window.clearTimeout(raf);
    };
  }, [inView, reduced, text, delay]);

  return (
    <span ref={ref} className={className}>
      <span aria-hidden="true" className={styles.scramble}>
        {shown}
      </span>
      <span className="visually-hidden">{text}</span>
    </span>
  );
}
