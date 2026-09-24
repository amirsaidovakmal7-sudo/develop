import { buildLantern } from '../../lib/lantern';
import { sceneState } from '../../lib/sceneStore';
import { pointerState } from '../../lib/pointerStore';
import { scrollState } from '../../lib/scrollStore';

/**
 * The girih lantern, rendered with plain WebGL2.
 *
 * The scene is a solid dodecahedron whose twelve panels carry pierced girih
 * rosettes (see lib/lantern.ts), lit per facet, depth-buffered so the near
 * panels genuinely occlude the far ones, with light running outward through
 * the strapwork.
 *
 * It is the only thing drawn. A faint flat lattice used to sit behind it as
 * ambient texture; it was barely visible, it cost a full-screen pass of
 * alpha-blended lines on every frame, and it was the part of the old scene
 * that read as wallpaper rather than as an object. One object, drawn well,
 * is the whole scene.
 *
 * The choreography is the point: the lantern is closed and large over the
 * hero, recedes while the work is on screen, opens up through the sections
 * that explain how the work is done, and closes again for the order form.
 * Pointer parallax is a garnish on top of that, not the animation itself.
 *
 * No engine: one program for the panels, one for the lines, a hand-rolled
 * perspective matrix. It compresses to a couple of kilobytes.
 */

/* ── Shaders ───────────────────────────────────────────────────────── */

/**
 * How a panel leaves the body, shared verbatim by both programs.
 *
 * The panels and the strapwork carved into them are drawn by different
 * shaders, so the displacement has to be one piece of source used twice —
 * two copies that agreed today would come apart the first time one of them
 * was tuned, and the ornament would slide off its own panel.
 *
 * A panel's centre is its normal scaled by the face distance (exact for a
 * regular dodecahedron), so each piece can be spun about its own centre
 * without an extra attribute. It travels out along its home normal and
 * tumbles about a tilted axis; both are driven from the same scroll-linked
 * pair of uniforms, so running the page back up reseats every piece exactly
 * where it started.
 */
const PANEL_MOTION = `
uniform float uExplode;
uniform float uTumble;
uniform float uCentreDist;
uniform float uPanel;
uniform float uLift;

vec3 spinAbout(vec3 v, vec3 axis, float a) {
  float c = cos(a);
  return v * c + cross(axis, v) * sin(a) + axis * dot(axis, v) * (1.0 - c);
}

/** Tumble axis for a panel: tilted off its own normal, different for each.
 *  The golden ratio keeps any two of the twelve from turning in step. */
vec3 panelAxis(vec3 normal, float phase) {
  vec3 wobble = vec3(sin(phase * 6.2831853), cos(phase * 4.1), sin(phase * 2.7 + 1.1));
  // cross() is perpendicular to the normal, so adding the normal back keeps
  // the length at 0.3 or more however the two happen to line up.
  return normalize(cross(normal, wobble) + normal * 0.3);
}

struct Piece { vec3 position; vec3 normal; };

Piece piece(vec3 position, vec3 normal, float panel) {
  float mine = step(abs(panel - uPanel), 0.5);
  float phase = fract(panel * 0.6180339887);
  vec3 axis = panelAxis(normal, phase);
  float angle = uTumble * (0.55 + phase * 1.7);

  vec3 centre = normal * uCentreDist;
  vec3 local = spinAbout(position - centre, axis, angle);
  // Travel is along the home normal, not the tumbled one: the pieces fan
  // out from the body evenly however far each has turned.
  vec3 out_ = centre + local + normal * (uExplode + mine * uLift);
  return Piece(out_, spinAbout(normal, axis, angle));
}
`;

