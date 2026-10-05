/**
 * Route table shared by the React router, the build scripts (scripts/gen-seo.ts,
 * scripts/prerender.mjs) and — through dist-seo/meta.json — Django. Russian
 * lives at the root, the other languages under a prefix; the URL alone decides
 * the language.
 */
export type Locale = 'ru' | 'uz' | 'en';
export const LOCALES: Locale[] = ['ru', 'uz', 'en'];
export const DEFAULT_LOCALE: Locale = 'ru';

export type ServicePageId = 'websites' | 'telegramBots' | 'miniApp' | 'crm';
export type PageId = 'home' | 'about' | 'services' | 'projects' | 'contacts' | ServicePageId;

export const SERVICE_PAGES: ServicePageId[] = ['websites', 'telegramBots', 'miniApp', 'crm'];

/** Own page for each item of `services.items` (same order): multi-page site, landing, bot, Mini App, CRM; the rest live on the hub only. */
export const HUB_ITEM_PAGES: (ServicePageId | null)[] = ['websites', 'websites', 'telegramBots', 'miniApp', 'crm', null, null, null, null, null];

export const PATHS: Record<PageId, string> = {
  home: '/',
  about: '/about',
  services: '/services',
  projects: '/projects',
  contacts: '/contacts',
  websites: '/services/websites',
  telegramBots: '/services/telegram-bots',
  miniApp: '/services/telegram-mini-app',
  crm: '/services/crm',
};

export const PAGE_IDS = Object.keys(PATHS) as PageId[];

export function localePrefix(locale: Locale) {
  return locale === DEFAULT_LOCALE ? '' : `/${locale}`;
}

export function pathFor(page: PageId, locale: Locale) {
  const prefix = localePrefix(locale);
  const path = PATHS[page];
  if (!prefix) return path;
  return path === '/' ? prefix : prefix + path;
}

export function normalizePath(pathname: string) {
  const trimmed = pathname.replace(/\/+$/, '');
  return trimmed === '' ? '/' : trimmed;
}

/** Splits `/uz/services` into `{ locale: 'uz', page: 'services' }`; unknown paths give `page: null`. */
export function parsePath(pathname: string): { locale: Locale; page: PageId | null } {
  const path = normalizePath(pathname);
  const match = path.match(/^\/(uz|en)(\/.*)?$/);
  const locale: Locale = match ? (match[1] as Locale) : DEFAULT_LOCALE;
  const rest = match ? match[2] || '/' : path;
  const page = PAGE_IDS.find((id) => PATHS[id] === rest) ?? null;
  return { locale, page };
}
