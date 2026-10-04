import { createContext, useCallback, useContext, useEffect, useMemo, type ReactNode } from 'react';
import { ru } from './ru';
import { en } from './en';
import { uz } from './uz';
import type { Translations } from './ru';
import { useRouter } from '../lib/router';
import type { Locale } from '../lib/routes';

export { LOCALES, type Locale } from '../lib/routes';

const dictionaries: Record<Locale, Translations> = { ru, uz, en };

type I18nContextValue = {
  locale: Locale;
  t: Translations;
  /** Address of the current page in another language (the switcher is plain links). */
  hrefFor: (locale: Locale) => string;
  setLocale: (locale: Locale) => void;
};

const I18nContext = createContext<I18nContextValue | null>(null);

/** The language comes from the URL (`/`, `/uz/…`, `/en/…`), never from storage, so every address shows exactly one language. */
export function I18nProvider({ children }: { children: ReactNode }) {
  const { locale, route, href, navigate } = useRouter();

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const hrefFor = useCallback((next: Locale) => href(route === 'notFound' ? 'home' : route, next), [href, route]);
  const setLocale = useCallback((next: Locale) => navigate(hrefFor(next)), [navigate, hrefFor]);

  const value = useMemo<I18nContextValue>(
    () => ({ locale, t: dictionaries[locale], hrefFor, setLocale }),
    [locale, hrefFor, setLocale],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useTranslation() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useTranslation must be used within an I18nProvider');
  return ctx;
}
