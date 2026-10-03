/**
 * Target positions for every particle in every form, packed into one RGBA32F
 * texture: row block `s` holds form `s`, texel `i` holds particle `i`.
 * Form 0 (the flowing knot) stores parameters instead of positions — the
 * vertex shader evaluates it every frame so the particles actually flow.
 */
export const TEX_WIDTH = 256;
export const FORM_COUNT = 9;
export const FORM = { knot: 0, website: 1, plane: 2, phone: 3, funnel: 4, system: 5, cloud: 6, monogram: 7, lattice: 8 } as const;

type V3 = [number, number, number];
type Gen = () => V3;

const R = Math.random;
const gauss = () => Math.sqrt(-2 * Math.log(R() + 1e-9)) * Math.cos(6.2831853 * R());

function rot3([x, y, z]: V3, ax: number, ay: number, az: number): V3 {
  let c = Math.cos(ax);
  let s = Math.sin(ax);
  [y, z] = [y * c - z * s, y * s + z * c];
  c = Math.cos(ay);
  s = Math.sin(ay);
  [x, z] = [x * c + z * s, -x * s + z * c];
  c = Math.cos(az);
  s = Math.sin(az);
  [x, y] = [x * c - y * s, x * s + y * c];
  return [x, y, z];
}

function mix(parts: [number, Gen][]): Gen {
  const total = parts.reduce((s, [w]) => s + w, 0);
  return () => {
    let r = R() * total;
    for (const [w, f] of parts) {
      r -= w;
      if (r <= 0) return f();
    }
    return parts[0][1]();
  };
}

const rectFill = (x0: number, y0: number, x1: number, y1: number, z = 0.03): Gen => () => [
  x0 + R() * (x1 - x0),
  y0 + R() * (y1 - y0),
  (R() - 0.5) * z,
];

const rectLine = (x0: number, y0: number, x1: number, y1: number, z = 0.03): Gen => () => {
  const w = x1 - x0;
  const h = y1 - y0;
  const t = R() * 2 * (w + h);
  let x: number;
  let y: number;
  if (t < w) [x, y] = [x0 + t, y0];
  else if (t < 2 * w) [x, y] = [x0 + t - w, y1];
  else if (t < 2 * w + h) [x, y] = [x0, y0 + t - 2 * w];
  else [x, y] = [x1, y0 + t - 2 * w - h];
  return [x, y, (R() - 0.5) * z];
};

const disc = (cx: number, cy: number, r: number): Gen => () => {
  const a = R() * Math.PI * 2;
  const d = Math.sqrt(R()) * r;
  return [cx + Math.cos(a) * d, cy + Math.sin(a) * d, (R() - 0.5) * 0.02];
};

const tri = (a: V3, b: V3, c: V3): Gen => () => {
  let u = R();
  let v = R();
  if (u + v > 1) [u, v] = [1 - u, 1 - v];
  return [0, 1, 2].map((k) => a[k] + (b[k] - a[k]) * u + (c[k] - a[k]) * v) as V3;
};

const seg = (a: V3, b: V3): Gen => () => {
  const t = R();
  return [0, 1, 2].map((k) => a[k] + (b[k] - a[k]) * t + (R() - 0.5) * 0.015) as V3;
};

const ring = (r: number, tilt: V3, th = 0.02): Gen => () => {
  const a = R() * Math.PI * 2;
  const k = 1 + (R() - 0.5) * th;
  return rot3([Math.cos(a) * r * k, (R() - 0.5) * th, Math.sin(a) * r * k], ...tilt);
};

const sphereSurf = (r: number): Gen => () => {
  const u = R() * 2 - 1;
  const a = R() * Math.PI * 2;
  const s = Math.sqrt(1 - u * u);
  return [s * Math.cos(a) * r, u * r, s * Math.sin(a) * r];
};

const sphereVol = (r: number): Gen => () => {
  const d = Math.cbrt(R()) * r;
  return sphereSurf(1)().map((v) => v * d) as V3;
};

const knotParams: Gen = () => {
  const k = R();
  const tube = k < 0.68 ? 0.12 + gauss() * 0.008 : k < 0.9 ? R() * 0.1 : 0.16 + R() ** 2 * 0.5;
  return [R(), R(), tube];
};

const website = mix([
  [0.28, rectLine(-1.25, -0.82, 1.25, 0.82)],
  [0.06, seg([-1.25, 0.56, 0], [1.25, 0.56, 0])],
  [0.03, disc(-1.1, 0.69, 0.04)],
  [0.03, disc(-0.98, 0.69, 0.04)],
  [0.03, disc(-0.86, 0.69, 0.04)],
  [0.04, rectLine(-0.55, 0.63, 0.65, 0.75)],
  [0.11, rectFill(-1.05, 0.24, 0.05, 0.42)],
  [0.03, rectFill(-1.05, 0.1, -0.15, 0.15)],
  [0.03, rectFill(-1.05, 0, -0.4, 0.05)],
  [0.06, rectFill(-1.05, -0.22, -0.6, -0.08)],
  [0.12, rectFill(0.25, -0.22, 1.05, 0.44)],
  [0.06, rectLine(-1.05, -0.7, -0.42, -0.36)],
  [0.06, rectLine(-0.31, -0.7, 0.31, -0.36)],
  [0.06, rectLine(0.42, -0.7, 1.05, -0.36)],
]);

