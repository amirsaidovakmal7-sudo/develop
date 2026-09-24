import { useMemo } from 'react';
import { girihSvgPath } from '../../lib/girih';

interface GirihMarkProps {
  /** How much of the rosette to draw, 0..1 of its full radius. */
  radius?: number;
  className?: string;
  /** Stroke width in viewBox units (the viewBox is always 100 wide). */
  weight?: number;
}

/**
 * The same strapwork as the WebGL field, drawn flat as SVG.
 *
 * Used for the section rosettes, the header mark and — importantly — as the
 * whole field's stand-in when WebGL is unavailable or the visitor asked for
 * reduced motion. The identity survives without a single frame of animation,
 * which is the point: the geometry is the brand, the movement is not.
 */
export function GirihMark({ radius = 1, className, weight = 0.35 }: GirihMarkProps) {
  const d = useMemo(() => girihSvgPath(100, radius), [radius]);

  return (
    <svg className={className} viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      <path d={d} fill="none" stroke="currentColor" strokeWidth={weight} vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
