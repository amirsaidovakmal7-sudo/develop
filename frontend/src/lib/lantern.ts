import { girihRadius, girihSegments, type Vec2 } from './girih';

/**
 * The girih lantern: a dodecahedron whose twelve pentagonal panels each
 * carry a girih rosette, pierced through so the ornament glows and the
 * panels themselves are solid.
 *
 * This is the object the site is built around. The flat strapwork in
 * `girih.ts` is the rule; the lantern is that rule closed into a body —
 * which is also what the real objects are: carved and pierced panels
 * assembled into a lamp.
 *
 * Everything here is computed once at startup and uploaded as static
 * buffers. There is no runtime geometry work.
 */

export interface LanternGeometry {
  /** Line list: the strapwork on every panel. */
  linePositions: Float32Array;
  /** Panel normal per line vertex — the direction a panel moves when the lantern opens. */
  lineNormals: Float32Array;
  /** 0..1 distance from the vertex to its own panel's centre, for the pulse. */
  lineRadii: Float32Array;
  /** 0..1 per-panel offset so the pulse sweeps the body instead of firing at once. */
  linePhases: Float32Array;
  /** Which of the twelve panels a vertex belongs to, so one can be singled out. */
  linePanels: Float32Array;
  lineCount: number;

  /** Triangle list: the solid panels behind the strapwork. */
  facePositions: Float32Array;
  faceNormals: Float32Array;
  facePhases: Float32Array;
  facePanels: Float32Array;
  faceCount: number;

  /** Rotation that turns each panel to face the camera — see `panelAim`. */
  aim: PanelAim[];

  /**
   * Distance from the body's centre to a panel's centre.
   *
   * Every panel of a regular dodecahedron is the same distance out, so a
   * panel's centre is simply its normal scaled by this. That identity is
   * what lets the scene take the lantern apart: each piece can be rotated
   * about its own centre in the vertex shader from the normal alone, with
   * no extra attribute and no per-panel draw call.
   */
  panelCentreDist: number;
}

/** Euler X/Y that brings a panel's normal onto the camera axis. */
export interface PanelAim {
  rx: number;
  ry: number;
}

const PHI = (1 + Math.sqrt(5)) / 2;
const INV_PHI = 1 / PHI;

type V3 = [number, number, number];

const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a: V3, b: V3): V3 => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
];
const scale = (a: V3, s: number): V3 => [a[0] * s, a[1] * s, a[2] * s];
const norm = (a: V3): V3 => {
  const l = Math.hypot(a[0], a[1], a[2]) || 1;
  return [a[0] / l, a[1] / l, a[2] / l];
};

/** The twenty dodecahedron vertices, all at the same distance from centre. */
function dodecahedronVertices(): V3[] {
  const v: V3[] = [];
  for (const x of [-1, 1]) for (const y of [-1, 1]) for (const z of [-1, 1]) v.push([x, y, z]);
  for (const a of [-INV_PHI, INV_PHI]) for (const b of [-PHI, PHI]) {
    v.push([0, a, b], [a, b, 0], [b, 0, a]);
  }
  return v;
}

/**
 * The twelve face normals, derived from the vertices rather than assumed.
 *
 * It is tempting to reach for the icosahedron's vertex directions as the
 * dual, but the two standard coordinate sets are not aligned that way — the
 * shortcut picks up five vertices that are not coplanar and the "pentagons"
 * come out as ragged wedges. Every face plane is instead read off a vertex
 * and two of its neighbours, which is true by construction.
 */
function faceNormals(verts: V3[]): V3[] {
  // All edges of a regular dodecahedron are the same length.
  let edge = Infinity;
  for (let i = 0; i < verts.length; i++) {
    for (let j = i + 1; j < verts.length; j++) {
      const d = Math.hypot(...(sub(verts[i], verts[j]) as [number, number, number]));
      if (d > 1e-6) edge = Math.min(edge, d);
    }
  }

  const out: V3[] = [];
  const seen = (n: V3) => out.some((m) => dot(m, n) > 0.999);

  for (const v of verts) {
    const neighbours = verts.filter(
      (w) => w !== v && Math.abs(Math.hypot(...(sub(v, w) as [number, number, number])) - edge) < 1e-6,
    );
    for (let i = 0; i < neighbours.length; i++) {
      for (let j = i + 1; j < neighbours.length; j++) {
        let n = norm(cross(sub(neighbours[i], v), sub(neighbours[j], v)));
        if (dot(n, v) < 0) n = scale(n, -1);
        if (!seen(n)) out.push(n);
      }
    }
  }
  return out;
}

