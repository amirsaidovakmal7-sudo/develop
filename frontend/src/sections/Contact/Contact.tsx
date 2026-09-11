import { useTranslation } from '../../i18n';
import { useOrderForm } from '../../hooks/useOrderForm';
import { SuccessModal } from '../../components/SuccessModal/SuccessModal';
import styles from './Contact.module.css';

export function Contact() {
  const { t } = useTranslation();
  const form = useOrderForm();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void form.submit();
  };

  return (
    <section id="contact" className={`${styles.contact} section`}>
      <div className={styles.glow} aria-hidden="true" />
      <div className="container">
        <div className={styles.grid}>
          <div>
            <span className="section-label">{t.contact.label}</span>
            <h2 className={styles.title}>
              <span>{t.contact.titleLine1}</span>
              <span>{t.contact.titleLine2}</span>
            </h2>
            <p className={styles.subtitle}>{t.contact.subtitle}</p>

            <a
              href="https://t.me/akm0028"
              target="_blank"
              rel="noreferrer"
              className={styles.telegramCard}
              data-cursor="open"
            >
              <span className={styles.telegramIcon} aria-hidden="true">
                ↗
              </span>
              <span>
                <span className={styles.telegramTitle}>{t.contact.telegramTitle}</span>
                <br />
                <span className={styles.telegramHandle}>{t.contact.telegramHandle}</span>
              </span>
            </a>
          </div>

          <form className={styles.formCard} onSubmit={onSubmit} noValidate>
            <div className={styles.formTitle}>{t.form.title}</div>

            <div className={styles.field}>
              <label htmlFor="order-name">{t.form.nameLabel}</label>
              <input
                id="order-name"
                type="text"
                required
                value={form.name}
                onChange={(e) => form.setName(e.target.value)}
                placeholder={t.form.namePlaceholder}
                autoComplete="name"
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="order-phone">{t.form.phoneLabel}</label>
              <input
                id="order-phone"
                type="tel"
                inputMode="numeric"
                required
                maxLength={18}
                className={form.phoneError ? styles.error : ''}
                value={form.phone}
                onFocus={form.onPhoneFocus}
                onChange={(e) => form.onPhoneChange(e.target.value)}
                onBlur={form.onPhoneBlur}
                placeholder={t.form.phonePlaceholder}
                autoComplete="tel"
              />
              {form.phoneError && <div className={styles.fieldError}>{t.form.phoneError}</div>}
            </div>

            <button type="submit" className={styles.submit} disabled={form.status === 'submitting'}>
              {form.status === 'submitting' ? t.form.submitting : t.form.submit}
            </button>
          </form>
        </div>

        <p className={styles.final}>
          <span>{t.contact.finalLine1}</span>
          <span className={styles.accent}>{t.contact.finalLine2}</span>
        </p>
      </div>

      <SuccessModal
        status={form.status === 'success' || form.status === 'error' ? form.status : null}
        onClose={form.reset}
      />
    </section>
  );
}
