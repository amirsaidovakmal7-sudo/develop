import { useCallback, useState } from 'react';
import { useTranslation } from '../i18n';
import { featuredProjectIds, projects } from '../data/projects';
import { useRouter } from '../lib/router';
import { HomeStory } from '../scene/HomeStory';
import { Showcase } from '../components/Showcase/Showcase';
import { CaseView } from '../components/CaseView/CaseView';
import { Process } from '../components/Process/Process';
import { RequestForm } from '../components/RequestForm/RequestForm';
import { Button } from '../components/ui/Button';
import { Heading } from '../components/ui/Heading';
import { Label } from '../components/ui/Label';
import { Reveal } from '../components/ui/Reveal';
import s from './pages.module.css';

const featured = featuredProjectIds.map((id) => projects.find((p) => p.id === id)!);

export function Home() {
  const { t } = useTranslation();
  const { href } = useRouter();
  const [open, setOpen] = useState<number | null>(null);
  const step = useCallback((d: number) => setOpen((i) => (i === null ? i : (i + d + featured.length) % featured.length)), []);
  const close = useCallback(() => setOpen(null), []);

  return (
    <>
      <HomeStory />

      <section className="section" aria-labelledby="home-projects">
        <div className="container">
          <div className={s.headRow}>
            <Reveal className={s.head}>
              <Label num="02">{t.homeProjects.label}</Label>
              <div id="home-projects">
                <Heading a={t.homeProjects.titleA} b={t.homeProjects.titleB} className={s.h2} />
              </div>
              <p className={s.intro}>{t.homeProjects.intro}</p>
            </Reveal>
            <Button to={href('projects')} variant="ghost">
              {t.homeProjects.cta}
            </Button>
          </div>
          <Showcase list={featured} onOpen={setOpen} />
        </div>
      </section>

      <Process num="03" />
      <RequestForm num="04" />
      <CaseView list={featured} index={open} onClose={close} onStep={step} />
    </>
  );
}