const plane = (() => {
  const nose: V3 = [1.35, 0.32, 0];
  const wl: V3 = [-1.05, 0.2, 1.05];
  const wr: V3 = [-1.05, 0.2, -1.05];
  const c: V3 = [-0.85, 0.02, 0];
  const keel: V3 = [-0.9, -0.62, 0];
  return mix([
    [0.3, tri(nose, wl, c)],
    [0.3, tri(nose, wr, c)],
    [0.17, tri(nose, c, keel)],
    [0.06, seg(nose, wl)],
    [0.06, seg(nose, wr)],
    [0.05, seg(nose, keel)],
    [0.03, seg(wl, c)],
    [0.03, seg(wr, c)],
  ]);
})();

const phone = mix([
  [0.18, rectLine(-0.55, -1.1, 0.55, 1.1, 0.02)],
  [
    0.12,
    () => {
      const p = rectLine(-0.55, -1.1, 0.55, 1.1, 0.02)();
      p[2] -= 0.12;
      return p;
    },
  ],
  [0.03, rectFill(-0.16, 0.98, 0.16, 1.04)],
  [0.06, rectFill(-0.42, 0.74, 0.42, 0.86)],
  [0.09, rectFill(-0.42, 0.12, -0.04, 0.62)],
  [0.09, rectFill(0.04, 0.12, 0.42, 0.62)],
  [0.09, rectFill(-0.42, -0.46, -0.04, 0.04)],
  [0.09, rectFill(0.04, -0.46, 0.42, 0.04)],
  [0.03, rectFill(-0.42, -0.62, 0.2, -0.56)],
  [0.1, rectFill(-0.42, -0.95, 0.42, -0.75)],
]);

const funnel = mix([
  [
    0.68,
    () => {
      const k = Math.floor(R() * 6);
      const y = 0.95 - k * 0.36;
      const r = 1.25 - k * 0.17;
      const a = R() * Math.PI * 2;
      const j = 1 + (R() - 0.5) * 0.03;
      return [Math.cos(a) * r * j, y + (R() - 0.5) * 0.02, Math.sin(a) * r * j];
    },
  ],
  [
    0.18,
    () => {
      const t = R();
      const r = 1.25 - t * 0.85;
      const a = R() * Math.PI * 2;
      return [Math.cos(a) * r, 0.95 - t * 1.8, Math.sin(a) * r];
    },
  ],
  [
    0.14,
    () => {
      const a = R() * Math.PI * 2;
      const d = Math.sqrt(R()) * 0.12;
      return [Math.cos(a) * d, -0.9 - R() * 0.45, Math.sin(a) * d];
    },
  ],
]);

const system = mix([
  [0.42, sphereSurf(0.6)],
  [0.08, sphereVol(0.5)],
  [0.17, ring(1.0, [1.2, 0, 0.2])],
  [0.17, ring(1.15, [0.3, 0, -0.9])],
  [0.16, ring(1.3, [-0.5, 0, 0.7])],
]);

const cloud: Gen = () => {
  const d = 2.4 + Math.cbrt(R()) * 3.4;
  return sphereSurf(1)().map((v) => v * d) as V3;
};

type P2 = [number, number];
const A_OUTER: P2[] = [[-1, -1.1], [-0.6, -1.1], [-0.4, -0.5], [0.4, -0.5], [0.6, -1.1], [1, -1.1], [0.22, 1.1], [-0.22, 1.1]];
const A_HOLE: P2[] = [[-0.27, -0.16], [0.27, -0.16], [0, 0.6]];
const A_DEPTH = 0.2;

function inside([x, y]: P2, poly: P2[]) {
  let hit = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) hit = !hit;
  }
  return hit;
}

const aEdges = [A_OUTER, A_HOLE].flatMap((poly) => poly.map((p, i) => [p, poly[(i + 1) % poly.length]] as [P2, P2]));
const aEdgeLen = aEdges.map(([a, b]) => Math.hypot(b[0] - a[0], b[1] - a[1]));
const aEdgeTotal = aEdgeLen.reduce((s, l) => s + l, 0);

const aFill = (z: () => number): Gen => () => {
  for (;;) {
    const p: P2 = [R() * 2 - 1, R() * 2.2 - 1.1];
    if (inside(p, A_OUTER) && !inside(p, A_HOLE)) return [p[0], p[1], z()];
  }
};

const aEdge = (z: () => number): Gen => () => {
  let r = R() * aEdgeTotal;
  let k = 0;
  while ((r -= aEdgeLen[k]) > 0) k++;
  const [a, b] = aEdges[k];
  const t = R();
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, z()];
};

