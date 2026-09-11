/**
 * Single global scroll listener (mirrors pointerStore.ts) — scenes and
 * scroll-linked components read `scrollState.y` directly inside their own
 * rAF/useFrame loop instead of subscribing individually, keeping scroll
 * reactive 3D smooth without triggering React re-renders per pixel.
 */
export const scrollState = { y: 0 };

let initialized = false;

export function initScrollStore() {
  if (initialized || typeof window === 'undefined') return;
  initialized = true;
  const update = () => {
    scrollState.y = window.scrollY;
  };
  update();
  window.addEventListener('scroll', update, { passive: true });
}

/** Progress (0..1) of how far `el` has scrolled through the viewport, top to bottom. */
export function elementScrollProgress(el: HTMLElement): number {
  const rect = el.getBoundingClientRect();
  const vh = window.innerHeight || 1;
  const total = rect.height + vh;
  const passed = vh - rect.top;
  return Math.min(1, Math.max(0, passed / total));
}