const FACE_VERT = `#version 300 es
in vec3 aPosition;
in vec3 aNormal;
in float aPanel;
uniform mat4 uProj;
uniform mat4 uModelView;
uniform vec3 uDark;
uniform vec3 uLit;
uniform float uDim;
out vec3 vColor;
` + PANEL_MOTION + `
const vec3 LIGHT = vec3(0.37, 0.52, 0.77);

void main() {
  // The singled-out panel lifts further than the rest, so opening a case
  // reads as that project's panel coming off the body.
  Piece pc = piece(aPosition, aNormal, aPanel);
  vec4 mv = uModelView * vec4(pc.position, 1.0);

  // Flat per-facet shading: the panels are planar, so the normal — and with
  // it the shade — is constant across each one, and the body reads as cut
  // rather than moulded. Because it is constant, it is computed here rather
  // than per pixel; the panels cover a good share of the viewport and a
  // normalize plus a pow on every fragment is real cost for no difference.
  // Lit by the tumbled normal, not the home one: a piece that has turned
  // away has to go dark, or the pieces read as cut-outs rather than plates.
  float l = max(dot(normalize(mat3(uModelView) * pc.normal), LIGHT), 0.0);
  vec3 col = mix(uDark, uLit, pow(l, 1.35));
  // Fades the whole body back into the canvas as it recedes down the page.
  vColor = mix(uDark * 0.55, col, uDim);

  gl_Position = uProj * mv;
}
`;

const FACE_FRAG = `#version 300 es
precision mediump float;

in vec3 vColor;
uniform float uAlpha;
out vec4 outColor;

void main() {
  // Premultiplied, to match the blend the strapwork is drawn with. The
  // panels fade out entirely as the body comes apart: filled, the loose
  // pieces read as a dozen black pentagons drifting over the copy, which
  // is scenery at best and litter at worst. Emptied, each piece is the
  // pierced girih panel it actually is, and the ornament is what travels.
  outColor = vec4(vColor * uAlpha, uAlpha);
}
`;

const LINE_VERT = `#version 300 es
in vec3 aPosition;
in vec3 aNormal;
in float aRadius;
in float aPhase;
in float aPanel;
uniform mat4 uProj;
uniform mat4 uModelView;
out float vRadius;
out float vPhase;
out float vDepth;
out float vFacing;
out float vMine;
` + PANEL_MOTION + `
void main() {
  vMine = step(abs(aPanel - uPanel), 0.5);
  Piece pc = piece(aPosition, aNormal, aPanel);
  vec4 mv = uModelView * vec4(pc.position, 1.0);
  vRadius = aRadius;
  vPhase = aPhase;
  vDepth = -mv.z;
  // How square-on the panel is to the camera. Strapwork sits in relief, so
  // on a panel turned almost edge-on it would otherwise poke past the
  // silhouette as fringe; fading it there is also the honest depth cue.
  vec3 n = mat3(uModelView) * pc.normal;
  vFacing = length(n) > 0.0001 ? normalize(n).z : 1.0;
  gl_Position = uProj * mv;
}
`;

const LINE_FRAG = `#version 300 es
precision mediump float;

in float vRadius;
in float vPhase;
in float vDepth;
in float vFacing;
in float vMine;
out vec4 outColor;

uniform float uTime;
uniform float uFlow;
uniform float uFlare;
uniform float uDim;
uniform float uPulse;
uniform float uAlpha;
uniform float uFogNear;
uniform float uFogFar;
uniform float uNearCut;
uniform vec3 uBase;
uniform vec3 uAccent;
uniform float uFacingFade;

void main() {
  // Far fade, and a near one. Without the near cut a piece that tumbles
  // toward the camera arrives at full brightness and edge-on, and its
  // strapwork smears across the whole screen as a fan of straight lines —
  // the one thing in the scene that never reads as an object.
  float fog = smoothstep(uFogFar, uFogNear, vDepth) * smoothstep(uNearCut, uNearCut + 1.6, vDepth);

  // Light travelling through the strapwork from the middle of each rosette.
  // The per-panel phase offset makes it sweep across the body instead of
  // all twelve rosettes flashing together. uFlow reverses it: while a form
  // field has focus the light gathers inward instead of radiating out.
  float wave = 0.5 + 0.5 * cos((vRadius * 1.6 - uTime * 0.22 * uFlow + vPhase * 1.4) * 6.2831853);
  float glow = pow(wave, 8.0) * uPulse;

  // One bright ring travelling out from the centre, fired when an order is
  // accepted. uFlare runs 1 -> 0 over the length of the sweep.
  float flare = 0.0;
  if (uFlare > 0.0) {
    float t = 1.0 - uFlare;
    float front = t * 1.75;
    // The ring holds its strength for the whole journey and fades only at
    // the end. Multiplying it by uFlare instead made the wave dim exactly
    // as fast as it travelled, so the outer rosettes never lit up at all
    // and the whole confirmation measured as a 4% flicker.
    float env = smoothstep(0.0, 0.06, t) * smoothstep(1.0, 0.82, t);
    flare = smoothstep(0.34, 0.0, abs(vRadius - front)) * env;
  }

  // A panel turned almost edge-on loses its strapwork entirely: in relief,
  // it would otherwise poke past the silhouette as fringe.
  float facing = mix(1.0, smoothstep(0.08, 0.46, vFacing), uFacingFade);
  // The aimed panel's strapwork burns a little brighter than its neighbours.
  float lit = clamp(glow * 1.1 + flare * 1.7 + vMine * 0.35, 0.0, 1.0);

  vec3 col = mix(uBase, uAccent, lit);
  float a = uAlpha * uDim * fog * facing * (0.55 + glow * 0.85 + flare * 2.1 + vMine * 0.3);
  outColor = vec4(col * a, a);
}
`;