/** Extruded monogram «A» for the About page: crisp outline on both faces, side walls, a little inner volume and a halo of sparks. */
const monogram = mix([
  [0.24, aFill(() => (R() < 0.5 ? -A_DEPTH : A_DEPTH) + (R() - 0.5) * 0.015)],
  [0.22, aEdge(() => (R() < 0.5 ? -A_DEPTH : A_DEPTH))],
  [0.26, aEdge(() => (R() * 2 - 1) * A_DEPTH)],
  [0.1, aFill(() => (R() * 2 - 1) * A_DEPTH)],
  [
    0.18,
    () => {
      const a = R() * Math.PI * 2;
      const r = 1.45 + R() ** 2 * 0.9;
      return [Math.cos(a) * r, Math.sin(a) * r * 0.9, (R() - 0.5) * 0.8];
    },
  ],
]);

/** Geodesic lattice for the Services page: an icosphere (one subdivision) drawn by its edges, with brighter clusters at the joints. */
const lattice = (() => {
  const t = (1 + Math.sqrt(5)) / 2;
  let verts: V3[] = [
    [-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0],
    [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t],
    [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1],
  ];
  let faces = [
    [0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11], [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
    [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9], [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1],
  ];
  const norm = (v: V3): V3 => {
    const l = Math.hypot(...v);
    return [v[0] / l, v[1] / l, v[2] / l];
  };
  verts = verts.map(norm);
  const mid = new Map<string, number>();
  const midpoint = (a: number, b: number) => {
    const key = a < b ? `${a}-${b}` : `${b}-${a}`;
    let k = mid.get(key);
    if (k === undefined) {
      k = verts.push(norm([0, 1, 2].map((i) => (verts[a][i] + verts[b][i]) / 2) as V3)) - 1;
      mid.set(key, k);
    }
    return k;
  };
  faces = faces.flatMap(([a, b, c]) => {
    const ab = midpoint(a, b);
    const bc = midpoint(b, c);
    const ca = midpoint(c, a);
    return [[a, ab, ca], [b, bc, ab], [c, ca, bc], [ab, bc, ca]];
  });
  const edgeSet = new Set<string>();
  const edges: [V3, V3][] = [];
  for (const f of faces) {
    for (let i = 0; i < 3; i++) {
      const a = f[i];
      const b = f[(i + 1) % 3];
      const key = a < b ? `${a}-${b}` : `${b}-${a}`;
      if (!edgeSet.has(key)) {
        edgeSet.add(key);
        edges.push([verts[a], verts[b]]);
      }
    }
  }
  const R0 = 1.15;
  const onEdge: Gen = () => {
    const [a, b] = edges[Math.floor(R() * edges.length)];
    const s = R();
    const p = norm([0, 1, 2].map((i) => a[i] + (b[i] - a[i]) * s) as V3);
    return p.map((v) => v * R0 + (R() - 0.5) * 0.012) as V3;
  };
  const joint: Gen = () => {
    const v = verts[Math.floor(R() * verts.length)];
    return v.map((c) => c * R0 + gauss() * 0.028) as V3;
  };
  const halo: Gen = () => {
    const d = R0 * (1.25 + R() ** 2 * 0.8);
    return sphereSurf(1)().map((c) => c * d) as V3;
  };
  return mix([
    [0.6, onEdge],
    [0.2, joint],
    [0.08, sphereVol(0.38)],
    [0.12, halo],
  ]);
})();

const FORMS: { gen: Gen; rot?: V3 }[] = [
  { gen: knotParams },
  { gen: website, rot: [0.12, 0.35, 0] },
  { gen: plane, rot: [0.2, 0.7, 0.3] },
  { gen: phone, rot: [-0.08, -0.5, -0.05] },
  { gen: funnel, rot: [0.38, 0, 0] },
  { gen: system },
  { gen: cloud },
  { gen: monogram },
  { gen: lattice, rot: [0.35, 0, 0.2] },
];

/** How strongly each form breathes as an organic blob (0 = keeps its exact outline). */
export const BLOB = [0, 0.12, 0.12, 0.12, 0.12, 0.85, 1, 0.04, 0.06];

export function buildForms(count: number) {
  const rows = Math.ceil(count / TEX_WIDTH);
  const data = new Float32Array(TEX_WIDTH * rows * FORM_COUNT * 4);
  const seed = new Float32Array(count);
  for (let i = 0; i < count; i++) seed[i] = R();
  FORMS.forEach(({ gen, rot }, s) => {
    for (let i = 0; i < count; i++) {
      const p = rot ? rot3(gen(), ...rot) : gen();
      const o = ((s * rows + Math.floor(i / TEX_WIDTH)) * TEX_WIDTH + (i % TEX_WIDTH)) * 4;
      data[o] = p[0];
      data[o + 1] = p[1];
      data[o + 2] = p[2];
      data[o + 3] = seed[i];
    }
  });
  return { data, rows };
}
