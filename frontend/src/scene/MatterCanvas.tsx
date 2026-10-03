import { useEffect, useRef } from 'react';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { createParticleEngine } from './engine';
import { FORM } from './shapes';

export type MatterVariant = 'knot' | 'monogram' | 'lattice';

const CONFIG: Record<MatterVariant, { form: number; count: number; distance: number; size: number; yaw: (t: number) => number }> = {
  knot: { form: FORM.knot, count: 9000, distance: 3.9, size: 15, yaw: (t) => t * 0.16 },
  // The monogram is a flat solid: it sways to show its depth instead of turning its back to the reader.
  monogram: { form: FORM.monogram, count: 22000, distance: 4.1, size: 17, yaw: (t) => Math.sin(t * 0.45) * 0.6 },
  lattice: { form: FORM.lattice, count: 16000, distance: 4.0, size: 15, yaw: (t) => t * 0.12 },
};

/** Small standalone particle object — the same matter as the home scene, in one fixed form. */
export function MatterCanvas({ className, variant = 'knot' }: { className?: string; variant?: MatterVariant }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = ref.current!;
    const cfg = CONFIG[variant];
    // Phones get the same object with fewer particles; the canvas there is small anyway.
    const narrow = window.matchMedia('(max-width: 899px)').matches;
    const engine = createParticleEngine(canvas, narrow ? Math.round(cfg.count * 0.55) : cfg.count);
    if (!engine) return;

    const mouse = { x: 0, y: 0, on: 0, sx: 0, sy: 0, son: 0 };
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      mouse.y = -(((e.clientY - r.top) / r.height) * 2 - 1);
      mouse.on = Math.abs(mouse.x) < 1.2 && Math.abs(mouse.y) < 1.2 ? 1 : 0;
    };
    window.addEventListener('pointermove', onMove, { passive: true });

    let visible = false;
    let intro = reduced ? 1 : 0;
    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
    io.observe(canvas);
    const onResize = () => engine.resize();
    window.addEventListener('resize', onResize);

    let raf = 0;
    let last = performance.now();
    let time = 0;
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!visible || document.hidden) return;
      time += reduced ? 0 : dt;
      intro = Math.min(1, intro + dt / 2.2);
      const k = 1 - Math.exp(-dt * 5);
      mouse.sx += (mouse.x - mouse.sx) * k;
      mouse.sy += (mouse.y - mouse.sy) * k;
      mouse.son += (mouse.on - mouse.son) * k;
      engine.render({
        a: cfg.form,
        b: cfg.form,
        mix: 0,
        offA: [0, 0, 0],
        offB: [0, 0, 0],
        arc: 0,
        yaw: cfg.yaw(time) + mouse.sx * 0.35,
        pitch: -mouse.sy * 0.2 + 0.08,
        time: reduced ? 8 : time,
        motion: reduced ? 0 : 1,
        mouse: { x: mouse.sx, y: mouse.sy, on: mouse.son },
        size: narrow ? cfg.size * 1.15 : cfg.size,
        distance: cfg.distance,
        scale: 1,
        intro: 1 - (1 - intro) ** 3,
      });
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('resize', onResize);
      engine.destroy();
    };
  }, [reduced, variant]);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
