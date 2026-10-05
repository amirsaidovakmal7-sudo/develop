import { useCallback, useState } from 'react';
import { formatPhone, getPhoneDigits, isPhoneComplete } from '../lib/phone';
import { getCsrfToken } from './useCsrfToken';

export type OrderFormStatus = 'idle' | 'submitting' | 'success' | 'error';
export type OrderField = 'name' | 'phone' | 'telegram' | 'consent';

const TELEGRAM_RE = /^[A-Za-z0-9_]{5,32}$/;

export function normalizeTelegram(raw: string): string {
  return raw
    .trim()
    .replace(/^(https?:\/\/)?(t\.me|telegram\.me)\//i, '')
    .replace(/^@/, '');
}

function validate(name: string, phone: string, telegram: string, consent: boolean) {
  const errors: Partial<Record<OrderField, true>> = {};
  if (!name.trim()) errors.name = true;
  if (!isPhoneComplete(phone)) errors.phone = true;
  const tg = normalizeTelegram(telegram);
  if (tg && !TELEGRAM_RE.test(tg)) errors.telegram = true;
  if (!consent) errors.consent = true;
  return errors;
}

/** Posts to Django's `/order` (fields `name`, `phone_number`, optional `telegram` and `comment`; CSRF header + XHR marker for a JSON reply). */
export function useOrderForm() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [telegram, setTelegram] = useState('');
  const [comment, setComment] = useState('');
  const [consent, setConsent] = useState(false);
  const [attempted, setAttempted] = useState(false);
  const [status, setStatus] = useState<OrderFormStatus>('idle');
  const [shake, setShake] = useState(0);

  const errors = attempted ? validate(name, phone, telegram, consent) : {};

  const onPhoneFocus = useCallback(() => setPhone((v) => v || '+998 '), []);
  const onPhoneChange = useCallback((raw: string) => setPhone(formatPhone(getPhoneDigits(raw))), []);
  const onPhoneBlur = useCallback(() => setPhone((v) => (v.trim() === '+998' ? '' : v)), []);

  const reset = useCallback(() => {
    setName('');
    setPhone('');
    setTelegram('');
    setComment('');
    setConsent(false);
    setAttempted(false);
    setStatus('idle');
  }, []);

  const submit = useCallback(async () => {
    setAttempted(true);
    const found = validate(name, phone, telegram, consent);
    if (Object.keys(found).length > 0) {
      if (found.consent) setShake((n) => n + 1);
      return false;
    }
    setStatus('submitting');
    const body = new FormData();
    body.set('name', name.trim());
    body.set('phone_number', phone);
    const tg = normalizeTelegram(telegram);
    if (tg) body.set('telegram', `@${tg}`);
    if (comment.trim()) body.set('comment', comment.trim());
    try {
      const res = await fetch('/order', {
        method: 'POST',
        body,
        headers: { 'X-Requested-With': 'XMLHttpRequest', 'X-CSRFToken': getCsrfToken() },
      });
      if (!res.ok) throw new Error(`order request failed: ${res.status}`);
      setStatus('success');
    } catch {
      setStatus('error');
    }
    return true;
  }, [name, phone, telegram, comment, consent]);

  return {
    name,
    setName,
    phone,
    onPhoneFocus,
    onPhoneChange,
    onPhoneBlur,
    telegram,
    setTelegram,
    comment,
    setComment,
    consent,
    setConsent,
    errors,
    shake,
    status,
    setStatus,
    submit,
    reset,
  };
}
