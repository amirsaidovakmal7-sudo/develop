import { useTranslation } from '../i18n';
import { PATHS, useRequestHref } from '../lib/router';
import { PageHero } from '../components/PageHero/PageHero';
import { Process } from '../components/Process/Process';
import { Button } from '../components/ui/Button';
import { Heading } from '../components/ui/Heading';
import { Label } from '../components/ui/Label';
import { Reveal } from '../components/ui/Reveal';
import { WhyGrid } from './WhyGrid';
import s from './pages.module.css';

export function About() {
  const { t } = useTranslation();
  const a = t.about;
  const requestHref = useRequestHref();

  return (
    <>
      <PageHero label={a.label} title={a.title} intro={a.lead} matter="monogram">
        <p className={s.mission}>{a.mission}</p>
      </PageHero>

      <section className="section" aria-labelledby="about-why">
        <div className="container">
          <Reveal className={s.head}>
            <Label num="01">{a.whyLabel}</Label>
            <div id="about-why">
              <Heading a={a.whyTitleA} b={a.whyTitleB} className={s.h2} />
            </div>
          </Reveal>
          <WhyGrid items={a.why} />
        </div>
      </section>

      <Process num="02" />

      <section className="section">
        <div className="container">
          <Reveal className={s.band}>
            <div>
              <Heading a={a.ctaTitleA} b={a.ctaTitleB} className={s.h2} />
              <p>{a.ctaText}</p>
            </div>
            <div className={s.bandActions}>
              <Button to={requestHref}>{t.nav.cta}</Button>
              <Button to={PATHS.services} variant="ghost" arrow={null}>
                {t.nav.services}
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
