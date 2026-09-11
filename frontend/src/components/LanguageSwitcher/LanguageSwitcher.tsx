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
      {LOCALES.map((loc) => (
        <button
          key={loc}
          type="button"
          className={`${styles.btn} ${loc === locale ? styles.active : ''}`}
          aria-pressed={loc === locale}
          onClick={() => setLocale(loc)}
        >
          {t.common[LABEL_KEY[loc]]}
        </button>
      ))}
    </div>
  );
}
