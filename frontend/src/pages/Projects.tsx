import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from '../i18n';
import { projects, type ProjectCategory } from '../data/projects';
import { PageHero } from '../components/PageHero/PageHero';
import { ProjectStack } from '../components/ProjectStack/ProjectStack';
import { CaseView } from '../components/CaseView/CaseView';
import s from './pages.module.css';

type Filter = 'all' | Exclude<ProjectCategory, 'other'>;
const FILTERS: Filter[] = ['all', 'website', 'bot', 'webapp'];

export function Projects() {
  const { t } = useTranslation();
  const p = t.projects;
  const [filter, setFilter] = useState<Filter>('all');
  const [open, setOpen] = useState<number | null>(null);

  const list = useMemo(
    () => (filter === 'all' ? projects : projects.filter((pr) => pr.category === filter || (filter === 'webapp' && pr.category === 'other'))),
    [filter],
  );
  const step = useCallback((d: number) => setOpen((i) => (i === null ? i : (i + d + list.length) % list.length)), [list.length]);
  const close = useCallback(() => setOpen(null), []);
  const count = (f: Filter) => (f === 'all' ? projects.length : projects.filter((pr) => pr.category === f || (f === 'webapp' && pr.category === 'other')).length);
  const labels: Record<Filter, string> = { all: p.filterAll, website: p.filterWebsite, bot: p.filterBot, webapp: p.filterWebapp };

  return (
    <>
      <PageHero label={p.label} title={p.title} titleSub={p.titleSub} intro={p.intro} />
      <section className="container" aria-label={p.title}>
        <div className={s.filters} role="group">
          {FILTERS.map((f) => (
            <button key={f} type="button" aria-pressed={filter === f} onClick={() => setFilter(f)}>
              {labels[f]}
              <sup>{count(f)}</sup>
            </button>
          ))}
        </div>
        <ProjectStack key={filter} list={list} onOpen={setOpen} />
      </section>
      <CaseView list={list} index={open} onClose={close} onStep={step} />
    </>
  );
}