/* ── Minimal column-major 4×4 matrix helpers ───────────────────────── */
type Mat4 = Float32Array;

const mat4 = (): Mat4 => new Float32Array(16);

function identity(out: Mat4): Mat4 {
  out.fill(0);
  out[0] = out[5] = out[10] = out[15] = 1;
  return out;
}

function multiply(out: Mat4, a: Mat4, b: Mat4): Mat4 {
  for (let c = 0; c < 4; c++) {
    const b0 = b[c * 4];
    const b1 = b[c * 4 + 1];
    const b2 = b[c * 4 + 2];
    const b3 = b[c * 4 + 3];
    out[c * 4] = a[0] * b0 + a[4] * b1 + a[8] * b2 + a[12] * b3;
    out[c * 4 + 1] = a[1] * b0 + a[5] * b1 + a[9] * b2 + a[13] * b3;
    out[c * 4 + 2] = a[2] * b0 + a[6] * b1 + a[10] * b2 + a[14] * b3;
    out[c * 4 + 3] = a[3] * b0 + a[7] * b1 + a[11] * b2 + a[15] * b3;
  }
  return out;
}

function perspective(out: Mat4, fovy: number, aspect: number, near: number, far: number): Mat4 {
  const f = 1 / Math.tan(fovy / 2);
  out.fill(0);
  out[0] = f / aspect;
  out[5] = f;
  out[10] = (far + near) / (near - far);
  out[11] = -1;
  out[14] = (2 * far * near) / (near - far);
  return out;
}

/** translate · rotateX · rotateY · rotateZ · uniform scale. */
function compose(out: Mat4, tx: number, ty: number, tz: number, rx: number, ry: number, rz: number, s: number): Mat4 {
  const cx = Math.cos(rx);
  const sx = Math.sin(rx);
  const cy = Math.cos(ry);
  const sy = Math.sin(ry);
  const cz = Math.cos(rz);
  const sz = Math.sin(rz);

  out[0] = cy * cz * s;
  out[1] = (sx * sy * cz + cx * sz) * s;
  out[2] = (-cx * sy * cz + sx * sz) * s;
  out[3] = 0;
  out[4] = -cy * sz * s;
  out[5] = (-sx * sy * sz + cx * cz) * s;
  out[6] = (cx * sy * sz + sx * cz) * s;
  out[7] = 0;
  out[8] = sy * s;
  out[9] = -sx * cy * s;
  out[10] = cx * cy * s;
  out[11] = 0;
  out[12] = tx;
  out[13] = ty;
  out[14] = tz;
  out[15] = 1;
  return out;
}

/** sRGB hex to linear RGB, so the shaders mix light rather than bytes. */
function linearFromHex(hex: string): [number, number, number] {
  const int = parseInt(hex.slice(1), 16);
  const toLinear = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return [toLinear(((int >> 16) & 255) / 255), toLinear(((int >> 8) & 255) / 255), toLinear((int & 255) / 255)];
}

