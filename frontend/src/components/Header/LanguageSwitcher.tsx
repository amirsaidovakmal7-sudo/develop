import { LOCALES, useTranslation } from '../../i18n';
import { Link } from '../../lib/router';
import styles from './Header.module.css';

const NAMES = { ru: 'Русский', uz: 'Oʻzbekcha', en: 'English' } as const;

/** Plain links to the same page in each language, so crawlers can follow every language version. */
export function LanguageSwitcher({ className, onPick }: { className?: string; onPick?: () => void }) {
  const { locale, hrefFor, t } = useTranslation();
  return (
    <nav className={`${styles.langs} ${className ?? ''}`} aria-label={t.common.language}>
      {LOCALES.map((l) => (
        <Link
          key={l}
          to={hrefFor(l)}
          hrefLang={l}
          lang={l}
          title={NAMES[l]}
          className={l === locale ? styles.langOn : undefined}
          aria-current={l === locale ? 'true' : undefined}
          onClick={onPick}
        >
          {l.toUpperCase()}
        </Link>
      ))}
    </nav>
  );
}
