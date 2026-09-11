import { Suspense, type RefObject } from 'react';
import { Canvas } from '@react-three/fiber';
import { DigitalCore } from './DigitalCore';
import { WebglErrorBoundary } from '../../components/WebglErrorBoundary';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { useIsTouchDevice } from '../../hooks/useIsTouchDevice';
import styles from './HeroScene.module.css';

interface HeroSceneProps {
  containerRef: RefObject<HTMLElement | null>;
}

function StaticFallback() {
  return <div className={styles.staticFallback} aria-hidden="true" />;
}

/**
 * TECH_TASK_REDISIGN.md п.35: capped DPR, lazy/suspended mount, reduced
 * particle budget on touch devices, static fallback if WebGL fails outright.
 */
export function HeroScene({ containerRef }: HeroSceneProps) {
  const reducedMotion = usePrefersReducedMotion();
  const isTouch = useIsTouchDevice();

  return (
    <div className={styles.canvasWrap}>
      <WebglErrorBoundary fallback={<StaticFallback />}>
        <Suspense fallback={<StaticFallback />}>
          <Canvas
            dpr={[1, isTouch ? 1.3 : 1.8]}
            gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
            camera={{ position: [0, 0, isTouch ? 11 : 5.2], fov: 42 }}
          >
            <DigitalCore containerRef={containerRef} reducedMotion={reducedMotion} lowPower={isTouch} />
          </Canvas>
        </Suspense>
      </WebglErrorBoundary>
    </div>
  );
}
