export const contacts = {
  phone: { label: '+998 97 777 28 09', href: 'tel:+998977772809' },
  telegram: { label: '@akm0028', href: 'https://t.me/akm0028' },
  email: { label: 'amirsaidovakmal7@gmail.com', href: 'mailto:amirsaidovakmal7@gmail.com' },
  instagram: { label: '@akm.028', href: 'https://instagram.com/akm.028' },
} as const;

export type ContactKey = keyof typeof contacts;
export const contactOrder: ContactKey[] = ['phone', 'telegram', 'email', 'instagram'];