interface Panel {
  normal: V3;
  centre: V3;
  /** Face outline in the panel's own 2D basis, counter-clockwise. */
  outline: Vec2[];
  /** Orthonormal basis of the panel plane. */
  tangent: V3;
  bitangent: V3;
  /** 0..1, drives the pulse sweep across the body. */
  phase: number;
}

/**
 * Groups the vertices onto their panels and builds a 2D frame for each, so
 * a flat rosette can be laid into it and clipped to its real pentagon.
 */
function buildPanels(): Panel[] {
  const verts = dodecahedronVertices();
  const normals = faceNormals(verts);
  const circumradius = Math.hypot(1, 1, 1);

  return normals.map((normal) => {
    // A panel's five vertices are the five furthest along its normal.
    const ranked = [...verts].sort((a, b) => dot(b, normal) - dot(a, normal)).slice(0, 5);
    const centre = scale(
      ranked.reduce<V3>((acc, v) => [acc[0] + v[0], acc[1] + v[1], acc[2] + v[2]], [0, 0, 0]),
      1 / 5,
    );

    const tangent = norm(sub(ranked[0], centre));
    const bitangent = norm(cross(normal, tangent));

    // Project the five corners into the panel plane and order them around it.
    const outline = ranked
      .map((v) => {
        const d = sub(v, centre);
        return { x: dot(d, tangent), y: dot(d, bitangent) };
      })
      .sort((a, b) => Math.atan2(a.y, a.x) - Math.atan2(b.y, b.x));

    return {
      normal,
      centre: scale(centre, 1 / circumradius),
      outline: outline.map((p) => ({ x: p.x / circumradius, y: p.y / circumradius })),
      tangent,
      bitangent,
      // Sweep from the bottom of the body to the top.
      phase: (normal[1] + 1) / 2,
    };
  });
}

/**
 * Cyrus–Beck clip of a segment against a convex polygon. Panels butt up
 * against each other, so a rosette has to be cut exactly at the pentagon
 * edge rather than merely dropped when it pokes out.
 */
function clipToPanel(a: Vec2, b: Vec2, poly: Vec2[]): [Vec2, Vec2] | null {
  let area = 0;
  for (let i = 0; i < poly.length; i++) {
    const p = poly[i];
    const q = poly[(i + 1) % poly.length];
    area += p.x * q.y - q.x * p.y;
  }
  const ccw = area > 0;

  const dx = b.x - a.x;
  const dy = b.y - a.y;
  let t0 = 0;
  let t1 = 1;

  for (let i = 0; i < poly.length; i++) {
    const p = poly[i];
    const q = poly[(i + 1) % poly.length];
    const ex = q.x - p.x;
    const ey = q.y - p.y;
    // Outward normal of this edge.
    const nx = ccw ? ey : -ey;
    const ny = ccw ? -ex : ex;

    const denom = dx * nx + dy * ny;
    const num = (p.x - a.x) * nx + (p.y - a.y) * ny;

    if (Math.abs(denom) < 1e-9) {
      if (num < 0) return null;
      continue;
    }
    const t = num / denom;
    if (denom > 0) {
      if (t < t1) t1 = t;
    } else if (t > t0) {
      t0 = t;
    }
    if (t0 > t1) return null;
  }

  return [
    { x: a.x + dx * t0, y: a.y + dy * t0 },
    { x: a.x + dx * t1, y: a.y + dy * t1 },
  ];
}

/**
 * How much of the flat patch goes on a panel. The patch grew when it was
 * regenerated with more rings, so this fraction is small: it selects the
 * dense central rosette — the ring of ten-pointed stars — and leaves the
 * sparse outer field out, which at panel size would only read as noise.
 */
const ROSETTE_FIT = 0.15;
/** Lifts the strapwork clear of its own panel so it is never z-fought. */
const RELIEF = 0.012;
/**
 * The rosette is clipped to a slightly smaller pentagon than the panel, so
 * every panel keeps a solid border — the frame a pierced panel actually has.
 * Without it the clip leaves a comb of millimetre stubs along every edge and
 * the silhouette turns furry.
 */
const PANEL_INSET = 0.86;
/** Clipped remnants shorter than this are dropped rather than drawn as dust. */
const MIN_SEGMENT = 0.012;

