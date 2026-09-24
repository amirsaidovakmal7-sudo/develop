import { LOCALES, useTranslation, type Locale } from '../../i18n';
import styles from './LanguageSwitcher.module.css';

const LABEL_KEY: Record<Locale, 'langRu' | 'langUz' | 'langEn'> = {
  ru: 'langRu',
  uz: 'langUz',
  en: 'langEn',
};

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useTranslation();

  return (
    <div className={styles.switcher} role="group" aria-label={t.common.ariaLangSwitch}>
      {LOCALES.map((code) => (
        <button
          key={code}
          type="button"
          lang={code}
          className={`${styles.option} ${locale === code ? styles.active : ''}`}
          aria-pressed={locale === code}
          onClick={() => setLocale(code)}
        >
          {t.common[LABEL_KEY[code]]}
        </button>
      ))}
    </div>
  );
}
