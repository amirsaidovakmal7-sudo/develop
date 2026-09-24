import { GIRIH_CANON, GIRIH_PATCH, type GirihTile } from '../scene/girihPatch.generated';

/**
 * Girih strapwork.
 *
 * `girihPatch.generated.ts` gives the tiling itself (Lu & Steinhardt's five
 * tiles, edge-matched outwards from a central decagon). The ornament is not
 * the tile outlines — it is the *strapwork*: in the historical construction
 * two lines leave the midpoint of every tile edge at 54° to that edge and
 * run into the tile until they meet another such line. Because neighbouring
 * tiles share an edge (and therefore its midpoint), the straps continue
 * across tile boundaries and the underlying tiling disappears, leaving the
 * interlaced ten-fold pattern.
 *
 * Everything here is pure geometry with no three.js dependency, so the same
 * segments feed the WebGL field, the SVG section rosettes and the static
 * reduced-motion poster.
 */

export interface Vec2 {
  x: number;
  y: number;
}
export type Segment = [Vec2, Vec2];

const EPS = 1e-6;
/** Angle between a strap and the edge it crosses — 54° in the girih system. */
const STRAP_ANGLE = (54 * Math.PI) / 180;

function rotate(v: Vec2, a: number): Vec2 {
  const c = Math.cos(a);
  const s = Math.sin(a);
  return { x: v.x * c - v.y * s, y: v.x * s + v.y * c };
}

function cross(a: Vec2, b: Vec2): number {
  return a.x * b.y - a.y * b.x;
}

function signedArea(poly: Vec2[]): number {
  let sum = 0;
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i];
    const b = poly[(i + 1) % poly.length];
    sum += a.x * b.y - b.x * a.y;
  }
  return sum / 2;
}

function pointInPolygon(p: Vec2, poly: Vec2[]): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const a = poly[i];
    const b = poly[j];
    if (a.y > p.y !== b.y > p.y && p.x < ((b.x - a.x) * (p.y - a.y)) / (b.y - a.y) + a.x) {
      inside = !inside;
    }
  }
  return inside;
}

/** Places one canonical tile into the patch (rotate, then translate). */
function placeTile(tile: GirihTile): Vec2[] {
  const canon = GIRIH_CANON[tile.type];
  return canon.map(([x, y]) => {
    const r = rotate({ x, y }, tile.r);
    return { x: r.x + tile.x, y: r.y + tile.y };
  });
}

/**
 * Builds the strap segments inside a single tile. Every edge midpoint emits
 * two rays at ±54° to that edge, and each ray runs on until it reaches
 * another edge of the same tile — where, because of how the five tiles are
 * proportioned, it arrives at that edge's midpoint and carries straight on
 * into the neighbouring tile. Straps cross one another on the way; a
 * crossing is not an endpoint, which is what makes the pattern read as a
 * continuous interlace rather than a field of stubs.
 *
 * The containment probe matters for the bowtie, whose 216° notch means a
 * ray can leave and re-enter the outline.
 */
function strapsForTile(poly: Vec2[]): Segment[] {
  const n = poly.length;
  // Consistent winding gives a reliable "which side is inside" normal.
  const ccw = signedArea(poly) > 0;
  const mids: Vec2[] = [];
  const dirs: Vec2[] = [];

  for (let i = 0; i < n; i++) {
    const a = poly[i];
    const b = poly[(i + 1) % n];
    const ex = b.x - a.x;
    const ey = b.y - a.y;
    const len = Math.hypot(ex, ey) || 1;
    mids.push({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });
    dirs.push({ x: ex / len, y: ey / len });
  }

  const out: Segment[] = [];
  // 54° from the edge is 36° off the inward normal, mirrored either side.
  const off = Math.PI / 2 - STRAP_ANGLE;

  for (let i = 0; i < n; i++) {
    const inward: Vec2 = ccw ? { x: -dirs[i].y, y: dirs[i].x } : { x: dirs[i].y, y: -dirs[i].x };

    for (const sign of [1, -1]) {
      const dir = rotate(inward, off * sign);
      let best = Infinity;
      let hit: Vec2 | null = null;

      // Nearest crossing with another *edge* of the tile — the far midpoint.
      for (let j = 0; j < n; j++) {
        if (j === i) continue;
        const a = poly[j];
        const b = poly[(j + 1) % n];
        const edge: Vec2 = { x: b.x - a.x, y: b.y - a.y };
        const denom = cross(dir, edge);
        if (Math.abs(denom) < EPS) continue;
        const delta: Vec2 = { x: a.x - mids[i].x, y: a.y - mids[i].y };
        const t = cross(delta, edge) / denom;
        const u = cross(delta, dir) / denom;
        if (t <= EPS || u < -EPS || u > 1 + EPS || t >= best) continue;

        const p: Vec2 = { x: mids[i].x + dir.x * t, y: mids[i].y + dir.y * t };
        const probe: Vec2 = { x: (mids[i].x + p.x) / 2, y: (mids[i].y + p.y) / 2 };
        if (!pointInPolygon(probe, poly)) continue;

        best = t;
        hit = p;
      }

      if (hit) out.push([mids[i], hit]);
    }
  }
  return out;
}

