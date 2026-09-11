import { useMemo, useState } from 'react';
import { stackNodes, type StackGroup } from '../../data/stack';
import { stackLayout } from './stackLayout';
import { useTranslation } from '../../i18n';
import styles from './Stack.module.css';

const GROUP_KEY: Record<StackGroup, 'groupFrontend' | 'groupBackend' | 'groupBots' | 'groupDatabase' | 'groupInfra'> = {
  frontend: 'groupFrontend',
  backend: 'groupBackend',
  bots: 'groupBots',
  database: 'groupDatabase',
  infra: 'groupInfra',
};

const GROUP_ORDER: StackGroup[] = ['frontend', 'backend', 'bots', 'database', 'infra'];

export function Stack() {
  const { t } = useTranslation();
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

        {/* Desktop/tablet: interactive graph */}
        <div className={styles.graph}>
          <svg className={styles.svgLayer} aria-hidden="true">
            {edges.map(([a, b]) => {
              const pa = stackLayout[a];
              const pb = stackLayout[b];
              const isHighlighted = !!highlighted && highlighted.has(a) && highlighted.has(b);
              return (
                <line
                  key={`${a}-${b}`}
                  x1={`${pa.x}%`}
                  y1={`${pa.y}%`}
                  x2={`${pb.x}%`}
                  y2={`${pb.y}%`}
                  className={`${styles.edge} ${isHighlighted ? styles.highlighted : ''}`}
                />
              );
            })}
          </svg>

          {stackNodes.map((node) => {
            const pos = stackLayout[node.id];
            const isHighlighted = !highlighted || highlighted.has(node.id);
            return (
              <button
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
              >
                {node.label}
              </button>
            );
          })}
        </div>

        {/* Mobile: grouped list */}
        <div className={styles.groups}>
          {GROUP_ORDER.map((group) => (
            <div key={group} className={styles.group}>
              <div className={styles.groupLabel}>{t.stack[GROUP_KEY[group]]}</div>
              <div className={styles.groupNodes}>
                {grouped.get(group)!.map((node) => (
                  <span key={node.id} className={styles.pill}>
                    {node.label}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
