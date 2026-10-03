import { useEffect, useRef } from 'react';
import { useTranslation } from '../i18n';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { PATHS, useRequestHref } from '../lib/router';
import { Button } from '../components/ui/Button';
import { Heading } from '../components/ui/Heading';
import { Label } from '../components/ui/Label';
import { createParticleEngine, type Vec3 } from './engine';
import { FORM } from './shapes';
import styles from './HomeStory.module.css';

const LAST = FORM.system;
// Per form index (see shapes.ts FORM): how much it turns toward the camera, and how far it sways.
const FACE = [0, 1, 0.5, 1, 0, 0, 0];
const SWAY = [0.4, 0.14, 0.3, 0.14, 0.3, 0.4, 0.4];
const SPIN = [1, 0, 0, 0, 0, 1, 1];
const DISTANCE = 4.8;
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const smooth = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};

/**
 * Hero + the four core services as one pinned scene. Scroll drives a single
 * value, `stage` (0 = hero … 5 = system); the particles morph between forms
 * and the text panels dissolve/assemble on the same eased curve, so a heading
 * changes exactly while the matter is in flight.
 */
export function HomeStory() {
  const { t } = useTranslation();
  const reduced = usePrefersReducedMotion();
  const requestHref = useRequestHref();
  const storyRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const panelsRef = useRef<(HTMLDivElement | null)[]>([]);
  const barsRef = useRef<(HTMLElement | null)[]>([]);
  const hintRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const story = storyRef.current!;
    const canvas = canvasRef.current!;
    const narrowQuery = window.matchMedia('(max-width: 899px)');
    const lowPower = (navigator.hardwareConcurrency ?? 8) <= 4;
    const engine = createParticleEngine(canvas, narrowQuery.matches || lowPower ? 16000 : 26000);
    if (!engine) canvas.style.display = 'none';

    const mouse = { x: 0, y: 0, on: 0, sx: 0, sy: 0, son: 0 };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      const r = canvas.getBoundingClientRect();
      mouse.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      mouse.y = -(((e.clientY - r.top) / r.height) * 2 - 1);
      mouse.on = 1;
    };
    const onLeave = () => (mouse.on = 0);
    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);

    const readStage = () => {
      const r = story.getBoundingClientRect();
      const travel = r.height - window.innerHeight;
      return clamp((-r.top / travel) * 5.6, 0, LAST);
    };

    let visible = true;
    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting), { rootMargin: '100px' });
    io.observe(story);

    const onResize = () => engine?.resize();
    window.addEventListener('resize', onResize);

    let stageS = readStage();
    let intro = reduced || stageS > 0.3 ? 1 : 0;
    let raf = 0;
    let spin = 0;
    let last = performance.now();
    const start = last;

    const updateText = () => {
      panelsRef.current.forEach((el, k) => {
        if (!el) return;
        const d = stageS - k;
        const v = 1 - smooth(0.18, 0.62, Math.abs(d));
        el.style.visibility = v < 0.002 ? 'hidden' : 'visible';
        el.inert = v < 0.5;
        const dir = d < 0 ? 1 : -1;
        Array.from(el.children).forEach((child, i) => {
          const c = child as HTMLElement;
          const lag = i * 0.07;
          const vi = clamp((v - lag) / (1 - lag), 0, 1);
          const e = vi * vi * (3 - 2 * vi);
          c.style.opacity = e.toFixed(3);
          if (reduced) return;
          c.style.transform = `translate3d(0,${((1 - e) * 46 * dir).toFixed(1)}px,0)`;
          c.style.filter = e > 0.99 ? '' : `blur(${((1 - e) * 10).toFixed(1)}px)`;
        });
      });
      barsRef.current.forEach((b, i) => b?.style.setProperty('--p', clamp(stageS - i, 0, 1).toFixed(3)));
      if (hintRef.current) hintRef.current.style.opacity = String(1 - smooth(0.02, 0.2, stageS));
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!visible || document.hidden) return;
      const target = readStage();
      stageS = reduced ? target : stageS + (target - stageS) * (1 - Math.exp(-dt * 5));
      updateText();
      if (!engine) return;

      const time = reduced ? 8 : (now - start) / 1000;
      const k = 1 - Math.exp(-dt * 5);
      mouse.sx += (mouse.x - mouse.sx) * k;
      mouse.sy += (mouse.y - mouse.sy) * k;
      mouse.son += (mouse.on - mouse.son) * k;
      intro = Math.min(1, intro + dt / 2.6);

      const narrow = narrowQuery.matches;
      const aspect = canvas.clientWidth / Math.max(1, canvas.clientHeight);
      // Portrait screens: shrink the forms until the widest one fits, and park the matter above the text.
      const scale = narrow ? Math.min(1, aspect / 0.95) : 1;
      const X = Math.min(1.75, aspect * 0.7);
      const offFor = (s: number): Vec3 => (narrow ? [0, 0.72, 0] : [s % 2 === 0 ? X : -X, 0, 0]);

      let a = Math.floor(stageS);
      let b = Math.min(a + 1, LAST);
      let mix = reduced ? (stageS - a > 0.5 ? 1 : 0) : smooth(0.18, 0.82, stageS - a);
      if (a >= LAST) [a, b, mix] = [LAST, LAST, 0];
      const offA = offFor(a);
      const offB = offFor(b);
      const lerp = (arr: number[]) => arr[a] + (arr[b] - arr[a]) * mix;
      // Flat forms (website, phone) turn to face the camera from their side of the screen and sway less, so they never show their edge.
      const face = lerp(FACE) * Math.atan2(-(offA[0] + (offB[0] - offA[0]) * mix), DISTANCE);
      // Round forms keep turning; the rest ease back to the nearest full turn so they face the viewer.
      const spinW = lerp(SPIN);
      const rest = Math.round(spin / (Math.PI * 2)) * Math.PI * 2;
      spin += reduced ? 0 : dt * 0.14 * spinW + (rest - spin) * (1 - spinW) * (1 - Math.exp(-dt * 2.5));
      engine.render({
        a,
        b,
        mix,
        offA,
        offB,
        arc: narrow ? 0.4 : 1,
        yaw: Math.sin(time * 0.22) * lerp(SWAY) + mouse.sx * 0.35 * lerp(SWAY) / 0.4 + spin + face,
        pitch: -mouse.sy * 0.22 + 0.08,
        time,
        motion: reduced ? 0 : 1,
        mouse: { x: mouse.sx, y: mouse.sy, on: mouse.son },
        size: narrow ? 12 : 11,
        distance: DISTANCE,
        scale,
        intro: 1 - (1 - intro) ** 3,
      });
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('resize', onResize);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      engine?.destroy();
    };
  }, [reduced]);

  const setPanel = (k: number) => (el: HTMLDivElement | null) => {
    panelsRef.current[k] = el;
  };

  return (
    <div ref={storyRef} className={styles.story}>
      <div className={styles.pin}>
        <div className={styles.glow} aria-hidden="true" />
        <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />

        <div ref={setPanel(0)} className={`${styles.panel} ${styles.left} ${styles.hero}`}>
          <Label>{t.hero.label}</Label>
          <Heading level={1} a={t.hero.titleA} b={t.hero.titleB} className={styles.h1} />
          <p className={styles.lead}>{t.hero.lead}</p>
          <div className={styles.actions}>
            <Button to={requestHref}>{t.hero.ctaPrimary}</Button>
            <Button to={PATHS.projects} variant="ghost" arrow={null}>
              {t.hero.ctaSecondary}
            </Button>
          </div>
          <ul className={styles.facts}>
            {t.hero.facts.map((fact) => (
              <li key={fact}>{fact}</li>
            ))}
          </ul>
        </div>

        {t.scene.items.map((item, i) => (
          <div
            key={item.title}
            ref={setPanel(i + 1)}
            className={`${styles.panel} ${(i + 1) % 2 === 0 ? styles.left : styles.right}`}
          >
            <Label num={`(${String(i + 1).padStart(2, '0')})`}>{t.scene.label}</Label>
            <h2 className={styles.h2}>{item.title}</h2>
            <p className={styles.lead}>{item.text}</p>
            <ul className={styles.tags}>
              {item.tags.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
          </div>
        ))}

        <div ref={setPanel(5)} className={`${styles.panel} ${styles.right}`}>
          <Label num="05">{t.scene.systemLabel}</Label>
          <Heading a={t.scene.systemTitleA} b={t.scene.systemTitleB} className={styles.h2System} />
          <p className={styles.lead}>{t.scene.systemText}</p>
          <div className={styles.actions}>
            <Button to={PATHS.services}>{t.scene.systemCta}</Button>
          </div>
        </div>

        <div className={styles.progress} aria-hidden="true">
          <span>01</span>
          {[0, 1, 2, 3, 4].map((i) => (
            <i
              key={i}
              ref={(el) => {
                barsRef.current[i] = el;
              }}
            />
          ))}
          <span>05</span>
        </div>
        <div ref={hintRef} className={styles.hint} aria-hidden="true">
          {t.common.scroll} ↓
        </div>
      </div>
    </div>
  );
}