const key = (s: Segment) => {
  const r = (v: number) => Math.round(v * 1000) / 1000;
  const a = `${r(s[0].x)},${r(s[0].y)}`;
  const b = `${r(s[1].x)},${r(s[1].y)}`;
  return a < b ? `${a}|${b}` : `${b}|${a}`;
};

let cached: Segment[] | null = null;

/** Every strap segment in the generated patch, de-duplicated. */
export function girihSegments(): Segment[] {
  if (cached) return cached;
  const seen = new Set<string>();
  const out: Segment[] = [];
  for (const tile of GIRIH_PATCH) {
    for (const seg of strapsForTile(placeTile(tile))) {
      const k = key(seg);
      if (seen.has(k)) continue;
      seen.add(k);
      out.push(seg);
    }
  }
  cached = out;
  return out;
}

/** Radius of the outermost strap vertex — used to normalise the pattern. */
export function girihRadius(): number {
  let max = 0;
  for (const [a, b] of girihSegments()) {
    max = Math.max(max, Math.hypot(a.x, a.y), Math.hypot(b.x, b.y));
  }
  return max || 1;
}

/**
 * Line-list buffers for WebGL: `positions` (xyz per vertex) and `radii`
 * (0..1 distance of each vertex from the centre, which drives the shader
 * pulse travelling outward along the straps).
 *
 * `maxRadius` trims the patch's ragged outer ring — the boundary tiles have
 * no neighbours, so their straps shoot off as long stray lines that read as
 * noise rather than pattern. What is kept is re-normalised to span 0..1.
 */
export function girihLineBuffers(maxRadius = 1) {
  const norm = 1 / girihRadius();
  const fit = Number.isFinite(maxRadius) ? Math.max(maxRadius, 0.05) : 1;
  const kept = girihSegments().filter(
    ([a, b]) => Math.hypot(a.x, a.y) * norm <= fit && Math.hypot(b.x, b.y) * norm <= fit,
  );

  const positions = new Float32Array(kept.length * 6);
  const radii = new Float32Array(kept.length * 2);
  const scale = norm / fit;

  kept.forEach(([a, b], i) => {
    positions[i * 6] = a.x * scale;
    positions[i * 6 + 1] = a.y * scale;
    positions[i * 6 + 2] = 0;
    positions[i * 6 + 3] = b.x * scale;
    positions[i * 6 + 4] = b.y * scale;
    positions[i * 6 + 5] = 0;
    radii[i * 2] = Math.hypot(a.x, a.y) * scale;
    radii[i * 2 + 1] = Math.hypot(b.x, b.y) * scale;
  });

  return { positions, radii, count: kept.length * 2 };
}

/**
 * The same strapwork as an SVG path, normalised so that the portion kept by
 * `maxRadius` fills a `size`-wide viewBox. Used for the section rosettes,
 * the header mark and the poster that stands in for the WebGL field —
 * identical geometry, no canvas cost.
 *
 * Fitting to the kept radius (rather than always to the full patch) is what
 * lets a 26px wordmark show a legible decagram instead of a smudge of the
 * whole tiling.
 */
export function girihSvgPath(size = 100, maxRadius = 1): string {
  const fit = Number.isFinite(maxRadius) ? Math.max(maxRadius, 0.02) : 1;
  const norm = 1 / girihRadius();
  const half = size / 2;
  const parts: string[] = [];

  for (const [a, b] of girihSegments()) {
    const ra = Math.hypot(a.x, a.y) * norm;
    const rb = Math.hypot(b.x, b.y) * norm;
    if (ra > fit || rb > fit) continue;
    const f = (v: number) => (Math.round((((v * norm) / fit) * half + half) * 100) / 100).toString();
    parts.push(`M${f(a.x)} ${f(a.y)}L${f(b.x)} ${f(b.y)}`);
  }
  return parts.join('');
}
