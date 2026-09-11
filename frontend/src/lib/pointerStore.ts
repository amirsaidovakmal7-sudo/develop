/**
 * Global pointer position/velocity store, updated once on `pointermove` and
 * read directly (no React re-renders) by the custom cursor and R3F scenes
 * inside their own rAF/useFrame loops — keeps 3D + cursor motion smooth
 * without cascading component updates on every mouse pixel.
 */
export interface PointerState {
  /** Viewport pixel coordinates. */
  clientX: number;
  clientY: number;
  /** Normalized -1..1, origin center, y-up (matches WebGL/NDC convention). */
  nx: number;
  ny: number;
  vx: number;
  vy: number;
  active: boolean;
}

export const pointerState: PointerState = {
  clientX: 0,
  clientY: 0,
  nx: 0,
  ny: 0,
  vx: 0,
  vy: 0,
  active: false,
};

let lastX = 0;
let lastY = 0;
let lastT = 0;
let initialized = false;

function handleMove(e: PointerEvent) {
  const now = performance.now();
  const dt = lastT ? Math.max(now - lastT, 1) : 16;
  pointerState.clientX = e.clientX;
  pointerState.clientY = e.clientY;
  pointerState.nx = (e.clientX / window.innerWidth) * 2 - 1;
  pointerState.ny = -((e.clientY / window.innerHeight) * 2 - 1);
  pointerState.vx = (e.clientX - lastX) / dt;
  pointerState.vy = (e.clientY - lastY) / dt;
  pointerState.active = true;
  lastX = e.clientX;
  lastY = e.clientY;
  lastT = now;
}

function handleLeave() {
  pointerState.active = false;
}

export function initPointerStore() {
  if (initialized || typeof window === 'undefined') return;
  initialized = true;
  window.addEventListener('pointermove', handleMove, { passive: true });
  window.addEventListener('pointerleave', handleLeave, { passive: true });
}
