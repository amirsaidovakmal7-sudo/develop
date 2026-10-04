import type { Translations } from '../i18n/ru';
import type { ServicePageId } from '../lib/routes';

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
  /** Service pages this project illustrates; the first one is linked from the case. */
  services: ServicePageId[];
}

export const projects: ProjectDefinition[] = [
  {
    id: 'cashflow',
    category: 'website',
    url: 'https://cashflowtashkent.uz',
    status: 'live',
    i18nKey: 'cashflow',
    services: ['websites'],
  },
  {
    id: 'sonata-school',
    category: 'website',
    url: 'https://sonataschool.uz',
    status: 'live',
    i18nKey: 'sonataSchool',
    services: ['websites'],
  },
  {
    id: 'flexcamp',
    category: 'website',
    url: 'https://flexcamp.uz',
    status: 'live',
    i18nKey: 'flexcamp',
    services: ['websites'],
  },
  {
    id: 'aysdrums',
    category: 'website',
    url: 'https://aysdrums.uz',
    status: 'live',
    i18nKey: 'aysdrums',
    services: ['websites'],
  },
  {
    id: 'sonata-bot',
    category: 'bot',
    status: 'completed',
    i18nKey: 'sonataBot',
    services: ['telegramBots'],
  },
  {
    id: 'learning-center',
    category: 'website',
    url: 'https://b4lerman.pythonanywhere.com/',
    status: 'live',
    i18nKey: 'learningCenter',
    services: ['websites'],
  },
  {
    id: 'tech-project',
    category: 'webapp',
    status: 'completed',
    i18nKey: 'techProject',
    services: ['crm', 'miniApp'],
  },
  {
    id: 'online-shop',
    category: 'webapp',
    status: 'completed',
    i18nKey: 'onlineShop',
    services: ['websites', 'miniApp', 'crm'],
  },
  {
    id: 'fastfood-bot',
    category: 'bot',
    status: 'completed',
    i18nKey: 'fastfoodBot',
    services: ['telegramBots'],
  },
  {
    id: 'messenger',
    category: 'other',
    status: 'completed',
    i18nKey: 'messenger',
    services: ['miniApp'],
  },
  {
    id: 'news-portal',
    category: 'website',
    status: 'completed',
    i18nKey: 'newsPortal',
    services: ['websites'],
  },
  {
    id: 'akkord',
    category: 'website',
    status: 'prototype',
    i18nKey: 'akkord',
    services: ['websites'],
  },
];

export const featuredProjectIds = ['cashflow', 'sonata-school', 'sonata-bot'];

/** Cases shown on a service page, strongest first. */
export const serviceProjectIds: Record<ServicePageId, string[]> = {
  websites: ['cashflow', 'sonata-school', 'aysdrums', 'learning-center'],
  telegramBots: ['sonata-bot', 'fastfood-bot'],
  miniApp: ['online-shop', 'messenger', 'tech-project'],
  crm: ['tech-project', 'online-shop'],
};