/* ── GL plumbing ───────────────────────────────────────────────────── */

function createProgram(gl: WebGL2RenderingContext, vert: string, frag: string): WebGLProgram | null {
  const compile = (type: number, source: string) => {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  };

  const vs = compile(gl.VERTEX_SHADER, vert);
  const fs = compile(gl.FRAGMENT_SHADER, frag);
  if (!vs || !fs) return null;

  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.bindAttribLocation(program, 0, 'aPosition');
  gl.bindAttribLocation(program, 1, 'aNormal');
  gl.bindAttribLocation(program, 2, 'aRadius');
  gl.bindAttribLocation(program, 3, 'aPhase');
  gl.bindAttribLocation(program, 4, 'aPanel');
  gl.linkProgram(program);
  gl.deleteShader(vs);
  gl.deleteShader(fs);

  return gl.getProgramParameter(program, gl.LINK_STATUS) ? program : null;
}

interface Batch {
  vao: WebGLVertexArrayObject;
  buffers: WebGLBuffer[];
  count: number;
}

function createBatch(gl: WebGL2RenderingContext, attrs: { loc: number; size: number; data: Float32Array }[], count: number): Batch {
  const vao = gl.createVertexArray()!;
  gl.bindVertexArray(vao);
  const buffers: WebGLBuffer[] = [];
  for (const { loc, size, data } of attrs) {
    const buffer = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
    buffers.push(buffer);
  }
  gl.bindVertexArray(null);
  return { vao, buffers, count };
}

export interface SceneHandle {
  stop: () => void;
}

export interface SceneOptions {
  /** Touch devices: lower DPR, fewer frames, no pointer parallax. */
  lowPower: boolean;
  /** Reduced motion: compose one frame and stop. The object stays, the motion goes. */
  still: boolean;
}

/** Eased 0..1 ramp between two scroll positions. */
function ramp(value: number, from: number, to: number): number {
  const t = Math.min(1, Math.max(0, (value - from) / (to - from || 1)));
  return t * t * (3 - 2 * t);
}

/**
 * Starts the scene on `canvas`. Returns null when WebGL2 is unavailable or
 * a program fails to build, which is the caller's signal to fall back to
 * the static poster.
 */
