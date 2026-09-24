#!/usr/bin/env node
/**
 * Generates the girih tile patch used by the hero 3D scene and the static SVG
 * poster. Five tile types (Lu & Steinhardt), all edges length 1, interior angles
 * are multiples of 36 degrees. The patch is grown from a central decagon by
 * edge-matching, keeping 10-fold rotational symmetry.
 *
 * Usage: node scripts/gen-girih.mjs [--svg out.svg]
 * Output: src/scene/girihPatch.generated.ts
 */
import { writeFileSync } from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const D2R = Math.PI / 180;
const EPS = 1e-4;

export const TILE_ANGLES = {
  decagon: [144, 144, 144, 144, 144, 144, 144, 144, 144, 144],
  pentagon: [108, 108, 108, 108, 108],
  hexagon: [72, 144, 144, 72, 144, 144],
  bowtie: [72, 72, 216, 72, 72, 216],
  rhombus: [72, 108, 72, 108],
};
const TYPES = Object.keys(TILE_ANGLES);

function polygonOf(type) {
  let x = 0, y = 0, h = 0;
  const pts = [];
  for (const interior of TILE_ANGLES[type]) {
    pts.push([x, y]);
    x += Math.cos(h * D2R);
    y += Math.sin(h * D2R);
    h += 180 - interior;
  }
  return pts;
}

const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
const same = (a, b) => dist(a, b) < EPS;

function area(p) {
  let s = 0;
  for (let i = 0; i < p.length; i++) {
    const a = p[i], b = p[(i + 1) % p.length];
    s += a[0] * b[1] - b[0] * a[1];
  }
  return s / 2;
}

