import { AnimatePresence, motion } from 'motion/react';
import type { ServiceId } from '../../data/services';
import styles from './Services.module.css';

const INDIGO = '#5b5fef';
const CYAN = '#4fc9ef';
const LAVENDER = '#a88bff';
const PEACH = '#ff9d7f';
const MUTED = 'rgba(17,18,20,0.16)';
const PANEL = 'rgba(17,18,20,0.035)';
const NODE_FILL = 'rgba(17,18,20,0.05)';

function WebsiteStage() {
  return (
    <svg viewBox="0 0 240 180" width="72%">
      <rect x="10" y="10" width="220" height="160" rx="10" fill="none" stroke={MUTED} strokeWidth="1.5" />
      <rect x="10" y="10" width="220" height="26" rx="10" fill={PANEL} />
      <circle cx="24" cy="23" r="3" fill={MUTED} />
      <circle cx="34" cy="23" r="3" fill={MUTED} />
      <circle cx="44" cy="23" r="3" fill={MUTED} />
      <rect x="26" y="52" width="120" height="10" rx="2" fill={INDIGO} opacity="0.85" />
      <rect x="26" y="70" width="188" height="6" rx="2" fill={MUTED} />
      <rect x="26" y="82" width="150" height="6" rx="2" fill={MUTED} />
      <rect x="26" y="104" width="60" height="24" rx="6" fill={PEACH} opacity="0.9" />
      <rect x="120" y="104" width="94" height="50" rx="6" fill="none" stroke={MUTED} strokeWidth="1.5" />
    </svg>
  );
}

function WebappStage() {
  return (
    <svg viewBox="0 0 240 180" width="72%">
      <rect x="10" y="10" width="56" height="160" rx="8" fill={PANEL} />
      {[40, 62, 84, 106].map((y) => (
        <rect key={y} x="20" y={y} width="36" height="6" rx="2" fill={MUTED} />
      ))}
      <rect x="78" y="10" width="152" height="70" rx="8" fill="none" stroke={CYAN} strokeWidth="1.5" opacity="0.8" />
      <rect x="78" y="90" width="72" height="80" rx="8" fill="none" stroke={MUTED} strokeWidth="1.5" />
      <rect x="158" y="90" width="72" height="80" rx="8" fill="none" stroke={MUTED} strokeWidth="1.5" />
      <rect x="92" y="30" width="80" height="8" rx="2" fill={LAVENDER} opacity="0.8" />
    </svg>
  );
}

function BotStage() {
  return (
    <svg viewBox="0 0 240 180" width="66%">
      <rect x="24" y="18" width="140" height="26" rx="13" fill="none" stroke={MUTED} strokeWidth="1.5" />
      <rect x="80" y="56" width="140" height="26" rx="13" fill={CYAN} opacity="0.85" />
      <rect x="24" y="94" width="120" height="26" rx="13" fill="none" stroke={MUTED} strokeWidth="1.5" />
      <rect x="96" y="132" width="120" height="26" rx="13" fill={PEACH} opacity="0.9" />
      <path d="M18 22 L10 30 L18 30 Z" fill="none" stroke={MUTED} strokeWidth="1.5" />
    </svg>
  );
}

function BackendStage() {
  const nodes = [
    [40, 40],
    [200, 40],
    [40, 140],
    [200, 140],
    [120, 90],
  ];
  return (
    <svg viewBox="0 0 240 180" width="72%">
      {nodes.slice(0, 4).map(([x, y]) => (
        <line key={`${x}-${y}`} x1="120" y1="90" x2={x} y2={y} stroke={MUTED} strokeWidth="1.5" />
      ))}
      {nodes.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i === 4 ? 14 : 9} fill={i === 4 ? INDIGO : NODE_FILL} stroke={i === 4 ? 'none' : MUTED} strokeWidth="1.5" opacity={i === 4 ? 0.9 : 1} />
      ))}
    </svg>
  );
}

function AutomationStage() {
  return (
    <svg viewBox="0 0 240 180" width="60%">
      <circle cx="120" cy="90" r="52" fill="none" stroke={MUTED} strokeWidth="1.5" strokeDasharray="6 8" />
      <circle cx="120" cy="38" r="10" fill={PEACH} opacity="0.9" />
      <circle cx="168" cy="118" r="10" fill={CYAN} opacity="0.9" />
      <circle cx="72" cy="118" r="10" fill={LAVENDER} opacity="0.9" />
      <path d="M120 48 A52 52 0 0 1 160 108" fill="none" stroke={CYAN} strokeWidth="1.5" />
      <path d="M160 108 A52 52 0 0 1 80 108" fill="none" stroke={LAVENDER} strokeWidth="1.5" />
    </svg>
  );
}

const STAGES: Record<ServiceId, () => React.JSX.Element> = {
  websites: WebsiteStage,
  webapps: WebappStage,
  bots: BotStage,
  backend: BackendStage,
  automation: AutomationStage,
};

export function ServiceStage({ activeId }: { activeId: ServiceId }) {
  const Stage = STAGES[activeId];
  return (
    <div className={styles.stage}>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeId}
          className={styles.stageInner}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Stage />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
