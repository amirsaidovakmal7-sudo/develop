import { useEffect, useRef, useState } from 'react';
import { useTranslation } from '../../i18n';
import styles from './TelegramCTA.module.css';

/**
 * Floating Telegram CTA (TECH_TASK_REDISIGN.md п.28) — no more infinitely
 * bouncing green circle. Compact on mobile, label appears from tablet up.
 * Hidden while the Contact section (which has its own large Telegram card)
 * is in view, to avoid two competing CTAs on screen at once.
 */
export function TelegramCTA() {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(true);
  const heroSeen = useRef(false);

  useEffect(() => {
    const heroEl = document.getElementById('hero');
    const contactEl = document.getElementById('contact');
    if (!contactEl) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.target.id === 'hero') heroSeen.current = entry.isIntersecting;
          if (entry.target.id === 'contact') setVisible(!entry.isIntersecting && !heroSeen.current);
        }
      },
      { threshold: 0.15 },
    );
    if (heroEl) observer.observe(heroEl);
    observer.observe(contactEl);
    return () => observer.disconnect();
  }, []);

  return (
    <a
      href="https://t.me/akm0028"
      target="_blank"
      rel="noreferrer"
      className={styles.cta}
      data-cursor="open"
      aria-label={t.common.ariaTelegram}
      style={{ opacity: visible ? 1 : 0, pointerEvents: visible ? 'auto' : 'none' }}
    >
      <span className={styles.label}>{t.contact.telegramTitle}</span>↗
    </a>
  );
}