export function buildLantern(): LanternGeometry {
  const panels = buildPanels();
  const segments = girihSegments();
  const patchScale = 1 / (girihRadius() * ROSETTE_FIT);

  // Pentagon inradius in the normalised body — the rosette is sized to it.
  const sample = panels[0];
  let inradius = Infinity;
  for (let i = 0; i < sample.outline.length; i++) {
    const p = sample.outline[i];
    const q = sample.outline[(i + 1) % sample.outline.length];
    const mid = { x: (p.x + q.x) / 2, y: (p.y + q.y) / 2 };
    inradius = Math.min(inradius, Math.hypot(mid.x, mid.y));
  }

  const linePos: number[] = [];
  const lineNrm: number[] = [];
  const lineRad: number[] = [];
  const linePhs: number[] = [];
  const linePnl: number[] = [];
  const facePos: number[] = [];
  const faceNrm: number[] = [];
  const facePhs: number[] = [];
  const facePnl: number[] = [];

  panels.forEach((panel, panelIndex) => {
    const lift = scale(panel.normal, RELIEF);
    const clipOutline = panel.outline.map((p) => ({ x: p.x * PANEL_INSET, y: p.y * PANEL_INSET }));
    const place = (p: Vec2): V3 => [
      panel.centre[0] + panel.tangent[0] * p.x + panel.bitangent[0] * p.y + lift[0],
      panel.centre[1] + panel.tangent[1] * p.x + panel.bitangent[1] * p.y + lift[1],
      panel.centre[2] + panel.tangent[2] * p.x + panel.bitangent[2] * p.y + lift[2],
    ];

    for (const [a, b] of segments) {
      const a2 = { x: a.x * patchScale * inradius, y: a.y * patchScale * inradius };
      const b2 = { x: b.x * patchScale * inradius, y: b.y * patchScale * inradius };
      const clipped = clipToPanel(a2, b2, clipOutline);
      if (!clipped) continue;
      if (Math.hypot(clipped[1].x - clipped[0].x, clipped[1].y - clipped[0].y) < MIN_SEGMENT) continue;

      for (const p of clipped) {
        const world = place(p);
        linePos.push(world[0], world[1], world[2]);
        lineNrm.push(panel.normal[0], panel.normal[1], panel.normal[2]);
        lineRad.push(Math.min(1, Math.hypot(p.x, p.y) / inradius));
        linePhs.push(panel.phase);
        linePnl.push(panelIndex);
      }
    }

    // The solid panel behind it, as a fan of five triangles.
    for (let i = 0; i < panel.outline.length; i++) {
      const p = panel.outline[i];
      const q = panel.outline[(i + 1) % panel.outline.length];
      for (const point of [{ x: 0, y: 0 }, p, q]) {
        const world: V3 = [
          panel.centre[0] + panel.tangent[0] * point.x + panel.bitangent[0] * point.y,
          panel.centre[1] + panel.tangent[1] * point.x + panel.bitangent[1] * point.y,
          panel.centre[2] + panel.tangent[2] * point.x + panel.bitangent[2] * point.y,
        ];
        facePos.push(world[0], world[1], world[2]);
        faceNrm.push(panel.normal[0], panel.normal[1], panel.normal[2]);
        facePhs.push(panel.phase);
        facePnl.push(panelIndex);
      }
    }
  });

  return {
    linePositions: new Float32Array(linePos),
    lineNormals: new Float32Array(lineNrm),
    lineRadii: new Float32Array(lineRad),
    linePhases: new Float32Array(linePhs),
    linePanels: new Float32Array(linePnl),
    lineCount: linePos.length / 3,
    facePositions: new Float32Array(facePos),
    faceNormals: new Float32Array(faceNrm),
    facePhases: new Float32Array(facePhs),
    facePanels: new Float32Array(facePnl),
    faceCount: facePos.length / 3,
    aim: panels.map((panel) => panelAim(panel.normal)),
    panelCentreDist: Math.hypot(...panels[0].centre),
  };
}

/**
 * The rotation that turns a panel square-on to the camera.
 *
 * The scene composes its model matrix as Rx · Ry, so the two angles are
 * solved in that order: the Y turn swings the normal into the YZ plane, and
 * the X turn lifts it onto the camera axis. This is what lets the lantern
 * present a specific face — the twelve panels stand in for the twelve
 * projects, so pointing at a project in the index can turn its panel
 * forward.
 */
function panelAim(normal: V3): PanelAim {
  const [x, y, z] = normal;
  return {
    ry: Math.atan2(-x, z),
    rx: Math.atan2(y, Math.hypot(x, z)),
  };
}
