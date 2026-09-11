import { useTranslation } from '../i18n';
import type { ProjectDefinition } from '../data/projects';
import type { Translations } from '../i18n/ru';

type ProjectsDict = Translations['projects'];

/** Reads `projects.<i18nKey>Title` etc. for a given project — keeps ProjectCard/Viewer copy-agnostic. */
export function useProjectCopy(project: ProjectDefinition) {
  const { t } = useTranslation();
  const p = t.projects as unknown as Record<string, string>;
  const key = project.i18nKey;

  const features = [p[`${key}Feature1`], p[`${key}Feature2`], p[`${key}Feature3`]].filter(Boolean);

  return {
    title: p[`${key}Title`] ?? project.id,
    subtitle: p[`${key}Subtitle`] ?? '',
    description: p[`${key}Description`] ?? '',
    features,
    categoryLabel: CATEGORY_KEY[project.category] ? t.projects[CATEGORY_KEY[project.category]] : '',
    statusLabel: STATUS_KEY[project.status] ? t.projects[STATUS_KEY[project.status]] : '',
  };
}

const CATEGORY_KEY: Record<ProjectDefinition['category'], keyof ProjectsDict> = {
  website: 'categoryWebsite',
  webapp: 'categoryWebapp',
  bot: 'categoryBot',
  other: 'categoryOther',
};

const STATUS_KEY: Record<ProjectDefinition['status'], keyof ProjectsDict> = {
  live: 'statusLive',
  completed: 'statusCompleted',
  prototype: 'statusPrototype',
};
