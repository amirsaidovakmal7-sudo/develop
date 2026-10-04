/**
 * Writes dist-seo/meta.json — everything Django needs to render the <head> of any page in any language
 * (title, description, hreflang, breadcrumbs, OG, structured-data facts) straight from the i18n dictionaries,
 * so there is no second copy of the texts in Python.
 *
 * It lives outside dist/ on purpose: dist/ is published as static files, this is for the server only.
 * Run: node scripts/gen-seo.ts
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ru, type Translations } from '../src/i18n/ru.ts';
import { uz } from '../src/i18n/uz.ts';
import { en } from '../src/i18n/en.ts';
import { DEFAULT_LOCALE, HUB_ITEM_PAGES, LOCALES, PAGE_IDS, SERVICE_PAGES, pathFor, type Locale } from '../src/lib/routes.ts';
import { OG_IMAGE, OG_LOCALE, alternates, breadcrumbs, ogImagePath } from '../src/lib/seo.ts';
import { contactOrder, contacts } from '../src/data/contacts.ts';
import { projects } from '../src/data/projects.ts';

const dictionaries: Record<Locale, Translations> = { ru, uz, en };
const out = resolve(dirname(fileURLToPath(import.meta.url)), '../dist-seo/meta.json');

const languages = Object.fromEntries(
  LOCALES.map((locale) => {
    const t = dictionaries[locale];
    const pages = Object.fromEntries(
      PAGE_IDS.map((page) => {
        const service = (SERVICE_PAGES as string[]).includes(page) ? t.servicePages[page as (typeof SERVICE_PAGES)[number]] : null;
        return [
          page,
          {
            path: pathFor(page, locale),
            title: t.meta[page].title,
            description: t.meta[page].description,
            alternates: alternates(page),
            breadcrumbs: breadcrumbs(page, locale, t),
            ...(service ? { service: { name: service.name, description: service.intro } } : {}),
          },
        ];
      }),
    );
    return [
      locale,
      {
        ogLocale: OG_LOCALE[locale],
        ogLocaleAlternates: LOCALES.filter((l) => l !== locale).map((l) => OG_LOCALE[l]),
        ogImage: ogImagePath(locale),
        seo: t.seo,
        notFound: t.meta.notFound,
        pages,
        // Hub list for the services ItemList; items with their own page link to it.
        services: t.services.items.map((item, i) => ({
          name: item.title,
          description: item.short,
          page: HUB_ITEM_PAGES[i] ?? null,
        })),
        projects: projects.map((p) => ({
          name: t.projects.items[p.i18nKey].title,
          description: t.projects.items[p.i18nKey].subtitle,
          url: p.url ?? null,
        })),
      },
    ];
  }),
);

const meta = {
  defaultLocale: DEFAULT_LOCALE,
  locales: LOCALES,
  ogImage: OG_IMAGE,
  contacts: Object.fromEntries(contactOrder.map((k) => [k, contacts[k]])),
  languages,
};

mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, JSON.stringify(meta, null, 2) + '\n', 'utf-8');
console.log(`seo meta → ${out} (${LOCALES.length} languages × ${PAGE_IDS.length} pages)`);
