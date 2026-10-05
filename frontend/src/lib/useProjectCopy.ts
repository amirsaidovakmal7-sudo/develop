import { useTranslation } from '../i18n';
import type { ProjectDefinition } from '../data/projects';

export function useProjectCopy(project: ProjectDefinition) {
  const { t } = useTranslation();
  const p = t.projects;
  const category = {
    website: p.categoryWebsite,
    webapp: p.categoryWebapp,
    bot: p.categoryBot,
    other: p.categoryOther,
  }[project.category];
  const status = { live: p.statusLive, completed: p.statusCompleted, prototype: p.statusPrototype }[project.status];
  const copy = p.items[project.i18nKey];
  /** Descriptive alt for the n-th screen (1-based): "Cashflow Tashkent — Сайт делового сообщества, экран 2". */
  const screenAlt = (n: number) =>
    p.screenAlt.replace('{title}', copy.title).replace('{subtitle}', copy.subtitle).replace('{n}', String(n));
  return { ...copy, category, status, screenAlt };
}
