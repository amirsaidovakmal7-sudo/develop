import { useEffect, useRef, useState } from 'react';
import { GirihMark } from '../../components/GirihMark/GirihMark';
import { useIsTouchDevice } from '../../hooks/useIsTouchDevice';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { startScene } from './webglScene';
import styles from './GirihField.module.css';

/** Last resort when WebGL2 is missing: the same geometry, flat and still. */
function Poster() {
  return (
    <div className={styles.poster} aria-hidden="true">
      <GirihMark className={styles.posterMark} weight={0.5} />
    </div>
  );
}

/**
 * The lantern behind the page.
 *
 * It is one object for the whole site rather than a hero-only ornament: it
 * reads the scroll position and moves through a choreography tied to the
 * sections — closed over the hero, receded while the work is on screen,
 * opened through the explanation, closed again for the order form.
 *
 * Reduced motion still gets the object, composed as a single static frame
 * that redraws on scroll; only a device without WebGL2 falls back to the
 * flat poster.
 */
/**
 * What the device actually reports, shown on the page itself.
 *
 * Opened with `?scene-debug` on a real phone. Emulating a phone in a desktop
 * browser gets the viewport and the touch flags right and everything that
 * matters here wrong — the GPU, the pixel ratio, and whether the reader has
 * Reduce Motion switched on system-wide. Those are the three things that can
 * each make the object vanish, and none of them can be guessed from here.
 */
function SceneDebug({ reducedMotion, isTouch, failed }: {
  reducedMotion: boolean;
  isTouch: boolean;
  failed: boolean;
}) {
  const [info, setInfo] = useState<string[]>([]);

  useEffect(() => {
    const probe = document.createElement('canvas');
    const gl = probe.getContext('webgl2');
    const debugInfo = gl?.getExtension('WEBGL_debug_renderer_info');
    const canvas = document.querySelector('canvas');
    let frames = 0;
    let fps = 0;
    let last = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      frames += 1;
      if (now - last >= 1000) {
        fps = frames;
        frames = 0;
        last = now;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const read = () =>
      setInfo([
        `webgl2: ${gl ? 'yes' : 'NO — poster fallback'}`,
        `gpu: ${debugInfo ? String(gl?.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)).slice(0, 34) : 'hidden'}`,
        `poster showing: ${failed ? 'YES' : 'no'}`,
        `reduce motion: ${reducedMotion ? 'ON — object is held still' : 'off'}`,
        `touch: ${isTouch ? 'yes' : 'no'}`,
        `dpr: ${window.devicePixelRatio}`,
        `canvas: ${canvas ? `${canvas.width}x${canvas.height}` : 'none'}`,
        `css: ${canvas ? `${Math.round(canvas.clientWidth)}x${Math.round(canvas.clientHeight)}` : 'none'}`,
        `fps: ${fps}`,
        `scroll: ${(window.scrollY / Math.max(1, document.documentElement.scrollHeight - window.innerHeight)).toFixed(2)}`,
      ]);
    read();
    const timer = window.setInterval(read, 500);
    return () => {
      window.clearInterval(timer);
      cancelAnimationFrame(raf);
    };
  }, [reducedMotion, isTouch, failed]);

  return (
    <pre className={styles.debug}>
      {info.map((line) => (
        <div key={line.slice(0, line.indexOf(':'))}>{line}</div>
      ))}
    </pre>
  );
}

export function GirihField() {
  const reducedMotion = usePrefersReducedMotion();
  const isTouch = useIsTouchDevice();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);
  const debug =
    typeof window !== 'undefined' && window.location.search.includes('scene-debug');

  useEffect(() => {
    if (!canvasRef.current) return;
    const handle = startScene(canvasRef.current, { lowPower: isTouch, still: reducedMotion });
    if (!handle) {
      setFailed(true);
      return;
    }
    return () => handle.stop();
  }, [reducedMotion, isTouch]);

  if (failed) {
    return (
      <>
        <Poster />
        {debug && <SceneDebug reducedMotion={reducedMotion} isTouch={isTouch} failed />}
      </>
    );
  }

  return (
    <>
      <div className={styles.field} aria-hidden="true">
        <canvas ref={canvasRef} className={styles.canvas} />
      </div>
      <div className={styles.vignette} aria-hidden="true" />
      {debug && <SceneDebug reducedMotion={reducedMotion} isTouch={isTouch} failed={false} />}
    </>
  );
}
