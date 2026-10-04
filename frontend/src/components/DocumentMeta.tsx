import { useEffect } from 'react';
import { useTranslation } from '../i18n';
import { useRouter } from '../lib/router';
import { LOCALES, type Locale } from '../lib/routes';
import { DEFAULT_ORIGIN, OG_LOCALE, alternates, ogImagePath } from '../lib/seo';

/** Finds a head tag by selector or creates it, so a page reached from the 404 still gets its canonical and hreflang. */
function upsert(tag: 'meta' | 'link', selector: string, attrs: Record<string, string>) {
  let el = document.head.querySelector<HTMLElement>(selector);
  if (!el) {
    el = document.createElement(tag);
    document.head.appendChild(el);
  }
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
}

/**
 * Django renders the full head for the requested address (app/seo.py, same words via dist-seo/meta.json).
 * This keeps it in sync after client-side navigation, including the language switch.
 */
export function DocumentMeta() {
  const { t, locale } = useTranslation();
  const { route } = useRouter();

  useEffect(() => {
    const origin = document.documentElement.dataset.origin || DEFAULT_ORIGIN;
    const meta = t.meta[route];
    const indexable = route !== 'notFound';
    document.title = meta.title;
    const image = origin + ogImagePath(locale);
    const named = (name: string, content: string) => upsert('meta', `meta[name="${name}"]`, { name, content });
    const prop = (property: string, content: string) => upsert('meta', `meta[property="${property}"]`, { property, content });

    named('description', meta.description);
    named('robots', indexable ? 'index, follow, max-image-preview:large' : 'noindex, follow');
    prop('og:title', meta.title);
    prop('og:description', meta.description);
    prop('og:locale', OG_LOCALE[locale]);
    prop('og:image', image);
    prop('og:image:alt', t.seo.ogAlt);
    named('twitter:title', meta.title);
    named('twitter:description', meta.description);
    named('twitter:image', image);
    named('twitter:image:alt', t.seo.ogAlt);

    const others = LOCALES.filter((l: Locale) => l !== locale);
    document.head.querySelectorAll('meta[property="og:locale:alternate"]').forEach((el, i) => {
      if (others[i]) el.setAttribute('content', OG_LOCALE[others[i]]);
    });

    if (indexable) {
      const url = origin + alternates(route).find((a) => a.hreflang === locale)!.path;
      upsert('link', 'link[rel="canonical"]', { rel: 'canonical', href: url });
      prop('og:url', url);
      for (const alt of alternates(route)) {
        upsert('link', `link[rel="alternate"][hreflang="${alt.hreflang}"]`, { rel: 'alternate', hreflang: alt.hreflang, href: origin + alt.path });
      }
    } else {
      document.head.querySelectorAll('link[rel="canonical"], link[rel="alternate"][hreflang]').forEach((el) => el.remove());
    }
  }, [t, locale, route]);

  return null;
}
