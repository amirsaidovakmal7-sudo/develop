import { useCallback, useState } from 'react';
import { useTranslation } from '../i18n';
import { projects, serviceProjectIds } from '../data/projects';
import { useRequestHref, useRouter } from '../lib/router';
import type { ServicePageId } from '../lib/routes';
import type { MatterVariant } from '../scene/MatterCanvas';
import { PageHero } from '../components/PageHero/PageHero';
import { Showcase } from '../components/Showcase/Showcase';
import { CaseView } from '../components/CaseView/CaseView';
import { RequestForm } from '../components/RequestForm/RequestForm';
import { Button } from '../components/ui/Button';
import { Label } from '../components/ui/Label';
import { Reveal } from '../components/ui/Reveal';
import { WhyGrid } from './WhyGrid';
import s from './pages.module.css';
import a from './Services.module.css';
import x from './ServicePage.module.css';

/** Each service keeps the particle form it has in the home scene. */
const MATTER: Record<ServicePageId, MatterVariant> = {
  websites: 'website',
  telegramBots: 'plane',
  miniApp: 'phone',
  crm: 'funnel',
};

/** One page per core service: what it is, formats, scope, tasks, cases, price and steps, then the form. */
export function ServicePage({ id }: { id: ServicePageId }) {
  const { t } = useTranslation();
  const { href } = useRouter();
  const requestHref = useRequestHref();
  const sp = t.servicePages[id];
  const l = t.servicePage;
  const list = serviceProjectIds[id].map((pid) => projects.find((p) => p.id === pid)!);
  const [open, setOpen] = useState<number | null>(null);
  const step = useCallback((d: number) => setOpen((i) => (i === null ? i : (i + d + list.length) % list.length)), [list.length]);
  const close = useCallback(() => setOpen(null), []);

  return (
    <>
      <PageHero label={sp.label} title={sp.title} titleSub={sp.titleSub} intro={sp.intro} matter={MATTER[id]}>
        <Button to={requestHref}>{l.discuss}</Button>
      </PageHero>

      <section className="section" aria-labelledby={`${id}-what`}>
        <div className={`container ${x.split}`}>
          <Reveal className={s.head}>
            <Label num="01">{l.aboutLabel}</Label>
            <h2 id={`${id}-what`} className={s.h2}>
              {sp.whatIsTitle}
            </h2>
          </Reveal>
          <Reveal>
            <p className={x.lead}>{sp.whatIs}</p>
          </Reveal>
        </div>
      </section>

      <section className="section" aria-labelledby={`${id}-kinds`}>
        <div className="container">
          <Reveal className={s.head}>
            <Label num="02">{l.kindsLabel}</Label>
            <h2 id={`${id}-kinds`} className={s.h2}>
              {sp.kindsTitle}
            </h2>
          </Reveal>
          <WhyGrid items={sp.kinds} icons={null} />
        </div>
      </section>

      <section className="section" aria-labelledby={`${id}-includes`}>
        <div className={`container ${x.split}`}>
          <Reveal className={s.head}>
            <Label num="03">{l.includesLabel}</Label>
            <h2 id={`${id}-includes`} className={s.h2}>
              {sp.includesTitle}
            </h2>
          </Reveal>
          <Reveal>
            <ul className={`${a.includes} ${x.includes}`}>
              {sp.includes.map((inc) => (
                <li key={inc}>{inc}</li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="section" aria-labelledby={`${id}-tasks`}>
        <div className="container">
          <Reveal className={s.head}>
            <Label num="04">{l.tasksLabel}</Label>
            <h2 id={`${id}-tasks`} className={s.h2}>
              {sp.tasksTitle}
            </h2>
          </Reveal>
          <WhyGrid items={sp.tasks} icons={null} cols={3} />
        </div>
      </section>

      <section className="section" aria-labelledby={`${id}-examples`}>
        <div className="container">
          <div className={s.headRow}>
            <Reveal className={s.head}>
              <Label num="05">{l.examplesLabel}</Label>
              <h2 id={`${id}-examples`} className={s.h2}>
                {sp.examplesTitle}
              </h2>
            </Reveal>
            <Button to={href('projects')} variant="ghost">
              {l.allProjects}
            </Button>
          </div>
          <Showcase list={list} onOpen={setOpen} />
        </div>
      </section>

      <section className="section" aria-label={l.costLabel}>
        <div className={`container ${x.duo}`}>
          <Reveal className={x.card}>
            <Label num="06">{l.costLabel}</Label>
            <h2 className={x.cardTitle}>{sp.costTitle}</h2>
            <p>{sp.costText}</p>
            <p className={s.note}>{t.services.priceNote}</p>
          </Reveal>
          <Reveal className={x.card}>
            <Label num="07">{t.process.label}</Label>
            <h2 className={x.cardTitle}>{sp.processTitle}</h2>
            <p>{sp.processText}</p>
            <Button to={`${href('about')}#process`} variant="ghost">
              {l.processLink}
            </Button>
          </Reveal>
        </div>
      </section>

      <RequestForm num="08" />
      <CaseView list={list} index={open} onClose={close} onStep={step} />
    </>
  );
}