function pointInPoly(pt, poly) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j];
    if (yi > pt[1] !== yj > pt[1] && pt[0] < ((xj - xi) * (pt[1] - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

function segCross(a, b, c, d) {
  const o = (p, q, r) => (q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0]);
  const o1 = o(a, b, c), o2 = o(a, b, d), o3 = o(c, d, a), o4 = o(c, d, b);
  const e = 1e-6;
  return ((o1 > e && o2 < -e) || (o1 < -e && o2 > e)) && ((o3 > e && o4 < -e) || (o3 < -e && o4 > e));
}

/** Interior sample points: nudge every edge midpoint and vertex slightly inward. */
function samples(poly) {
  const out = [];
  const n = poly.length;
  for (let i = 0; i < n; i++) {
    const a = poly[i], b = poly[(i + 1) % n];
    const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
    const dx = b[0] - a[0], dy = b[1] - a[1];
    const l = Math.hypot(dx, dy);
    out.push([mx - (dy / l) * 0.06, my + (dx / l) * 0.06]); // CCW: interior on the left
    const p = poly[(i + n - 1) % n];
    const v1 = [a[0] - p[0], a[1] - p[1]], v2 = [b[0] - a[0], b[1] - a[1]];
    const bis = [-v1[0] / Math.hypot(...v1) + v2[0] / Math.hypot(...v2), -v1[1] / Math.hypot(...v1) + v2[1] / Math.hypot(...v2)];
    const bl = Math.hypot(...bis) || 1;
    // inward direction at vertex: bisector of the two edges leaving vertex a (towards p and towards b)
    out.push([a[0] + (bis[0] / bl) * 0.05, a[1] + (bis[1] / bl) * 0.05]);
  }
  let cx = 0, cy = 0;
  for (const p of poly) { cx += p[0]; cy += p[1]; }
  out.push([cx / n, cy / n]);
  return out.filter((s) => pointInPoly(s, poly));
}

function overlaps(A, B) {
  for (const s of samples(A)) if (pointInPoly(s, B)) return true;
  for (const s of samples(B)) if (pointInPoly(s, A)) return true;
  for (let i = 0; i < A.length; i++)
    for (let j = 0; j < B.length; j++)
      if (segCross(A[i], A[(i + 1) % A.length], B[j], B[(j + 1) % B.length])) return true;
  return false;
}

function transformTo(poly, j, b, a) {
  // map poly edge j (v_j -> v_{j+1}) onto b -> a
  const v0 = poly[j], v1 = poly[(j + 1) % poly.length];
  const ang = Math.atan2(a[1] - b[1], a[0] - b[0]) - Math.atan2(v1[1] - v0[1], v1[0] - v0[0]);
  const c = Math.cos(ang), s = Math.sin(ang);
  return poly.map(([x, y]) => {
    const dx = x - v0[0], dy = y - v0[1];
    return [b[0] + dx * c - dy * s, b[1] + dx * s + dy * c];
  });
}

const rot = (poly, deg) => {
  const c = Math.cos(deg * D2R), s = Math.sin(deg * D2R);
  return poly.map(([x, y]) => [x * c - y * s, x * s + y * c]);
};

function edgesOf(poly) {
  return poly.map((p, i) => [p, poly[(i + 1) % poly.length]]);
}

function centroid(poly) {
  let a = 0, cx = 0, cy = 0;
  for (let i = 0; i < poly.length; i++) {
    const p = poly[i], q = poly[(i + 1) % poly.length];
    const f = p[0] * q[1] - q[0] * p[1];
    a += f; cx += (p[0] + q[0]) * f; cy += (p[1] + q[1]) * f;
  }
  a *= 0.5;
  return [cx / (6 * a), cy / (6 * a)];
}

// ── grow ────────────────────────────────────────────────────────────────
const MAX_TILES = Number(process.argv.find((x) => x.startsWith('--max='))?.slice(6) ?? 121);
const R_MAX = Number(process.argv.find((x) => x.startsWith('--r='))?.slice(4) ?? 8.4);

const dec = polygonOf('decagon');
{
  const c = centroid(dec);
  for (const p of dec) { p[0] -= c[0]; p[1] -= c[1]; }
}
let tiles = [{ type: 'decagon', poly: dec }];

// Seed: 10 pentagons on the decagon edges — the classic rosette (144 + 108 + 108 = 360 at every vertex).
{
  const pent = polygonOf('pentagon');
  for (const [a, b] of edgesOf(dec)) tiles.push({ type: 'pentagon', poly: transformTo(pent, 0, b, a) });
}
const ONLY_FORCED = !process.argv.includes('--free');

function boundaryEdges() {
  // edges appearing once (as directed a->b) with no opposite b->a partner
  const all = [];
  for (const t of tiles) for (const e of edgesOf(t.poly)) all.push(e);
  return all.filter(([a, b]) => !all.some(([c, d]) => same(a, d) && same(b, c)));
}

function sharedCount(poly, boundary) {
  let n = 0;
  for (const [p, q] of edgesOf(poly))
    if (boundary.some(([a, b]) => same(p, b) && same(q, a))) n++;
  return n;
}

const PREF = { pentagon: 1.0, rhombus: 1.0, hexagon: 1.0, bowtie: 1.0, decagon: 1.0 };

for (let guard = 0; guard < 400 && tiles.length < MAX_TILES; guard++) {
  const boundary = boundaryEdges().filter(([a, b]) => Math.hypot((a[0] + b[0]) / 2, (a[1] + b[1]) / 2) < R_MAX);
  let best = null;
  for (const [a, b] of boundary) {
    for (const type of TYPES) {
      const base = polygonOf(type);
      for (let j = 0; j < base.length; j++) {
        const cand = transformTo(base, j, b, a);
        if (tiles.some((t) => overlaps(cand, t.poly))) continue;
        const shared = sharedCount(cand, boundary);
        if (ONLY_FORCED && shared < 2) continue;
        const c = centroid(cand);
        const r = Math.hypot(c[0], c[1]);
        // forced fills (>=2 shared edges) first, then nearest-to-centre; prefer calm tile types
        const score = shared * 10 * PREF[type] - r * 0.6;
        if (!best || score > best.score) best = { score, type, poly: cand, shared };
      }
    }
  }
  if (!best) break;
  // add the whole 10-fold orbit
  let added = 0;
  for (let k = 0; k < 10; k++) {
    const p = rot(best.poly, k * 36);
    if (!tiles.some((t) => overlaps(p, t.poly)) && !tiles.some((t) => t.type === best.type && same(centroid(t.poly), centroid(p)))) {
      tiles.push({ type: best.type, poly: p });
      added++;
    }
  }
  if (!added) break;
}

const out = tiles.map((t) => {
  const c = centroid(t.poly);
  // canonical frame: rotation = angle of first vertex from centroid vs the canonical polygon's first vertex
  const base = polygonOf(t.type);
  const bc = centroid(base);
  const a0 = Math.atan2(base[0][1] - bc[1], base[0][0] - bc[0]);
  const a1 = Math.atan2(t.poly[0][1] - c[1], t.poly[0][0] - c[0]);
  return { type: t.type, x: +c[0].toFixed(4), y: +c[1].toFixed(4), r: +(a1 - a0).toFixed(5) };
});

const counts = {};
for (const t of out) counts[t.type] = (counts[t.type] || 0) + 1;
console.log('tiles', out.length, counts, 'signed area check', tiles.every((t) => area(t.poly) > 0));

// canonical polygons centred on centroid
const canon = {};
for (const type of TYPES) {
  const p = polygonOf(type);
  const c = centroid(p);
  canon[type] = p.map(([x, y]) => [+(x - c[0]).toFixed(4), +(y - c[1]).toFixed(4)]);
}

const ts = `// AUTO-GENERATED by scripts/gen-girih.mjs — do not edit by hand.
// Girih tiles (unit edge). Each patch tile: canonical type + centre + rotation (radians).
export type GirihType = 'decagon' | 'pentagon' | 'hexagon' | 'bowtie' | 'rhombus';
export interface GirihTile { type: GirihType; x: number; y: number; r: number }

export const GIRIH_CANON: Record<GirihType, [number, number][]> = ${JSON.stringify(canon)};

export const GIRIH_PATCH: GirihTile[] = ${JSON.stringify(out)};
`;
writeFileSync(path.join(ROOT, 'src/scene/girihPatch.generated.ts'), ts);

const svgArg = process.argv.indexOf('--svg');
if (svgArg > 0) {
  const colors = { decagon: '#2447C5', pentagon: '#2CC6B8', hexagon: '#E9A93B', bowtie: '#C8502E', rhombus: '#EFE7D6' };
  const R = 10;
  const s = 45;
  const body = tiles.map((t) => `<polygon points="${t.poly.map(([x, y]) => `${(x * s + R * s).toFixed(1)},${(-y * s + R * s).toFixed(1)}`).join(' ')}" fill="${colors[t.type]}" stroke="#070C1F" stroke-width="2"/>`).join('');
  writeFileSync(process.argv[svgArg + 1], `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${2 * R * s} ${2 * R * s}" width="900" height="900"><rect width="100%" height="100%" fill="#070C1F"/>${body}</svg>`);
}
