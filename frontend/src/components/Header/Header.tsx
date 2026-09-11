import { useEffect, useState } from 'react';
import { useTranslation } from '../../i18n';
import { LanguageSwitcher } from '../LanguageSwitcher/LanguageSwitcher';
import styles from './Header.module.css';

const NAV_ITEMS = [
  { href: '#about', key: 'about' as const },
  { href: '#work', key: 'work' as const },
  { href: '#process', key: 'process' as const },
];

/** TECH_TASK_REDISIGN.md п.11: minimal header that changes state on scroll. */
export function Header() {
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
        <a href="#hero" className={styles.logo} data-cursor="explore">
          akmal<span>.dev</span>
        </a>
        <div className={styles.right}>
          <nav className={styles.nav} aria-label={t.common.ariaPrimaryNav}>
            <ul>
              {NAV_ITEMS.map((item) => (
                <li key={item.key}>
                  <a href={item.href}>{t.nav[item.key]}</a>
                </li>
              ))}
              <li>
                <a href="#contact" className={styles.navCta} data-cursor="view">
                  {t.nav.contact}
                </a>
              </li>
            </ul>
          </nav>
          <LanguageSwitcher />
          <button
            type="button"
            className={`${styles.menuToggle} ${menuOpen ? styles.open : ''}`}
            aria-label={menuOpen ? t.common.ariaMenuClose : t.common.ariaMenuToggle}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      <div className={`${styles.mobilePanel} ${menuOpen ? styles.open : ''}`} aria-hidden={!menuOpen}>
        <ul>
          {NAV_ITEMS.map((item) => (
            <li key={item.key}>
              <a href={item.href} onClick={closeMenu}>
                {t.nav[item.key]}
              </a>
            </li>
          ))}
          <li>
            <a href="#contact" onClick={closeMenu}>
              {t.nav.contact}
            </a>
          </li>
        </ul>
      </div>
    </>
  );
}
