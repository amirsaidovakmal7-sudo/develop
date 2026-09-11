export type ProjectCategory = 'website' | 'webapp' | 'bot' | 'other';
export type ProjectStatus = 'live' | 'completed' | 'prototype';

export interface ProjectDefinition {
  /** Matches the folder name under src/assets/projects/<id>/ and the i18n key prefix. */
  id: string;
  category: ProjectCategory;
  featured: boolean;
  /** Live URL, if the project has a public deployment. */
  url?: string;
  technologies: string[];
  status: ProjectStatus;
  /** Prefix used to read translated copy: `projects.<i18nKey>Title` etc. */
  i18nKey: string;
}

/**
 * All 12 projects currently shown on akmal.dev, carried over 1:1 from the
 * previous single-template site (see TECH_TASK_REDISIGN.md п.3) — nothing
 * dropped, nothing invented. Featured set follows п.68.
 */
export const projects: ProjectDefinition[] = [
  {
    id: 'cashflow',
    category: 'website',
    featured: true,
    url: 'https://cashflowtashkent.uz',
    technologies: ['Django', 'PostgreSQL', 'HTML', 'CSS', 'JavaScript'],
    status: 'live',
    i18nKey: 'cashflow',
  },
  {
    id: 'sonata-school',
    category: 'website',
    featured: true,
    url: 'https://sonataschool.uz',
    technologies: ['Django', 'PostgreSQL', 'HTML', 'CSS', 'JavaScript'],
    status: 'live',
    i18nKey: 'sonataSchool',
  },
  {
    id: 'flexcamp',
    category: 'website',
    featured: false,
    url: 'https://flexcamp.uz',
    technologies: ['Django', 'SQLite', 'HTML', 'CSS', 'JavaScript'],
    status: 'live',
    i18nKey: 'flexcamp',
  },
  {
    id: 'aysdrums',
    category: 'website',
    featured: true,
    url: 'https://aysdrums.uz',
    technologies: ['Django', 'PostgreSQL', 'HTML', 'CSS', 'JavaScript'],
    status: 'live',
    i18nKey: 'aysdrums',
  },
  {
    id: 'sonata-bot',
    category: 'bot',
    featured: true,
    technologies: ['Aiogram', 'Telebot', 'PostgreSQL', 'Google Sheets API'],
    status: 'completed',
    i18nKey: 'sonataBot',
  },
  {
    id: 'learning-center',
    category: 'website',
    featured: false,
    url: 'https://b4lerman.pythonanywhere.com/',
    technologies: ['Django', 'SQLite', 'HTML', 'CSS', 'JavaScript'],
    status: 'live',
    i18nKey: 'learningCenter',
  },
  {
    id: 'tech-project',
    category: 'webapp',
    featured: false,
    technologies: ['Django', 'PostgreSQL'],
    status: 'completed',
    i18nKey: 'techProject',
  },
  {
    id: 'online-shop',
    category: 'webapp',
    featured: false,
    technologies: ['Django', 'PostgreSQL'],
    status: 'completed',
    i18nKey: 'onlineShop',
  },
  {
    id: 'fastfood-bot',
    category: 'bot',
    featured: false,
    technologies: ['Aiogram', 'Telebot', 'SQLite'],
    status: 'completed',
    i18nKey: 'fastfoodBot',
  },
  {
    id: 'messenger',
    category: 'other',
    featured: false,
    technologies: ['Django', 'PostgreSQL', 'JavaScript'],
    status: 'completed',
    i18nKey: 'messenger',
  },
  {
    id: 'news-portal',
    category: 'website',
    featured: false,
    technologies: ['Django', 'SQLite'],
    status: 'completed',
    i18nKey: 'newsPortal',
  },
  {
    id: 'akkord',
    category: 'website',
    featured: false,
    technologies: ['HTML', 'CSS', 'JavaScript'],
    status: 'prototype',
    i18nKey: 'akkord',
  },
];
