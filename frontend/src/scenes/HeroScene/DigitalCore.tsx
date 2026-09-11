import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sparkles, Environment, Lightformer } from '@react-three/drei';
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
 * "Digital Core" — the hero's abstract metaphor for digital engineering
 * (TECH_TASK_REDISIGN.md п.7/12): an irregular translucent glass/gel shell
 * around a solid emissive core, with orbiting crystal fragments — not a
 * bare wireframe primitive or spinning logo. Studio-style key/rim/secondary
 * lighting (п.13) via a procedural Lightformer rig (no external HDRI
 * fetch, keeps it self-contained and fast). Reacts to pointer position and
 * scroll progress, settling and shrinking as the hero hands off to About
 * (п.11/41).
 */
export function DigitalCore({ containerRef, reducedMotion, lowPower }: DigitalCoreProps) {
  const group = useRef<THREE.Group>(null);
  const shell = useRef<THREE.Mesh>(null);
  const core = useRef<THREE.Mesh>(null);
  const light = useRef<THREE.PointLight>(null);
  const fragments = useRef<THREE.Group>(null);
  const rotation = useRef({ x: 0, y: 0 });

  // Tighter orbit on touch/mobile — the core sits tucked in a corner there
  // (see position logic below), so a desktop-sized orbit would swing
  // fragments back across the text column.
  const orbitScale = lowPower ? 0.55 : 1;
  const fragmentPositions = useRef(
    Array.from({ length: FRAGMENT_COUNT }, (_, i) => ({
      angle: (i / FRAGMENT_COUNT) * Math.PI * 2,
      radius: (2.1 + (i % 2) * 0.4) * orbitScale,
      speed: 0.15 + (i % 3) * 0.05,
      height: (i % 2 === 0 ? 1 : -1) * 0.3 * orbitScale,
    })),
  );

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const progress = containerRef.current ? elementScrollProgress(containerRef.current) : 0;
    // progress ~0 while hero fills the viewport, rises toward 1 as the user
    // scrolls the hero out of view — used to shrink/settle the core as it
    // "hands off" to the About section (п.19/41).
    const settle = Math.min(1, progress * 1.6);

    if (group.current) {
      const targetTiltX = reducedMotion ? 0 : pointerState.ny * 0.22;
      const targetTiltY = reducedMotion ? 0 : pointerState.nx * 0.32;
      rotation.current.x += (targetTiltX - rotation.current.x) * Math.min(1, delta * 3);
      rotation.current.y += (targetTiltY - rotation.current.y) * Math.min(1, delta * 3);

      group.current.rotation.x = rotation.current.x;
      group.current.rotation.y = rotation.current.y + (reducedMotion ? 0 : t * 0.06);
      const scale = 1 - settle * 0.45;
      group.current.scale.setScalar(scale);
      // On touch/mobile the hero is a single stacked column (headline over
      // the scene), so tuck the core into the lower-right corner, clear of
      // the running text column, instead of sitting dead-center behind it
      // (п.50 — mobile gets its own composition, not a shrunk desktop one).
      const baseX = lowPower ? 1.5 : 0;
      const baseY = lowPower ? -1.7 : 0;
      group.current.position.x = baseX + settle * 1.1;
      group.current.position.y = baseY - settle * 0.4;
    }

    if (shell.current) {
      shell.current.rotation.y -= delta * (reducedMotion ? 0.025 : 0.09);
      shell.current.rotation.x += delta * 0.03;
      shell.current.rotation.z += delta * 0.018;
    }
    if (core.current) {
      core.current.rotation.y += delta * (reducedMotion ? 0.04 : 0.18);
      const pulse = 1 + Math.sin(t * 1.4) * (reducedMotion ? 0.01 : 0.035);
      core.current.scale.setScalar(pulse);
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
        child.rotation.x += delta * 0.6;
        child.rotation.y += delta * 0.4;
      });
    }
  });

  return (
    <group ref={group}>
      {/* Procedural studio light rig — soft key + lavender rim + cyan
          secondary, built from flat Lightformer panels so it never fetches
          an external HDRI (п.13/49). Skipped on touch/low-power devices. */}
      {!lowPower && (
        <Environment resolution={128}>
          <Lightformer form="rect" color={WARM_WHITE} intensity={2.4} position={[3, 2.5, 4]} scale={[4, 4, 1]} target={[0, 0, 0]} />
          <Lightformer form="rect" color={LAVENDER} intensity={1.5} position={[-4, 1.5, -2]} scale={[3, 5, 1]} target={[0, 0, 0]} />
          <Lightformer form="ring" color={CYAN} intensity={1.1} position={[1.5, -2.5, -3]} scale={2.4} target={[0, 0, 0]} />
        </Environment>
      )}

      <ambientLight intensity={0.6} color={WARM_WHITE} />
      <pointLight ref={light} position={[2, 2, 3]} intensity={12} color={CYAN} distance={12} />
      <directionalLight position={[-3, 2, -2]} intensity={0.7} color={LAVENDER} />
      <pointLight position={[-1.4, -1.6, 2]} intensity={5} color={PEACH} distance={8} />

      {/* Outer shell — irregular (non-uniform scale breaks the "textbook
          icosahedron" silhouette), translucent glass/gel material with
          refraction + fresnel + soft iridescent highlight (п.12). */}
      <mesh ref={shell} scale={[1, 1.16, 0.88]} rotation={[0.4, 0.2, 0]}>
        <icosahedronGeometry args={[1.55, 6]} />
        <meshPhysicalMaterial
          color={WARM_WHITE}
          transmission={lowPower ? 0.35 : 0.82}
          thickness={1.8}
          attenuationColor="#c9c6ff"
          attenuationDistance={1.1}
          roughness={0.16}
          ior={1.35}
          iridescence={0.35}
          iridescenceIOR={1.3}
          clearcoat={0.35}
          clearcoatRoughness={0.35}
          envMapIntensity={1.1}
        />
      </mesh>

      {/* Inner core — solid, softly emissive (technology / intelligence). */}
      <mesh ref={core}>
        <icosahedronGeometry args={[0.6, 2]} />
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
          count={reducedMotion ? 18 : 70}
          scale={4.2}
          size={1.6}
          speed={reducedMotion ? 0 : 0.22}
          opacity={0.4}
          color={CYAN}
        />
      )}
    </group>
  );
}
