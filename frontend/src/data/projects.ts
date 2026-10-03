import type { Translations } from '../i18n/ru';

export type ProjectKey = keyof Translations['projects']['items'];
export type ProjectCategory = 'website' | 'webapp' | 'bot' | 'other';
export type ProjectStatus = 'live' | 'completed' | 'prototype';

export interface ProjectDefinition {
  /** Folder name under src/assets/projects/<id>/. */
  id: string;
  category: ProjectCategory;
  /** Live URL, if the project has a public deployment. */
  url?: string;
  status: ProjectStatus;
  /** Key into `projects.items` in the dictionaries. */
  i18nKey: ProjectKey;
}

export const projects: ProjectDefinition[] = [
  {
    id: 'cashflow',
    category: 'website',
    url: 'https://cashflowtashkent.uz',
    status: 'live',
    i18nKey: 'cashflow',
  },
  {
    id: 'sonata-school',
    category: 'website',
    url: 'https://sonataschool.uz',
    status: 'live',
    i18nKey: 'sonataSchool',
  },
  {
    id: 'flexcamp',
    category: 'website',
    url: 'https://flexcamp.uz',
    status: 'live',
    i18nKey: 'flexcamp',
  },
  {
    id: 'aysdrums',
    category: 'website',
    url: 'https://aysdrums.uz',
    status: 'live',
    i18nKey: 'aysdrums',
  },
  {
    id: 'sonata-bot',
    category: 'bot',
    status: 'completed',
    i18nKey: 'sonataBot',
  },
  {
    id: 'learning-center',
    category: 'website',
    url: 'https://b4lerman.pythonanywhere.com/',
    status: 'live',
    i18nKey: 'learningCenter',
  },
  {
    id: 'tech-project',
    category: 'webapp',
    status: 'completed',
    i18nKey: 'techProject',
  },
  {
    id: 'online-shop',
    category: 'webapp',
    status: 'completed',
    i18nKey: 'onlineShop',
  },
  {
    id: 'fastfood-bot',
    category: 'bot',
    status: 'completed',
    i18nKey: 'fastfoodBot',
  },
  {
    id: 'messenger',
    category: 'other',
    status: 'completed',
    i18nKey: 'messenger',
  },
  {
    id: 'news-portal',
    category: 'website',
    status: 'completed',
    i18nKey: 'newsPortal',
  },
  {
    id: 'akkord',
    category: 'website',
    status: 'prototype',
    i18nKey: 'akkord',
  },
];

export const featuredProjectIds = ['cashflow', 'sonata-school', 'sonata-bot'];
