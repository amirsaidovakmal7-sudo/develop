import { useMemo, useState } from 'react';
import { motion, type Variants } from 'motion/react';
import { stackNodes, type StackGroup } from '../../data/stack';
import { stackLayout } from './stackLayout';
import { useTranslation } from '../../i18n';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import styles from './Stack.module.css';

const GROUP_KEY: Record<StackGroup, 'groupFrontend' | 'groupBackend' | 'groupBots' | 'groupDatabase' | 'groupInfra'> = {
  frontend: 'groupFrontend',
  backend: 'groupBackend',
  bots: 'groupBots',
  database: 'groupDatabase',
  infra: 'groupInfra',
};

const GROUP_ORDER: StackGroup[] = ['frontend', 'backend', 'bots', 'database', 'infra'];

// Reveal order for the graph (REDIZIGN_TASK.md п.23): Python first, then its
// direct connections, then the rest — nodes appear and edges draw in as the
// user scrolls, rather than the whole graph fading in at once.
const REVEAL_ORDER = [
  'python',
  'django',
  'fastapi',
  'aiogram',
  'telebot',
  'sqlalchemy',
  'postgresql',
  'sqlite',
  'vps',
  'react',
  'html',
  'css',
  'javascript',
];
const revealIndex = new Map(REVEAL_ORDER.map((id, i) => [id, i]));
const STEP = 0.07;

const nodeVariant: Variants = {
  hidden: { opacity: 0, scale: 0.6 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
};

const listContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};
const groupVariant: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

export function Stack() {
  const { t } = useTranslation();
  const reducedMotion = usePrefersReducedMotion();
  const [activeId, setActiveId] = useState<string | null>(null);

  const activeNode = useMemo(() => stackNodes.find((n) => n.id === activeId) ?? null, [activeId]);
  const highlighted = useMemo(() => {
    if (!activeNode) return null;
    return new Set([activeNode.id, ...activeNode.connections]);
  }, [activeNode]);

  const edges = useMemo(() => {
    const seen = new Set<string>();
    const list: [string, string][] = [];
    for (const node of stackNodes) {
      for (const targetId of node.connections) {
        const key = [node.id, targetId].sort().join('|');
        if (seen.has(key)) continue;
        seen.add(key);
        list.push([node.id, targetId]);
      }
    }
    return list;
  }, []);

  const grouped = useMemo(() => {
    const map = new Map<StackGroup, typeof stackNodes>();
    for (const group of GROUP_ORDER) map.set(group, []);
    for (const node of stackNodes) map.get(node.group)!.push(node);
    return map;
  }, []);

  return (
    <section className={`${styles.stack} section`}>
      <div className="container">
        <div className={styles.header}>
          <div>
            <span className="section-label">{t.stack.label}</span>
            <h2 className={styles.title}>{t.stack.title}</h2>
          </div>
          <span className={styles.hint}>{t.stack.hint}</span>
        </div>

        {/* Desktop/tablet: interactive graph — nodes appear and edges draw
            in, in connection order, as the graph scrolls into view. */}
        <motion.div
          className={styles.graph}
          initial={reducedMotion ? undefined : 'hidden'}
          whileInView={reducedMotion ? undefined : 'show'}
          viewport={{ once: true, amount: 0.35 }}
        >
          <svg className={styles.svgLayer} aria-hidden="true">
            {edges.map(([a, b]) => {
              const pa = stackLayout[a];
              const pb = stackLayout[b];
              const isHighlighted = !!highlighted && highlighted.has(a) && highlighted.has(b);
              const order = Math.max(revealIndex.get(a) ?? 0, revealIndex.get(b) ?? 0);
              return (
                <motion.line
                  key={`${a}-${b}`}
                  x1={`${pa.x}%`}
                  y1={`${pa.y}%`}
                  x2={`${pb.x}%`}
                  y2={`${pb.y}%`}
                  className={`${styles.edge} ${isHighlighted ? styles.highlighted : ''}`}
                  initial={reducedMotion ? undefined : { pathLength: 0 }}
                  whileInView={reducedMotion ? undefined : { pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: order * STEP + 0.05, ease: 'easeOut' }}
                />
              );
            })}
          </svg>

          {stackNodes.map((node) => {
            const pos = stackLayout[node.id];
            const isHighlighted = !highlighted || highlighted.has(node.id);
            const order = revealIndex.get(node.id) ?? 0;
            return (
              <motion.button
                key={node.id}
                type="button"
                className={`${styles.node} ${highlighted?.has(node.id) ? styles.highlighted : ''} ${
                  highlighted && !isHighlighted ? styles.dimmed : ''
                }`}
                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                onMouseEnter={() => setActiveId(node.id)}
                onMouseLeave={() => setActiveId(null)}
                onFocus={() => setActiveId(node.id)}
                onBlur={() => setActiveId(null)}
                variants={reducedMotion ? undefined : nodeVariant}
                transition={{ delay: order * STEP }}
              >
                {node.label}
              </motion.button>
            );
          })}
        </motion.div>

        {/* Mobile: grouped list fallback (own composition per п.38, avoids
           overlapping absolute-positioned nodes at narrow widths) */}
        <motion.div
          className={styles.groups}
          variants={reducedMotion ? undefined : listContainer}
          initial={reducedMotion ? undefined : 'hidden'}
          whileInView={reducedMotion ? undefined : 'show'}
          viewport={{ once: true, amount: 0.2 }}
        >
          {GROUP_ORDER.map((group) => (
            <motion.div key={group} className={styles.group} variants={reducedMotion ? undefined : groupVariant}>
              <div className={styles.groupLabel}>{t.stack[GROUP_KEY[group]]}</div>
              <div className={styles.groupNodes}>
                {grouped.get(group)!.map((node) => (
                  <span key={node.id} className={styles.pill}>
                    {node.label}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
