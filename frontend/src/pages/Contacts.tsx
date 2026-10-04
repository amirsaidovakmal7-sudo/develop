import { useTranslation } from '../i18n';
import { contactOrder, contacts } from '../data/contacts';
import { PageHero } from '../components/PageHero/PageHero';
import { RequestForm } from '../components/RequestForm/RequestForm';
import { Reveal } from '../components/ui/Reveal';
import s from './pages.module.css';

export function Contacts() {
  const { t } = useTranslation();
  const c = t.contacts;
  return (
    <>
      <PageHero label={c.label} title={c.title} titleSub={c.titleSub} intro={c.intro}>
        <p className={s.heroText}>{c.text}</p>
      </PageHero>
      <section className="container" aria-label={c.title}>
        <Reveal className={s.contactGrid}>
          {contactOrder.map((key) => (
            <a
              key={key}
              className={s.contactCard}
              href={contacts[key].href}
              target={key === 'phone' || key === 'email' ? undefined : '_blank'}
              rel="noopener noreferrer"
            >
              <span className={s.contactKind}>
                {c[key]}
                <span aria-hidden="true">↗</span>
              </span>
              <span className={s.contactValue}>{contacts[key].label}</span>
            </a>
          ))}
        </Reveal>
      </section>
      <RequestForm />
    </>
  );
}
