import { useTranslation } from '../../i18n';
import { contactOrder, contacts } from '../../data/contacts';
import { Link, useRequestHref, useRouter } from '../../lib/router';
import { SERVICE_PAGES } from '../../lib/routes';
import { NAV, Logo } from '../Header/Header';
import { LanguageSwitcher } from '../Header/LanguageSwitcher';
import { Button } from '../ui/Button';
import styles from './Footer.module.css';

export function Footer() {
  const { t } = useTranslation();
  const { href } = useRouter();
  const requestHref = useRequestHref();
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.top}>
          <p className={styles.big}>
            {t.footer.titleA} <span className="accent">{t.footer.titleB}</span>
          </p>
          <Button to={requestHref}>{t.footer.cta}</Button>
        </div>

        <div className={styles.cols}>
          <div className={styles.brand}>
            <Logo />
            <p>{t.footer.city}</p>
          </div>
          <nav aria-label={t.footer.navTitle}>
            <h2 className={styles.colTitle}>{t.footer.navTitle}</h2>
            <ul>
              {NAV.map((id) => (
                <li key={id}>
                  <Link to={href(id)}>{t.nav[id]}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label={t.footer.servicesTitle}>
            <h2 className={styles.colTitle}>{t.footer.servicesTitle}</h2>
            <ul>
              {SERVICE_PAGES.map((id) => (
                <li key={id}>
                  <Link to={href(id)}>{t.servicePages[id].name}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <h2 className={styles.colTitle}>{t.footer.contactsTitle}</h2>
            <ul>
              {contactOrder.map((key) => (
                <li key={key}>
                  <a href={contacts[key].href} target={key === 'phone' || key === 'email' ? undefined : '_blank'} rel="noopener noreferrer">
                    <span className={styles.kind}>{t.contacts[key]}</span>
                    {contacts[key].label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className={styles.colTitle}>{t.footer.languageTitle}</h2>
            <LanguageSwitcher className={styles.langs} />
          </div>
        </div>

        <div className={styles.bottom}>
          <span>© {new Date().getFullYear()} akmal.dev</span>
          <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            {t.common.toTop} ↑
          </button>
        </div>
      </div>
    </footer>
  );
}
