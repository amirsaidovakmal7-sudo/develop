import { useEffect } from 'react';
import { useTranslation } from '../i18n';
import { PATHS, useRouter } from '../lib/router';

const OG_LOCALE = { ru: 'ru_RU', uz: 'uz_UZ', en: 'en_US' } as const;
const ORIGIN = 'https://akmal.dev';

/** The shell template renders the Russian home meta server-side; this keeps it in sync after client-side navigation or a language switch. */
export function DocumentMeta() {
  const { t, locale } = useTranslation();
  const { route } = useRouter();

  useEffect(() => {
    const meta = t.meta[route];
    document.title = meta.title;
    const set = (selector: string, attr: string, value: string) => document.querySelector(selector)?.setAttribute(attr, value);
    const url = ORIGIN + (route === 'notFound' ? '/' : PATHS[route]);
    set('meta[name="description"]', 'content', meta.description);
    set('meta[property="og:title"]', 'content', meta.title);
    set('meta[property="og:description"]', 'content', meta.description);
    set('meta[property="og:locale"]', 'content', OG_LOCALE[locale]);
    set('meta[property="og:url"]', 'content', url);
    set('meta[name="twitter:title"]', 'content', meta.title);
    set('meta[name="twitter:description"]', 'content', meta.description);
    set('link[rel="canonical"]', 'href', url);
  }, [t, locale, route]);

  return null;
}
