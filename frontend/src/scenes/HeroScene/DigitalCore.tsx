import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sparkles, Environment, Lightformer, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { pointerState } from '../../lib/pointerStore';
import { elementScrollProgress } from '../../lib/scrollStore';

interface DigitalCoreProps {
  containerRef: React.RefObject<HTMLElement | null>;
  reducedMotion: boolean;
  lowPower: boolean;
}

const FRAGMENT_COUNT = 6;

// Accent roles (см. TECH_TASK_REDISIGN.md п.6): indigo = technology,
// cyan = motion/data, lavender = creativity, peach = human/communication.
const INDIGO = '#5b5fef';
const CYAN = '#4fc9ef';
const LAVENDER = '#a88bff';
const PEACH = '#ff9d7f';
const WARM_WHITE = '#fbfaf5';

/**
 * Builds the sculpture's base geometry once (REDIZIGN_TASK.md п.7/8): a
 * low-poly icosahedron pushed through a cheap layered-sine "noise" and a
 * one-sided bias so it reads as an irregular, asymmetric, slightly
 * elongated liquid sculpture rather than a sphere/ball/orb. This runs a
 * single time at mount, not per-frame — the animated surface life comes
 * from MeshDistortMaterial's (GPU, vertex-shader) distort instead.
 */
function buildSculptureGeometry() {
  const geo = new THREE.IcosahedronGeometry(1.3, 4);
  const pos = geo.attributes.position;
  const v = new THREE.Vector3();
  const n = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    n.copy(v).normalize();
    const noise =
      Math.sin(n.x * 3.1 + n.y * 1.7) * 0.16 +
      Math.sin(n.y * 2.3 - n.z * 2.9) * 0.11 +
      Math.sin(n.z * 4.1 + n.x * 1.3) * 0.07;
    // Push one side out further than the other so the silhouette is
    // lopsided/asymmetric rather than a uniform blob.
    const bias = 1 + Math.max(0, n.x * 0.32) - Math.max(0, n.y * 0.14) + Math.max(0, -n.z * 0.1);
    const r = 1 + noise * 0.55;
    v.copy(n).multiplyScalar(r * bias);
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  geo.scale(1, 1.22, 0.82);
  geo.computeVertexNormals();
  return geo;
}

/**
 * "Digital Core" — the hero's abstract metaphor for digital engineering.
 * REVISION 02 (REDIZIGN_TASK.md п.7/8/9/47): replaced the earlier
 * glass-ball look with an irregular asymmetric sculpture, and dropped
 * `transmission` — it forces three.js to copy the framebuffer through an
 * extra render pass every frame, which was the main cost driver. The
 * glass/gel read now comes cheaply from clearcoat + iridescence +
 * multi-colored rim lighting + opacity instead (see п.47's own suggested
 * alternative). Geometry detail dropped 6→3 (~80k→~1.3k triangles).
 */
