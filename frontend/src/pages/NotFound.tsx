import { useTranslation } from '../i18n';
import { useRouter } from '../lib/router';
import { Button } from '../components/ui/Button';
import { Reveal } from '../components/ui/Reveal';
import s from './pages.module.css';

export function NotFound() {
  const { t } = useTranslation();
  const n = t.notFound;
  const { href } = useRouter();
  return (
    <section className={s.notFound}>
      <Reveal className={`container ${s.head}`}>
        <p className={s.code} aria-hidden="true">
          {n.code}
        </p>
        <h1 className={s.h2}>{n.title}</h1>
        <p className={s.intro}>{n.text}</p>
        <div className={s.ctaRow}>
          <Button to={href('home')}>{n.home}</Button>
          <Button to={href('services')} variant="ghost" arrow={null}>
            {n.services}
          </Button>
        </div>
      </Reveal>
    </section>
  );
}
