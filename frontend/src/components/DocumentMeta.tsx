import { useEffect } from 'react';
import { useTranslation } from '../i18n';
import { projects } from '../data/projects';

const OG_LOCALE = { ru: 'ru_RU', uz: 'uz_UZ', en: 'en_US' } as const;

/**
 * Keeps the document head in sync with the active locale.
 *
 * The shell template (app/templates/index.html) renders the Russian title,
 * description, OG tags and the ProfessionalService JSON-LD server-side, so
 * the first paint and any crawler that does not run JS already see them.
 * This only updates them after a client-side language switch.
 *
 * It also publishes the project catalogue as an ItemList. In the old layout
 * every project's description sat in the DOM inside a card; the new work
 * section shows one case at a time, so the descriptions would otherwise
 * stop being indexable. Structured data is the honest way to keep that
 * content available to search engines — the same facts, from the same
 * dictionaries, for whichever language is active.
 */
export function DocumentMeta() {
  const { t, locale } = useTranslation();

  useEffect(() => {
    document.title = t.metadata.title;

    const setMeta = (selector: string, content: string) => {
      const el = document.querySelector(selector);
      if (el) el.setAttribute('content', content);
    };

    setMeta('meta[name="description"]', t.metadata.description);
    setMeta('meta[property="og:title"]', t.metadata.ogTitle);
    setMeta('meta[property="og:description"]', t.metadata.ogDescription);
    setMeta('meta[property="og:locale"]', OG_LOCALE[locale]);
    setMeta('meta[name="twitter:title"]', t.metadata.ogTitle);
    setMeta('meta[name="twitter:description"]', t.metadata.ogDescription);
  }, [t, locale]);

  useEffect(() => {
    const copy = t.projects as unknown as Record<string, string>;
    const data = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: t.projects.title,
      numberOfItems: projects.length,
      itemListElement: projects.map((project, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'CreativeWork',
          name: copy[`${project.i18nKey}Title`],
          headline: copy[`${project.i18nKey}Subtitle`],
          description: copy[`${project.i18nKey}Description`],
          inLanguage: locale,
          keywords: project.technologies.join(', '),
          ...(project.url ? { url: project.url } : null),
        },
      })),
    };

    const id = 'projects-jsonld';
    const script = document.getElementById(id) ?? document.createElement('script');
    script.id = id;
    (script as HTMLScriptElement).type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    if (!script.parentNode) document.head.appendChild(script);

    return () => script.remove();
  }, [t, locale]);

  return null;
}