export function DigitalCore({ containerRef, reducedMotion, lowPower }: DigitalCoreProps) {
  const group = useRef<THREE.Group>(null);
  const shell = useRef<THREE.Mesh>(null);
  // drei doesn't export MeshDistortMaterial's internal material class, so
  // there's no public type to ref it as beyond `any` here.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const shellMat = useRef<any>(null);
  const core = useRef<THREE.Mesh>(null);
  const light = useRef<THREE.PointLight>(null);
  const fragments = useRef<THREE.Group>(null);
  const rotation = useRef({ x: 0, y: 0 });
  const entry = useRef(0);

  const geometry = useMemo(() => buildSculptureGeometry(), []);

  // Tighter orbit on touch/mobile — the core sits tucked in a corner there
  // (see position logic below), so a desktop-sized orbit would swing
  // fragments back across the text column.
  const orbitScale = lowPower ? 0.55 : 1;
  const fragmentPositions = useRef(
    Array.from({ length: FRAGMENT_COUNT }, (_, i) => ({
      angle: (i / FRAGMENT_COUNT) * Math.PI * 2,
      radius: (1.9 + (i % 2) * 0.4) * orbitScale,
      speed: 0.15 + (i % 3) * 0.05,
      height: (i % 2 === 0 ? 1 : -1) * 0.3 * orbitScale,
    })),
  );

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const progress = containerRef.current ? elementScrollProgress(containerRef.current) : 0;
    // progress ~0 while hero fills the viewport, rises toward 1 as the user
    // scrolls the hero out of view — used to shrink/settle the core as it
    // "hands off" to the About section (п.18/41).
    const settle = Math.min(1, progress * 1.6);
    // Entry: the sculpture assembles in over ~1s on mount rather than
    // popping in at full scale (п.11) — reduced-motion skips straight to 1.
    entry.current = reducedMotion ? 1 : Math.min(1, entry.current + delta / 1.1);
    const entryEase = 1 - Math.pow(1 - entry.current, 3);

    if (group.current) {
      const targetTiltX = reducedMotion ? 0 : pointerState.ny * 0.18;
      const targetTiltY = reducedMotion ? 0 : pointerState.nx * 0.26;
      rotation.current.x += (targetTiltX - rotation.current.x) * Math.min(1, delta * 2.2);
      rotation.current.y += (targetTiltY - rotation.current.y) * Math.min(1, delta * 2.2);

      group.current.rotation.x = rotation.current.x;
      // Idle: only a very slow continuous drift (п.10) — mouse and scroll
      // layer on top of this instead of replacing it.
      group.current.rotation.y = rotation.current.y + (reducedMotion ? 0 : t * 0.035);
      const settleScale = 1 - settle * 0.45;
      group.current.scale.setScalar(settleScale * entryEase);
      // On touch/mobile the hero is a single stacked column (headline over
      // the scene), so tuck the core into the lower-right corner, clear of
      // the running text column, instead of sitting dead-center behind it
      // (п.9/50 — mobile gets its own composition, not a shrunk desktop one).
      const baseX = lowPower ? 1.4 : 0.95;
      const baseY = lowPower ? -1.7 : -0.15;
      group.current.position.x = baseX + settle * 1.1;
      group.current.position.y = baseY - settle * 0.4;
    }

    if (shell.current) {
      // Idle-only rotation — deliberately slow, never a "spinning" feel (п.10).
      shell.current.rotation.y -= delta * (reducedMotion ? 0.018 : 0.05);
      shell.current.rotation.x += delta * 0.018;
      shell.current.rotation.z += delta * 0.01;
    }
    if (shellMat.current) {
      shellMat.current.time = t;
    }
    if (core.current) {
      core.current.rotation.y += delta * (reducedMotion ? 0.03 : 0.12);
      const pulse = 1 + Math.sin(t * 1.4) * (reducedMotion ? 0.01 : 0.03);
      core.current.scale.setScalar(pulse * entryEase);
    }
    if (light.current && !reducedMotion) {
      light.current.position.x = pointerState.nx * 3;
      light.current.position.y = pointerState.ny * 3 + 1;
    }
    if (fragments.current && !reducedMotion) {
      fragments.current.children.forEach((child, i) => {
        const f = fragmentPositions.current[i];
        const a = f.angle + t * f.speed;
        child.position.set(Math.cos(a) * f.radius, f.height + Math.sin(t * 0.6 + i) * 0.2, Math.sin(a) * f.radius);
        child.rotation.x += delta * 0.5;
        child.rotation.y += delta * 0.35;
      });
    }
  });

  return (
    <group ref={group}>
      {/* Procedural studio light rig — baked once (drei defaults to
          `frames={1}`), never re-rendered per frame, so it never fetches an
          external HDRI and costs nothing ongoing (п.13/49). Skipped on
          touch/low-power devices. */}
      {!lowPower && (
        <Environment resolution={96}>
          <Lightformer form="rect" color={WARM_WHITE} intensity={2.4} position={[3, 2.5, 4]} scale={[4, 4, 1]} target={[0, 0, 0]} />
          <Lightformer form="rect" color={LAVENDER} intensity={1.5} position={[-4, 1.5, -2]} scale={[3, 5, 1]} target={[0, 0, 0]} />
          <Lightformer form="ring" color={CYAN} intensity={1.1} position={[1.5, -2.5, -3]} scale={2.4} target={[0, 0, 0]} />
        </Environment>
      )}

      <ambientLight intensity={0.6} color={WARM_WHITE} />
      <pointLight ref={light} position={[2, 2, 3]} intensity={10} color={CYAN} distance={12} />
      <directionalLight position={[-3, 2, -2]} intensity={0.7} color={LAVENDER} />
      <pointLight position={[-1.4, -1.6, 2]} intensity={4} color={PEACH} distance={8} />

      {/* Sculpture shell — no `transmission` (that's what was causing the
          lag: it forces an extra framebuffer-copy render pass every frame).
          The glass/gel read comes instead from clearcoat + iridescence +
          the colored rim lights above, at a fraction of the cost (п.47). */}
      <mesh ref={shell} geometry={geometry}>
        <MeshDistortMaterial
          ref={shellMat}
          color={WARM_WHITE}
          distort={lowPower ? 0.035 : 0.06}
          speed={reducedMotion ? 0 : 0.4}
          transparent
          opacity={0.95}
          roughness={0.3}
          metalness={0.04}
          ior={1.4}
          iridescence={0.3}
          iridescenceIOR={1.3}
          clearcoat={0.4}
          clearcoatRoughness={0.4}
          envMapIntensity={1.05}
        />
      </mesh>

      {/* Inner core — solid, softly emissive (technology / intelligence). */}
      <mesh ref={core}>
        <icosahedronGeometry args={[0.5, 2]} />
        <meshStandardMaterial color={INDIGO} emissive={INDIGO} emissiveIntensity={0.55} roughness={0.35} metalness={0.4} />
      </mesh>

      <group ref={fragments}>
        {fragmentPositions.current.map((_, i) => (
          <mesh key={i}>
            <tetrahedronGeometry args={[0.09]} />
            <meshStandardMaterial color={LAVENDER} emissive={LAVENDER} emissiveIntensity={0.55} />
          </mesh>
        ))}
      </group>

      {!lowPower && (
        <Sparkles
          count={reducedMotion ? 16 : 56}
          scale={3.8}
          size={1.5}
          speed={reducedMotion ? 0 : 0.2}
          opacity={0.35}
          color={CYAN}
        />
      )}
    </group>
  );
}
