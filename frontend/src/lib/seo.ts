/**
 * Search meta shared by the client (DocumentMeta) and the build (scripts/gen-seo.ts → dist-seo/meta.json → Django),
 * so the server and the browser always describe a page with the same words.
 * Runtime imports carry `.ts` so Node can run this file directly.
 */
import { DEFAULT_LOCALE, LOCALES, SERVICE_PAGES, pathFor, type Locale, type PageId } from './routes.ts';
import type { Translations } from '../i18n/ru.ts';

export const DEFAULT_ORIGIN = 'https://akmal.dev';
export const OG_LOCALE: Record<Locale, string> = { ru: 'ru_RU', uz: 'uz_UZ', en: 'en_US' };
export const OG_IMAGE = { width: 1200, height: 630 };
/** Published path of the per-language preview (frontend/public/og → dist/og, served under STATIC_URL). */
export const ogImagePath = (locale: Locale) => `/static/og/og-${locale}.png`;

export type Alternate = { hreflang: string; path: string };

/** Every language version plus x-default (Russian, at the root). */
export function alternates(page: PageId): Alternate[] {
  return [
    ...LOCALES.map((l) => ({ hreflang: l, path: pathFor(page, l) })),
    { hreflang: 'x-default', path: pathFor(page, DEFAULT_LOCALE) },
  ];
}

export type Crumb = { name: string; path: string };

/** Home → (Услуги →) page. The home page itself has no trail. */
export function breadcrumbs(page: PageId, locale: Locale, t: Translations): Crumb[] {
  if (page === 'home') return [];
  const home = { name: t.nav.home, path: pathFor('home', locale) };
  if ((SERVICE_PAGES as PageId[]).includes(page)) {
    const id = page as (typeof SERVICE_PAGES)[number];
    return [home, { name: t.nav.services, path: pathFor('services', locale) }, { name: t.servicePages[id].name, path: pathFor(page, locale) }];
  }
  return [home, { name: t.nav[page as keyof Translations['nav']], path: pathFor(page, locale) }];
}
