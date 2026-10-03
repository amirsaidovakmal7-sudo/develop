import { LOCALES, useTranslation } from '../../i18n';
import styles from './Header.module.css';

export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, setLocale, t } = useTranslation();
  return (
    <div className={`${styles.langs} ${className ?? ''}`} role="group" aria-label={t.common.language}>
      {LOCALES.map((l) => (
        <button
          key={l}
          type="button"
          className={l === locale ? styles.langOn : undefined}
          aria-pressed={l === locale}
          onClick={() => setLocale(l)}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
