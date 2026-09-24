import { useEffect, type FormEvent } from 'react';
import { useTranslation } from '../../i18n';
import { useOrderForm } from '../../hooks/useOrderForm';
import { flare, setGathering } from '../../lib/sceneStore';
import { Lines, Settle } from '../../components/Motion/Motion';
import { SectionMark } from '../../components/SectionMark/SectionMark';
import { GirihMark } from '../../components/GirihMark/GirihMark';
import { Button } from '../../components/Button/Button';
import styles from './Contact.module.css';

/**
 * The order form.
 *
 * Everything server-side is untouched: this still POSTs `name` and
 * `phone_number` to `/order` with the CSRF token and the
 * `X-Requested-With: XMLHttpRequest` header that makes Django answer with
 * JSON (see hooks/useOrderForm.ts and app/views.py). Only the presentation
 * changed.
 *
 * The result is shown in place rather than in a modal: there is no dialog
 * to trap focus in or dismiss, the outcome is announced politely to screen
 * readers, and a failed send leaves the Telegram route visible right beside
 * it instead of hiding it behind an overlay.
 */
export function Contact() {
  const { t } = useTranslation();
  const form = useOrderForm();

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    void form.submit();
  };

  const settled = form.status === 'success' || form.status === 'error';

  // A delivered order is the one moment on the page worth marking: the
  // lantern sends a single bright wave out through the strapwork.
  useEffect(() => {
    if (form.status === 'success') flare();
  }, [form.status]);

  useEffect(() => () => setGathering(false), []);

  return (
    <section id="contact" className={`${styles.contact} section`}>
      <div className="shell">
        <SectionMark index="06" label={t.contact.label} />

        <div className={styles.head}>
          <Lines
            as="h2"
            className={styles.title}
            step={100}
            lines={[t.contact.titleLine1, t.contact.titleLine2]}
          />
          <Settle className={styles.subtitle} as="p" delay={260}>
            {t.contact.subtitle}
          </Settle>
        </div>

        <div className={styles.grid}>
          <Settle className={styles.aside} delay={120}>
            <a className={styles.telegram} href="https://t.me/akm0028" target="_blank" rel="noreferrer">
              <span className={styles.telegramArrow} aria-hidden="true">
                ↗
              </span>
              <span>
                <span className={styles.telegramTitle}>{t.contact.telegramTitle}</span>
                <span className={styles.telegramHandle}>{t.contact.telegramHandle}</span>
              </span>
            </a>
            <p className={styles.asideRow}>
              {t.hero.specLocation}
              <span className={styles.asideValue}>{t.footer.location}</span>
            </p>
            <p className={styles.asideRow}>
              {t.hero.specLanguages}
              <span className={styles.asideValue}>RU · UZ · EN</span>
            </p>
          </Settle>

          <Settle className={styles.panel} delay={200} amount={0.15}>
            <GirihMark className={styles.panelMark} radius={0.45} weight={0.8} />

            {settled ? (
              <div className={styles.panelInner}>
                <div className={styles.result} role="status" aria-live="polite">
                  <GirihMark
                    className={`${styles.resultMark} ${form.status === 'error' ? styles.resultMarkError : ''}`}
                    radius={0.24}
                    weight={1.4}
                  />
                  <h3 className={styles.resultTitle}>
                    {form.status === 'success' ? t.form.successTitle : t.form.errorTitle}
                  </h3>
                  <p className={styles.resultText}>
                    {form.status === 'success' ? t.form.successText : t.form.errorText}
                  </p>
                  <Button variant="ghost" onClick={form.reset} arrow={form.status === 'error' ? '→' : null}>
                    {form.status === 'success' ? t.form.successClose : t.form.errorClose}
                  </Button>
                </div>
              </div>
            ) : (
              <form
                className={styles.panelInner}
                onSubmit={onSubmit}
                noValidate
                onFocusCapture={() => setGathering(true)}
                onBlurCapture={() => setGathering(false)}
              >
                <h3 className={styles.panelTitle}>{t.form.title}</h3>

                <div className={styles.field}>
                  <label className={styles.label} htmlFor="order-name">
                    {t.form.nameLabel}
                  </label>
                  <input
                    id="order-name"
                    name="name"
                    className={styles.input}
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => form.setName(e.target.value)}
                    placeholder={t.form.namePlaceholder}
                    autoComplete="name"
                  />
                </div>

                <div className={styles.field}>
                  <label className={styles.label} htmlFor="order-phone">
                    {t.form.phoneLabel}
                  </label>
                  <input
                    id="order-phone"
                    name="phone_number"
                    className={`${styles.input} ${form.phoneError ? styles.inputError : ''}`}
                    type="tel"
                    inputMode="tel"
                    required
                    maxLength={18}
                    value={form.phone}
                    onFocus={form.onPhoneFocus}
                    onChange={(e) => form.onPhoneChange(e.target.value)}
                    onBlur={form.onPhoneBlur}
                    placeholder={t.form.phonePlaceholder}
                    autoComplete="tel"
                    aria-invalid={form.phoneError || undefined}
                    aria-describedby={form.phoneError ? 'order-phone-error' : undefined}
                  />
                  {form.phoneError && (
                    <span id="order-phone-error" className={styles.error} role="alert">
                      {t.form.phoneError}
                    </span>
                  )}
                </div>

                <div className={styles.submitRow}>
                  <Button
                    type="submit"
                    variant="primary"
                    block
                    arrow="→"
                    busy={form.status === 'submitting'}
                    disabled={form.status === 'submitting'}
                  >
                    {form.status === 'submitting' ? t.form.submitting : t.form.submit}
                  </Button>
                  <p className={styles.privacy}>{t.form.note}</p>
                </div>
              </form>
            )}
          </Settle>
        </div>

        <Lines
          as="p"
          className={styles.closing}
          step={110}
          lines={[
            t.contact.finalLine1,
            <span key="accent" className={styles.closingAccent}>
              {t.contact.finalLine2}
            </span>,
          ]}
        />
      </div>
    </section>
  );
}
