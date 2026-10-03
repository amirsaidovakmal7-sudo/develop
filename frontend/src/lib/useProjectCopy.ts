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
  return { ...p.items[project.i18nKey], category, status };
}
