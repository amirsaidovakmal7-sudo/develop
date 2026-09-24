import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from '../../i18n';
import { GirihMark } from '../GirihMark/GirihMark';
import { LanguageSwitcher } from '../LanguageSwitcher/LanguageSwitcher';
import { scrollState } from '../../lib/scrollStore';
import styles from './Header.module.css';

const NAV = [
  { href: '#work', key: 'work' as const, num: '01' },
  { href: '#approach', key: 'about' as const, num: '02' },
  { href: '#process', key: 'process' as const, num: '04' },
];

const SECTION_IDS = ['work', 'approach', 'build', 'process', 'terms', 'contact'];

/**
 * Fixed rule across the top of the page: wordmark, section links, language,
 * and the order CTA. The accent appears here only as the scroll-progress
 * hairline and the active-section underline — position information, not
 * decoration.
 */
export function Header() {
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [current, setCurrent] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const progressRef = useRef<HTMLSpanElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Scroll state and the progress hairline share one rAF-throttled listener;
  // the bar is written straight to the transform so it never re-renders React.
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = scrollState.y;
      setScrolled(y > 24);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, y / max) : 0;
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${p})`;
    };
    const onScroll = () => {
      if (!raf) raf = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  // Which section the reader is in — drives the active nav underline.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setCurrent(entry.target.id);
        }
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    for (const id of SECTION_IDS) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    document.body.classList.toggle('is-locked', menuOpen);
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.classList.remove('is-locked');
    };
  }, [menuOpen]);

  return (
    <>
      <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
        <span ref={progressRef} className={styles.progress} aria-hidden="true" style={{ transform: 'scaleX(0)' }} />
        <div className={styles.inner}>
          <a href="#top" className={styles.brand}>
            <GirihMark className={styles.brandMark} radius={0.24} weight={1} />
            akmal<span className={styles.brandDim}>.dev</span>
          </a>

          <nav className={styles.nav} aria-label={t.common.ariaPrimaryNav}>
            <ul>
              {NAV.map((item) => (
                <li key={item.key}>
                  <a
                    href={item.href}
                    className={`${styles.navLink} ${current === item.href.slice(1) ? styles.current : ''}`}
                    aria-current={current === item.href.slice(1) ? 'true' : undefined}
                  >
                    {t.nav[item.key]}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <LanguageSwitcher />

          <a href="#contact" className={styles.cta}>
            {t.nav.contact}
          </a>

          <button
            ref={toggleRef}
            type="button"
            className={`${styles.toggle} ${menuOpen ? styles.toggleOpen : ''}`}
            aria-label={menuOpen ? t.common.ariaMenuClose : t.common.ariaMenuToggle}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span />
            <span />
          </button>
        </div>
      </header>

      <div id="mobile-nav" className={`${styles.panel} ${menuOpen ? styles.panelOpen : ''}`}>
        <GirihMark className={styles.panelMark} radius={0.45} weight={0.8} />
        <ul className={styles.panelNav}>
          {NAV.map((item) => (
            <li key={item.key}>
              <a href={item.href} onClick={closeMenu} tabIndex={menuOpen ? 0 : -1}>
                <span className={styles.panelNum}>{item.num}</span>
                {t.nav[item.key]}
              </a>
            </li>
          ))}
          <li>
            <a href="#contact" onClick={closeMenu} tabIndex={menuOpen ? 0 : -1}>
              <span className={styles.panelNum}>06</span>
              {t.nav.contact}
            </a>
          </li>
        </ul>
        <div className={styles.panelFoot}>
          <LanguageSwitcher />
          <a
            href="https://t.me/akm0028"
            target="_blank"
            rel="noreferrer"
            className={styles.panelTelegram}
            tabIndex={menuOpen ? 0 : -1}
          >
            @akm0028 ↗
          </a>
        </div>
      </div>
    </>
  );
}
