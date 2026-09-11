import { useEffect } from 'react';
import { useTranslation } from '../i18n';

/**
 * Keeps document.title / meta description / OG tags in sync with the active
 * locale (TECH_TASK_REDISIGN.md п.47) — the shell template renders the RU
 * versions server-side for the first paint and for crawlers that don't run
 * JS; this only updates them after a client-side language switch.
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
    setMeta('meta[property="og:locale"]', locale === 'ru' ? 'ru_RU' : locale === 'uz' ? 'uz_UZ' : 'en_US');
    setMeta('meta[name="twitter:title"]', t.metadata.ogTitle);
    setMeta('meta[name="twitter:description"]', t.metadata.ogDescription);
  }, [t, locale]);

  return null;
}
