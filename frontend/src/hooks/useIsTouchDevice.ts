import { useEffect, useState } from 'react';

/**
 * Detects coarse-pointer / touch devices so the custom cursor and hover-only
 * interactions can be disabled on mobile (TECH_TASK_REDISIGN.md п.10, п.38).
 */
export function useIsTouchDevice(): boolean {
  const [isTouch, setIsTouch] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(pointer: coarse)').matches : false,
  );

  useEffect(() => {
    const mql = window.matchMedia('(pointer: coarse)');
    const onChange = () => setIsTouch(mql.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  return isTouch;
}
