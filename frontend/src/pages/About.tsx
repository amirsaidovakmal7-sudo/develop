import { useTranslation } from '../i18n';
import { PageHero } from '../components/PageHero/PageHero';
import { Process } from '../components/Process/Process';
import { Heading } from '../components/ui/Heading';
import { Label } from '../components/ui/Label';
import { Reveal } from '../components/ui/Reveal';
import { WhyGrid } from './WhyGrid';
import s from './pages.module.css';

export function About() {
  const { t } = useTranslation();
  const a = t.about;

  return (
    <>
      <PageHero label={a.label} title={a.title} titleSub={a.titleSub} intro={a.lead} matter="monogram">
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

      <Process num="02" titleA={a.processTitleA} titleB={a.processTitleB} />
    </>
  );
}
