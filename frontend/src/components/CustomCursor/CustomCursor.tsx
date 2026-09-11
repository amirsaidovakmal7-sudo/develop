import { useEffect, useRef, useState } from 'react';
import { pointerState } from '../../lib/pointerStore';
import { useIsTouchDevice } from '../../hooks/useIsTouchDevice';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { useTranslation } from '../../i18n';
import styles from './CustomCursor.module.css';

export type CursorLabelKey = 'explore' | 'view' | 'drag' | 'open' | 'close';

/**
 * Custom desktop cursor (TECH_TASK_REDISIGN.md п.10): small dot + soft ring
 * by default, ring expands with a contextual label when hovering anything
 * marked `data-cursor="view|drag|open|explore|close"`. Disabled entirely on
 * touch devices and simplified under prefers-reduced-motion (no lerp/rAF —
 * cursor is hidden, native pointer takes over).
 */
export function CustomCursor() {
  const isTouch = useIsTouchDevice();
  const reducedMotion = usePrefersReducedMotion();
  const { t } = useTranslation();
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [activeLabel, setActiveLabel] = useState<CursorLabelKey | null>(null);

  useEffect(() => {
    if (isTouch || reducedMotion) return;
    document.documentElement.classList.add('has-custom-cursor');
    return () => document.documentElement.classList.remove('has-custom-cursor');
  }, [isTouch, reducedMotion]);

  useEffect(() => {
    if (isTouch || reducedMotion) return;

    let raf = 0;
    let ringX = pointerState.clientX;
    let ringY = pointerState.clientY;

    const loop = () => {
      const dot = dotRef.current;
      const ring = ringRef.current;
      if (dot) dot.style.transform = `translate3d(${pointerState.clientX}px, ${pointerState.clientY}px, 0)`;
      // Ring lags slightly behind the raw pointer for a softer, weighted feel.
      ringX += (pointerState.clientX - ringX) * 0.22;
      ringY += (pointerState.clientY - ringY) * 0.22;
      if (ring) ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [isTouch, reducedMotion]);

  useEffect(() => {
    if (isTouch) return;

    const onOver = (e: PointerEvent) => {
      const target = (e.target as HTMLElement)?.closest?.('[data-cursor]');
      const key = target?.getAttribute('data-cursor') as CursorLabelKey | null;
      setActiveLabel(key ?? null);
    };
    const onOut = (e: PointerEvent) => {
      const related = (e.relatedTarget as HTMLElement)?.closest?.('[data-cursor]');
      if (!related) setActiveLabel(null);
    };

    document.addEventListener('pointerover', onOver, { passive: true });
    document.addEventListener('pointerout', onOut, { passive: true });
    return () => {
      document.removeEventListener('pointerover', onOver);
      document.removeEventListener('pointerout', onOut);
    };
  }, [isTouch]);

  if (isTouch) return null;

  return (
    <div aria-hidden="true">
      <div ref={dotRef} className={styles.dot} style={{ opacity: reducedMotion ? 0 : 1 }} />
      <div ref={ringRef} className={`${styles.ring} ${activeLabel ? styles.active : ''}`}>
        {activeLabel && <span className={styles.label}>{t.cursor[activeLabel]}</span>}
      </div>
    </div>
  );
}