export function startScene(canvas: HTMLCanvasElement, { lowPower, still }: SceneOptions): SceneHandle | null {
  const gl = canvas.getContext('webgl2', {
    alpha: true,
    // Also not a luxury on a phone: without multisampling a hairline that
    // runs close to horizontal breaks into a dotted trail and then drops
    // out of the frame entirely.
    antialias: true,
    depth: true,
    powerPreference: 'low-power',
    premultipliedAlpha: true,
  });
  if (!gl) return null;

  const faceProgram = createProgram(gl, FACE_VERT, FACE_FRAG);
  const lineProgram = createProgram(gl, LINE_VERT, LINE_FRAG);
  if (!faceProgram || !lineProgram) return null;

  const lantern = buildLantern();

  const faces = createBatch(
    gl,
    [
      { loc: 0, size: 3, data: lantern.facePositions },
      { loc: 1, size: 3, data: lantern.faceNormals },
      { loc: 4, size: 1, data: lantern.facePanels },
    ],
    lantern.faceCount,
  );

  const straps = createBatch(
    gl,
    [
      { loc: 0, size: 3, data: lantern.linePositions },
      { loc: 1, size: 3, data: lantern.lineNormals },
      { loc: 2, size: 1, data: lantern.lineRadii },
      { loc: 3, size: 1, data: lantern.linePhases },
      { loc: 4, size: 1, data: lantern.linePanels },
    ],
    lantern.lineCount,
  );

  const faceU = {
    proj: gl.getUniformLocation(faceProgram, 'uProj'),
    modelView: gl.getUniformLocation(faceProgram, 'uModelView'),
    explode: gl.getUniformLocation(faceProgram, 'uExplode'),
    dark: gl.getUniformLocation(faceProgram, 'uDark'),
    lit: gl.getUniformLocation(faceProgram, 'uLit'),
    dim: gl.getUniformLocation(faceProgram, 'uDim'),
    panel: gl.getUniformLocation(faceProgram, 'uPanel'),
    lift: gl.getUniformLocation(faceProgram, 'uLift'),
    alpha: gl.getUniformLocation(faceProgram, 'uAlpha'),
    tumble: gl.getUniformLocation(faceProgram, 'uTumble'),
    centreDist: gl.getUniformLocation(faceProgram, 'uCentreDist'),
  };
  const lineU = {
    proj: gl.getUniformLocation(lineProgram, 'uProj'),
    modelView: gl.getUniformLocation(lineProgram, 'uModelView'),
    explode: gl.getUniformLocation(lineProgram, 'uExplode'),
    time: gl.getUniformLocation(lineProgram, 'uTime'),
    dim: gl.getUniformLocation(lineProgram, 'uDim'),
    pulse: gl.getUniformLocation(lineProgram, 'uPulse'),
    alpha: gl.getUniformLocation(lineProgram, 'uAlpha'),
    fogNear: gl.getUniformLocation(lineProgram, 'uFogNear'),
    fogFar: gl.getUniformLocation(lineProgram, 'uFogFar'),
    nearCut: gl.getUniformLocation(lineProgram, 'uNearCut'),
    base: gl.getUniformLocation(lineProgram, 'uBase'),
    accent: gl.getUniformLocation(lineProgram, 'uAccent'),
    facingFade: gl.getUniformLocation(lineProgram, 'uFacingFade'),
    panel: gl.getUniformLocation(lineProgram, 'uPanel'),
    lift: gl.getUniformLocation(lineProgram, 'uLift'),
    flow: gl.getUniformLocation(lineProgram, 'uFlow'),
    flare: gl.getUniformLocation(lineProgram, 'uFlare'),
    tumble: gl.getUniformLocation(lineProgram, 'uTumble'),
    centreDist: gl.getUniformLocation(lineProgram, 'uCentreDist'),
  };

  const FACE_DARK = linearFromHex('#0a0e18');
  const FACE_LIT = linearFromHex('#33415e');
  const STRAP_BASE = linearFromHex('#b9c6de');
  const STRAP_ACCENT = linearFromHex('#f2c987');

  const FOV = (46 * Math.PI) / 180;
  const CAMERA_Z = 6;

  const proj = mat4();
  const view = identity(mat4());
  const model = mat4();
  const modelView = mat4();
  view[14] = -CAMERA_Z;

  // The whole object is one-pixel lines — WebGL clamps line width to 1 on
  // essentially every implementation — so resolution is not a quality
  // setting here, it is whether the object exists. Rendering a phone at DPR
  // 1 and letting the browser scale the result up to a 3x screen smears
  // each line's brightness across three device pixels, and a line already
  // drawn at partial alpha lands under the threshold where anything is
  // visible at all. This is what made the lantern disappear on phones.
  const maxDpr = lowPower ? 2 : 1.25;
  let docHeight = 1;
  let width = 0;
  let height = 0;
  let halfWidth = 1;
  const halfHeightAtCamera = Math.tan(FOV / 2) * CAMERA_Z;

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
    const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
    const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
    if (w !== width || h !== height) {
      width = canvas.width = w;
      height = canvas.height = h;
      gl.viewport(0, 0, w, h);
      perspective(proj, FOV, w / h, 0.1, 120);

      halfWidth = halfHeightAtCamera * (w / h);
    }
    docHeight = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  };

  resize();
  window.addEventListener('resize', resize, { passive: true });
  // Project media streams in after load, so the scroll range keeps growing.
  const remeasure = window.setInterval(resize, 2000);

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  gl.depthFunc(gl.LEQUAL);

  const tilt = { x: 0, y: 0 };
  // The lantern's own orientation, integrated rather than recomputed, so it
  // can be handed back and forth between free drift and aiming at a panel
  // without ever jumping.
  const spin = { y: 0.6, x: 0.22 };
  const damped = { panel: -1, lift: 0, flow: 1 };
  const approach = { presence: 0 };
  /** The panel the body turns to while the reader is writing to him. */
  const FRONT_PANEL = 0;
  let raf = 0;
  let last = performance.now();
  let running = true;
  const minFrameMs = lowPower ? 32 : 0;

  /** A fixed moment for the still frame: far enough in that the pulse sits
   *  mid-sweep and the rosettes are lit rather than dark. */
  const STILL_TIME = 3.2;

  const draw = (now: number) => {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    // In still mode the frame has to be deterministic. Feeding it the real
    // clock meant the body stayed put but the light kept travelling through
    // the strapwork every time something asked for a redraw — motion, to a
    // reader who asked for none.
    const time = still ? STILL_TIME : now / 1000;
    const p = Math.min(1, Math.max(0, scrollState.y / docHeight));

    // ── The choreography ──
    // Leaving the hero takes the lantern apart. The twelve panels come off
    // along their own normals and tumble, the body moves to the middle of
    // the screen, grows past its edges and turns behind the text; at the
    // foot of the page every piece seats back into a whole figure.
    //
    // It used to shrink into the top-right corner for the length of the
    // page instead. That is how an object becomes a decoration in the
    // margin: the reader scrolled *past* it rather than through it, and
    // on a phone it dimmed to the point of being invisible.
    //
    // Pointing at a project pulls it back together — there is no sense
    // turning one panel forward while the body is scattered across the
    // viewport.
    const attention = sceneState.panel !== null || sceneState.opened || sceneState.gathering ? 1 : 0;
    approach.presence += (attention - approach.presence) * Math.min(1, dt * 3);
    // Apart before the work index arrives (~14% of the scroll range), whole
    // again while the order form is still on screen rather than at the very
    // last pixel, which nobody scrolls to.
    const apart = ramp(p, 0.04, 0.34) * (1 - ramp(p, 0.74, 0.93)) * (1 - approach.presence * 0.8);

    // Placement is expressed as a fraction of what the camera can see at the
    // lantern's own depth, not in world units, so the object keeps the same
    // position and size on screen whatever the viewport or how far back it
    // has moved. Driving x/y/scale directly meant it slid toward the middle
    // and over the body copy as soon as it moved back.
    //
    // `apart` drives the move to the middle as well as the break-up, so the
    // same term that scatters the pieces is the one that centres them, and
    // the reassembly at the foot of the page returns it to exactly the
    // place and size it had over the hero.
    const portrait = halfWidth < halfHeightAtCamera;
    const homeX = portrait ? 0.14 : 0.4;
    const homeY = portrait ? 0.24 : 0.06;
    // On a phone the order form card fills the screen exactly where the body
    // comes back together, so the finished figure would reassemble behind
    // it and never be seen. There the finale gets its own place — centred,
    // higher up and a little smaller, in the band above the form. On a
    // desktop the contact section has room beside the column already.
    const finale = ramp(p, portrait ? 0.9 : 0.86, 1);
    const fracX = homeX * (1 - apart) * (portrait ? 1 - finale : 1);
    const fracY = homeY * (1 - apart) + finale * (portrait ? 0.42 : 0.5);
    const apparent =
      (portrait ? 0.44 : 0.6) + (portrait ? 0.3 : 0.26) * apart - finale * (portrait ? 0.1 : 0.14);

    const depth = -0.4 - 3.6 * apart;
    const spread = Math.tan(FOV / 2) * (CAMERA_Z - depth);
    const x = spread * (width / height) * fracX;
    const y = spread * fracY;
    const scale = spread * apparent;
    const explode = apart * 0.5;
    const tumble = apart * 2.4;

    // The solid panels are gone well before the body is fully scattered, so
    // what crosses the text is openwork and never a filled shape.
    // The panels empty out early and fill back in late, so the body spends
    // as little time as possible half-solid: a panel at half alpha is a
    // smudge, where a full one is a plate and an empty one is ornament.
    // It also puts the snap back together at the foot of the page, which is
    // where it belongs — the reassembly should be an event, not a fade.
    const faceAlpha = 1 - ramp(apart, 0.02, 0.22);
    // Scattered, the strapwork crosses running text, so it goes quiet as it
    // spreads. At full brightness the pieces were legible on their own and
    // unreadable over a paragraph, which is the wrong trade for a portfolio
    // whose job is to be read.
    // No portrait penalty: a phone screen is smaller and usually brighter,
    // and the strapwork there needs every bit of value it can keep.
    const lineDim = 1 - 0.45 * apart;

    // ── What the page is doing ──
    // Writing in the order form squares the lantern up to the reader. The
    // first attempt only reversed the direction of the light, which measured
    // as no change at all against the body's own rotation — an interaction
    // nobody would notice is not an interaction. Turning to face front is
    // unmistakable.
    const chosen = sceneState.panel ?? (sceneState.gathering ? FRONT_PANEL : null);
    const aimed = chosen !== null && chosen < lantern.aim.length ? chosen : null;
    const aim = aimed === null ? null : lantern.aim[aimed];

    if (!still) {
      if (aim) {
        // Turn the chosen panel square-on. The target is unwrapped against
        // the current angle first so the body always takes the short way
        // round instead of unwinding several turns.
        let targetY = aim.ry;
        while (targetY - spin.y > Math.PI) targetY -= Math.PI * 2;
        while (targetY - spin.y < -Math.PI) targetY += Math.PI * 2;
        const k = Math.min(1, dt * 3.4);
        spin.y += (targetY - spin.y) * k;
        spin.x += (aim.rx - spin.x) * k;
      } else {
        // Free rotation, plus a term that makes scrolling visibly turn it.
        // Scattered, it turns faster: a slow drift reads as stillness once
        // the pieces are spread across the whole screen.
        spin.y += dt * (0.28 + 0.5 * apart);
        spin.x += (0.22 + Math.sin(time * 0.17) * 0.12 - spin.x) * Math.min(1, dt * 2);
      }
    }
    // While a panel is aimed the scroll term is dropped: it would drag the
    // face off the camera axis as soon as the reader moved.
    const rotY = spin.y + (aim ? 0 : p * 2.4);
    const rotX = spin.x + (aim ? 0 : p * 0.5);

    // The aimed panel eases off the body. This is tied to pointing at a
    // project rather than to opening its case: the case view is an opaque
    // full-screen overlay, so anything the lantern did while it was up
    // would never be seen. Here it happens under the reader's cursor.
    const liftTarget = aim && sceneState.panel !== null ? 0.24 : 0;
    damped.lift += (liftTarget - damped.lift) * Math.min(1, dt * 4);
    // A focused form field reverses the light: it gathers inward.
    const flowTarget = sceneState.gathering ? -1 : 1;
    damped.flow += (flowTarget - damped.flow) * Math.min(1, dt * 3);

    const sinceFlare = (now - sceneState.flareAt) / 1500;
    const flare = sceneState.flareAt && sinceFlare >= 0 && sinceFlare < 1 ? 1 - sinceFlare : 0;

    if (!lowPower && !still) {
      const k = Math.min(1, dt * 2.6);
      tilt.x += (-pointerState.ny * 0.16 - tilt.x) * k;
      tilt.y += (pointerState.nx * 0.2 - tilt.y) * k;
    }

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // ── The lantern ──
    compose(model, x, y, depth, rotX + tilt.x, rotY + tilt.y, 0, scale);
    multiply(modelView, view, model);

    gl.enable(gl.DEPTH_TEST);
    // Translucent panels must not write depth, or each piece punches a hole
    // in the strapwork of the pieces behind it.
    gl.depthMask(faceAlpha > 0.995);
    gl.useProgram(faceProgram);
    gl.uniformMatrix4fv(faceU.proj, false, proj);
    gl.uniformMatrix4fv(faceU.modelView, false, modelView);
    gl.uniform1f(faceU.explode, explode);
    gl.uniform1f(faceU.panel, aimed === null ? -1 : aimed);
    gl.uniform1f(faceU.lift, damped.lift);
    gl.uniform1f(faceU.tumble, tumble);
    gl.uniform1f(faceU.centreDist, lantern.panelCentreDist);
    gl.uniform3fv(faceU.dark, FACE_DARK);
    gl.uniform3fv(faceU.lit, FACE_LIT);
    gl.uniform1f(faceU.dim, 1);
    gl.uniform1f(faceU.alpha, faceAlpha);
    if (faceAlpha > 0.01) {
      gl.bindVertexArray(faces.vao);
      gl.drawArrays(gl.TRIANGLES, 0, faces.count);
    }

    // Strapwork sits in relief on the panels, so it tests depth but does not
    // write it — otherwise the lines fight each other where they cross.
    gl.depthMask(false);
    gl.useProgram(lineProgram);
    gl.uniformMatrix4fv(lineU.proj, false, proj);
    gl.uniformMatrix4fv(lineU.modelView, false, modelView);
    gl.uniform1f(lineU.explode, explode);
    gl.uniform1f(lineU.panel, aimed === null ? -1 : aimed);
    gl.uniform1f(lineU.lift, damped.lift);
    gl.uniform1f(lineU.tumble, tumble);
    gl.uniform1f(lineU.centreDist, lantern.panelCentreDist);
    gl.uniform1f(lineU.flow, damped.flow);
    gl.uniform1f(lineU.flare, flare);
    gl.uniform1f(lineU.time, time);
    gl.uniform1f(lineU.dim, lineDim);
    gl.uniform1f(lineU.pulse, still ? 0.5 : 1);
    gl.uniform1f(lineU.alpha, 0.95);
    gl.uniform1f(lineU.fogNear, CAMERA_Z - 2);
    gl.uniform1f(lineU.fogFar, CAMERA_Z + 12);
    gl.uniform1f(lineU.nearCut, 1.6);
    gl.uniform3fv(lineU.base, STRAP_BASE);
    gl.uniform3fv(lineU.accent, STRAP_ACCENT);
    gl.uniform1f(lineU.facingFade, 1);
    gl.bindVertexArray(straps.vao);
    gl.drawArrays(gl.LINES, 0, straps.count);

    gl.bindVertexArray(null);
    gl.depthMask(true);
    gl.disable(gl.DEPTH_TEST);
  };

  const frame = (now: number) => {
    if (!running) return;
    raf = window.requestAnimationFrame(frame);
    if (now - last < minFrameMs) return;
    // A case view covers the whole screen with an opaque panel. Drawing
    // underneath it is pure heat, so the loop keeps ticking but the scene
    // does not render until the overlay is gone.
    if (sceneState.opened) {
      last = now;
      return;
    }
    draw(now);
  };

  if (still) {
    // One composed frame: the object is present, nothing moves.
    draw(performance.now());
  } else {
    raf = window.requestAnimationFrame(frame);
  }

  // A hidden tab still receives throttled rAF callbacks; stopping outright
  // means a backgrounded page composites nothing at all.
  const onVisibility = () => {
    if (still) return;
    if (document.visibilityState === 'hidden') {
      if (raf) window.cancelAnimationFrame(raf);
      raf = 0;
    } else if (running && !raf) {
      last = performance.now();
      raf = window.requestAnimationFrame(frame);
    }
  };
  document.addEventListener('visibilitychange', onVisibility);

  // Reduced motion draws once, so it has to redraw when the page resizes or
  // the reader scrolls — otherwise the single frame goes stale.
  const redrawStill = () => {
    if (!still || !running) return;
    resize();
    draw(performance.now());
  };
  if (still) {
    window.addEventListener('scroll', redrawStill, { passive: true });
    window.addEventListener('resize', redrawStill, { passive: true });
  }

  const onContextLost = (e: Event) => {
    e.preventDefault();
    running = false;
    if (raf) window.cancelAnimationFrame(raf);
    raf = 0;
  };
  canvas.addEventListener('webglcontextlost', onContextLost);

  return {
    stop() {
      running = false;
      if (raf) window.cancelAnimationFrame(raf);
      window.clearInterval(remeasure);
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', redrawStill);
      window.removeEventListener('resize', redrawStill);
      document.removeEventListener('visibilitychange', onVisibility);
      canvas.removeEventListener('webglcontextlost', onContextLost);
      for (const batch of [faces, straps]) {
        batch.buffers.forEach((b) => gl.deleteBuffer(b));
        gl.deleteVertexArray(batch.vao);
      }
      gl.deleteProgram(faceProgram);
      gl.deleteProgram(lineProgram);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    },
  };
}
