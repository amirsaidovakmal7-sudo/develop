/**
 * Uzbek phone mask/validation — ported 1:1 from the previous vanilla-JS
 * implementation in app/templates/index.html so behaviour (and the backend
 * contract: 9 digits after +998) does not regress (TECH_TASK_REDISIGN.md п.26).
 */
export function getPhoneDigits(value: string): string {
  let digits = value.replace(/\D/g, '');
  if (digits.startsWith('998')) digits = digits.slice(3);
  return digits.slice(0, 9);
}

export function formatPhone(digits: string): string {
  let out = '+998';
  if (digits.length > 0) out += ' ' + digits.slice(0, 2);
  if (digits.length > 2) out += ' ' + digits.slice(2, 5);
  if (digits.length > 5) out += ' ' + digits.slice(5, 7);
  if (digits.length > 7) out += ' ' + digits.slice(7, 9);
  return out;
}

export function isPhoneComplete(value: string): boolean {
  return getPhoneDigits(value).length === 9;
}
