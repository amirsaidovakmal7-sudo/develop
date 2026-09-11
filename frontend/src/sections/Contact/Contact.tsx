import { motion, type Variants } from 'motion/react';
import { useTranslation } from '../../i18n';
import { useOrderForm } from '../../hooks/useOrderForm';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { SuccessModal } from '../../components/SuccessModal/SuccessModal';
import styles from './Contact.module.css';

const maskLine: Variants = {
  hidden: { y: '100%' },
  show: { y: 0, transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

export function Contact() {
  const { t } = useTranslation();
  const form = useOrderForm();
  const reducedMotion = usePrefersReducedMotion();

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
            <motion.div
              initial={reducedMotion ? undefined : 'hidden'}
              whileInView={reducedMotion ? undefined : 'show'}
              viewport={{ once: true, amount: 0.5 }}
            >
              <span className="section-label">{t.contact.label}</span>
            </motion.div>
            <h2 className={styles.title}>
              {reducedMotion ? (
                <>
                  <span>{t.contact.titleLine1}</span>
                  <span>{t.contact.titleLine2}</span>
                </>
              ) : (
                <motion.span initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }}>
                  <span>
                    <motion.span variants={maskLine} style={{ display: 'block' }}>
                      {t.contact.titleLine1}
                    </motion.span>
                  </span>
                  <span>
                    <motion.span variants={maskLine} transition={{ delay: 0.07 }} style={{ display: 'block' }}>
                      {t.contact.titleLine2}
                    </motion.span>
                  </span>
                </motion.span>
              )}
            </h2>
            <motion.p
              className={styles.subtitle}
              variants={reducedMotion ? undefined : fadeUp}
              initial={reducedMotion ? undefined : 'hidden'}
              whileInView={reducedMotion ? undefined : 'show'}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ delay: 0.15 }}
            >
              {t.contact.subtitle}
            </motion.p>

            <motion.a
              href="https://t.me/akm0028"
              target="_blank"
              rel="noreferrer"
              className={styles.telegramCard}
              data-cursor="open"
              variants={reducedMotion ? undefined : fadeUp}
              initial={reducedMotion ? undefined : 'hidden'}
              whileInView={reducedMotion ? undefined : 'show'}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ delay: 0.22 }}
            >
              <span className={styles.telegramIcon} aria-hidden="true">
                ↗
              </span>
              <span>
                <span className={styles.telegramTitle}>{t.contact.telegramTitle}</span>
                <br />
                <span className={styles.telegramHandle}>{t.contact.telegramHandle}</span>
              </span>
            </motion.a>
          </div>

          <motion.form
            className={styles.formCard}
            onSubmit={onSubmit}
            noValidate
            variants={reducedMotion ? undefined : fadeUp}
            initial={reducedMotion ? undefined : 'hidden'}
            whileInView={reducedMotion ? undefined : 'show'}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: 0.1 }}
          >
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
          </motion.form>
        </div>

        <motion.p
          className={styles.final}
          initial={reducedMotion ? undefined : { opacity: 0, y: 20 }}
          whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <span>{t.contact.finalLine1}</span>
          <span className={styles.accent}>{t.contact.finalLine2}</span>
        </motion.p>
      </div>

      <SuccessModal
        status={form.status === 'success' || form.status === 'error' ? form.status : null}
        onClose={form.reset}
      />
    </section>
  );
}
