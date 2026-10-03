import { useEffect, useState } from 'react';
import { useTranslation } from '../../i18n';
import { Link, PATHS, useRequestHref, useRouter, type PageId } from '../../lib/router';
import { Button } from '../ui/Button';
import { LanguageSwitcher } from './LanguageSwitcher';
import styles from './Header.module.css';

export const NAV: PageId[] = ['home', 'about', 'services', 'projects', 'contacts'];

export function Logo() {
  return (
    <Link to={PATHS.home} className={styles.logo} aria-label="akmal.dev">
      akmal<span>.dev</span>
    </Link>
  );
}

export function Header() {
  const { t } = useTranslation();
  const { route } = useRouter();
  const requestHref = useRequestHref();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''} ${open ? styles.isOpen : ''}`}>
      <div className={`container ${styles.bar}`}>
        <span onClickCapture={() => setOpen(false)}>
          <Logo />
        </span>
        <nav className={styles.pill} aria-label="akmal.dev">
          {NAV.map((id) => (
            <Link
              key={id}
              to={PATHS[id]}
              className={route === id ? styles.on : undefined}
              aria-current={route === id ? 'page' : undefined}
            >
              {t.nav[id]}
            </Link>
          ))}
        </nav>
        <div className={styles.right}>
          <LanguageSwitcher className={styles.desktopOnly} />
          <Button to={requestHref} className={styles.cta}>
            {t.nav.cta}
          </Button>
          <button
            type="button"
            className={styles.burger}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? t.common.menuClose : t.common.menuOpen}
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>

      <div className={`${styles.menuWrap} ${open ? styles.menuOpen : ''}`} aria-hidden={!open} inert={!open}>
        <button type="button" className={styles.scrim} tabIndex={-1} aria-label={t.common.menuClose} onClick={() => setOpen(false)} />
        <div id="mobile-menu" className={styles.sheet}>
          <nav className={styles.menuNav} aria-label="akmal.dev">
            {NAV.map((id, i) => (
              <Link
                key={id}
                to={PATHS[id]}
                onClick={() => setOpen(false)}
                style={{ ['--i' as string]: i }}
                className={route === id ? styles.menuOn : undefined}
                aria-current={route === id ? 'page' : undefined}
              >
                <span>{t.nav[id]}</span>
                <i aria-hidden="true">→</i>
              </Link>
            ))}
          </nav>
          <div className={styles.menuFoot} style={{ ['--i' as string]: NAV.length }}>
            <LanguageSwitcher className={styles.segmented} />
            <div onClickCapture={() => setOpen(false)}>
              <Button to={requestHref} full>
                {t.nav.cta}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
