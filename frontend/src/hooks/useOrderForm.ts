import { useCallback, useState } from 'react';
import { formatPhone, getPhoneDigits, isPhoneComplete } from '../lib/phone';
import { getCsrfToken } from './useCsrfToken';

export type OrderFormStatus = 'idle' | 'submitting' | 'success' | 'error';

/**
 * Drives the /order form — same Django endpoint, same field names
 * (`name`, `phone_number`), same CSRF + X-Requested-With contract as the
 * previous implementation, just ported to React (TECH_TASK_REDISIGN.md п.25/63/64).
 * `views.py` is never touched: this only changes how the request is sent.
 */
export function useOrderForm() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [status, setStatus] = useState<OrderFormStatus>('idle');

  const phoneValid = isPhoneComplete(phone);
  const phoneError = phoneTouched && phone.length > 0 && !phoneValid;

  const onPhoneFocus = useCallback(() => {
    setPhone((current) => (current ? current : '+998 '));
  }, []);

  const onPhoneChange = useCallback((raw: string) => {
    setPhone(formatPhone(getPhoneDigits(raw)));
  }, []);

  const onPhoneBlur = useCallback(() => {
    setPhoneTouched(true);
    setPhone((current) => (current.trim() === '+998' ? '' : current));
  }, []);

  const reset = useCallback(() => {
    setName('');
    setPhone('');
    setPhoneTouched(false);
    setStatus('idle');
  }, []);

  const submit = useCallback(async () => {
    if (!isPhoneComplete(phone) || !name.trim()) {
      setPhoneTouched(true);
      return;
    }

    setStatus('submitting');
    const body = new FormData();
    body.set('name', name.trim());
    body.set('phone_number', phone);

    try {
      const res = await fetch('/order', {
        method: 'POST',
        body,
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'X-CSRFToken': getCsrfToken(),
        },
      });
      if (!res.ok) throw new Error(`order request failed: ${res.status}`);
      setStatus('success');
      setName('');
      setPhone('');
      setPhoneTouched(false);
    } catch {
      setStatus('error');
    }
  }, [name, phone]);

  return {
    name,
    setName,
    phone,
    onPhoneFocus,
    onPhoneChange,
    onPhoneBlur,
    phoneError,
    status,
    submit,
    reset,
  };
}
