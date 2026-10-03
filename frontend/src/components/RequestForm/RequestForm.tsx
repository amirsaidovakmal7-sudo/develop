import { useEffect, useId, useRef, type FormEvent } from 'react';
import { useTranslation } from '../../i18n';
import { useOrderForm } from '../../hooks/useOrderForm';
import { REQUEST_ANCHOR } from '../../lib/router';
import { contacts } from '../../data/contacts';
import { Button } from '../ui/Button';
import { Heading } from '../ui/Heading';
import { Label } from '../ui/Label';
import { Reveal } from '../ui/Reveal';
import styles from './RequestForm.module.css';

export function RequestForm({ num }: { num?: string }) {
  const { t } = useTranslation();
  const f = useOrderForm();
  const id = useId();
  const consentRef = useRef<HTMLSpanElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!f.shake) return;
    const el = consentRef.current;
    el?.classList.remove(styles.shake);
    void el?.offsetWidth;
    el?.classList.add(styles.shake);
  }, [f.shake]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const sent = await f.submit();
    if (!sent) {
      const first = formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]');
      first?.focus();
    }
  };

  const err = (field: 'name' | 'phone' | 'telegram' | 'consent') => Boolean(f.errors[field]);
  const done = f.status === 'success';
  const failed = f.status === 'error';

  return (
    <section id={REQUEST_ANCHOR} className={`section ${styles.section}`} aria-labelledby={`${id}-title`}>
      <div className="container">
        <div className={styles.panel}>
          <i className={styles.corners} aria-hidden="true" />
          <Reveal className={styles.intro}>
            <Label num={num}>{t.form.label}</Label>
            <div id={`${id}-title`}>
              <Heading a={t.form.titleA} b={t.form.titleB} className={styles.title} />
            </div>
            <p className={styles.lead}>{t.form.intro}</p>
            <p className={styles.alt}>
              {t.form.alt}{' '}
              <a href={contacts.telegram.href} target="_blank" rel="noopener noreferrer">
                Telegram ↗
              </a>
            </p>
          </Reveal>

          <div className={styles.side}>
            {done || failed ? (
              <div className={styles.result} role="status" aria-live="polite">
                <span className={`${styles.resultIcon} ${failed ? styles.resultFail : ''}`} aria-hidden="true">
                  {failed ? '!' : '✓'}
                </span>
                <h3>{done ? t.form.successTitle : t.form.failTitle}</h3>
                <p>{done ? t.form.successText : t.form.failText}</p>
                <div className={styles.resultActions}>
                  {done ? (
                    <Button variant="ghost" arrow={null} onClick={f.reset}>
                      {t.form.successClose}
                    </Button>
                  ) : (
                    <>
                      <Button onClick={() => f.setStatus('idle')} arrow="↻">
                        {t.form.retry}
                      </Button>
                      <Button variant="ghost" href={contacts.telegram.href} arrow="↗">
                        {t.form.writeTelegram}
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <form ref={formRef} className={styles.form} onSubmit={onSubmit} noValidate>
                <div className={styles.field}>
                  <label htmlFor={`${id}-name`}>{t.form.nameLabel}</label>
                  <input
                    id={`${id}-name`}
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder={t.form.namePlaceholder}
                    value={f.name}
                    onChange={(e) => f.setName(e.target.value)}
                    aria-invalid={err('name')}
                    aria-describedby={err('name') ? `${id}-name-err` : undefined}
                    maxLength={80}
                  />
                  {err('name') ? (
                    <p id={`${id}-name-err`} className={styles.error}>
                      {t.form.errorName}
                    </p>
                  ) : null}
                </div>

                <div className={styles.field}>
                  <label htmlFor={`${id}-phone`}>{t.form.phoneLabel}</label>
                  <input
                    id={`${id}-phone`}
                    name="phone_number"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder={t.form.phonePlaceholder}
                    value={f.phone}
                    onFocus={f.onPhoneFocus}
                    onBlur={f.onPhoneBlur}
                    onChange={(e) => f.onPhoneChange(e.target.value)}
                    aria-invalid={err('phone')}
                    aria-describedby={err('phone') ? `${id}-phone-err` : undefined}
                  />
                  {err('phone') ? (
                    <p id={`${id}-phone-err`} className={styles.error}>
                      {t.form.errorPhone}
                    </p>
                  ) : null}
                </div>

                <div className={styles.field}>
                  <label htmlFor={`${id}-tg`}>
                    {t.form.telegramLabel} <span>{t.form.optional}</span>
                  </label>
                  <input
                    id={`${id}-tg`}
                    name="telegram"
                    type="text"
                    autoComplete="off"
                    autoCapitalize="off"
                    spellCheck={false}
                    placeholder={t.form.telegramPlaceholder}
                    value={f.telegram}
                    onChange={(e) => f.setTelegram(e.target.value)}
                    aria-invalid={err('telegram')}
                    aria-describedby={err('telegram') ? `${id}-tg-err` : undefined}
                    maxLength={64}
                  />
                  {err('telegram') ? (
                    <p id={`${id}-tg-err`} className={styles.error}>
                      {t.form.errorTelegram}
                    </p>
                  ) : null}
                </div>

                <div className={styles.field}>
                  <label htmlFor={`${id}-comment`}>
                    {t.form.commentLabel} <span>{t.form.optional}</span>
                  </label>
                  <textarea
                    id={`${id}-comment`}
                    name="comment"
                    rows={3}
                    placeholder={t.form.commentPlaceholder}
                    value={f.comment}
                    onChange={(e) => f.setComment(e.target.value)}
                    maxLength={1000}
                  />
                </div>

                <div className={styles.consentWrap}>
                  <label className={`${styles.consent} ${err('consent') ? styles.consentErr : ''}`}>
                    <input
                      type="checkbox"
                      checked={f.consent}
                      onChange={(e) => f.setConsent(e.target.checked)}
                      aria-invalid={err('consent')}
                      aria-describedby={err('consent') ? `${id}-consent-err` : undefined}
                    />
                    <span ref={consentRef} className={styles.box} aria-hidden="true" />
                    <span>{t.form.consent}</span>
                  </label>
                  {err('consent') ? (
                    <p id={`${id}-consent-err`} className={`${styles.error} ${styles.consentError}`} role="alert">
                      {t.form.errorConsent}
                    </p>
                  ) : null}
                </div>

                <Button type="submit" full disabled={f.status === 'submitting'}>
                  {f.status === 'submitting' ? t.form.submitting : t.form.submit}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
