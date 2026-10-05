import { useEffect, useRef, useState } from 'react';

interface Options {
  /** Fraction of the element that must be visible before it counts. */
  amount?: number;
  /** Stop observing after the first entry (the default — reveals run once). */
  once?: boolean;
  rootMargin?: string;
}

/**
 * Single IntersectionObserver-based entry hook for the whole app.
 *
 * Every reveal on the site goes through this, so there is exactly one place
 * where observers are created and disconnected — no per-component listener
 * bookkeeping, and nothing left observing after unmount.
 */
export function useInView<T extends HTMLElement = HTMLElement>({
  amount = 0.25,
  once = true,
  rootMargin = '0px 0px -8% 0px',
}: Options = {}) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Elements already on screen at mount (the hero) should not wait for a
    // scroll event to resolve — IntersectionObserver fires immediately, but
    // only once the callback is scheduled, so this is just the normal path.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            if (once) observer.unobserve(entry.target);
          } else if (!once) {
            setInView(false);
          }
        }
      },
      { threshold: amount, rootMargin },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [amount, once, rootMargin]);

  return { ref, inView };
}
