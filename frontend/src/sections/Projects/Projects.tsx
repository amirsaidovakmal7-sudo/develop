import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { projects, type ProjectDefinition } from '../../data/projects';
import { useTranslation } from '../../i18n';
import { ProjectCard, type Composition } from './ProjectCard';
import { ProjectViewer } from '../../components/ProjectViewer/ProjectViewer';
import styles from './Projects.module.css';

type FilterId = 'all' | 'website' | 'webapp' | 'bot' | 'other';

const FILTERS: { id: FilterId; key: 'filterAll' | 'filterWebsites' | 'filterWebapps' | 'filterTelegram' | 'filterOther' }[] = [
  { id: 'all', key: 'filterAll' },
  { id: 'website', key: 'filterWebsites' },
  { id: 'webapp', key: 'filterWebapps' },
  { id: 'bot', key: 'filterTelegram' },
  { id: 'other', key: 'filterOther' },
];

/** TECH_TASK_REDISIGN.md п.17: composition per project, not a repeated card. */
const COMPOSITION_BY_ID: Record<string, Composition> = {
  cashflow: 'split',
  'sonata-school': 'full',
  flexcamp: 'splitReverse',
  aysdrums: 'overlap',
  'sonata-bot': 'video',
  'learning-center': 'split',
  'tech-project': 'splitReverse',
  'online-shop': 'split',
  'fastfood-bot': 'splitReverse',
  messenger: 'split',
  'news-portal': 'splitReverse',
  akkord: 'video',
};

export function Projects() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<FilterId>('all');
  const [openProject, setOpenProject] = useState<ProjectDefinition | null>(null);

  const filtered = useMemo(
    () => (filter === 'all' ? projects : projects.filter((p) => p.category === filter)),
    [filter],
  );

  return (
    <section id="work" className={`${styles.projects} section`}>
      <div className="container">
        <div className={styles.header}>
          <div>
            <span className="section-label">{t.projects.label}</span>
            <h2 className={styles.title}>{t.projects.title}</h2>
            <p className={styles.intro}>{t.projects.intro}</p>
          </div>
          <div className={styles.filters} role="group">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                className={`${styles.filterBtn} ${filter === f.id ? styles.active : ''}`}
                onClick={() => setFilter(f.id)}
                aria-pressed={filter === f.id}
              >
                {t.projects[f.key]}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.list}>
          <AnimatePresence mode="popLayout">
            {filtered.map((project, i) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <ProjectCard
                  project={project}
                  composition={COMPOSITION_BY_ID[project.id] ?? 'split'}
                  index={i}
                  onOpen={() => setOpenProject(project)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <ProjectViewer project={openProject} onClose={() => setOpenProject(null)} />
    </section>
  );
}
