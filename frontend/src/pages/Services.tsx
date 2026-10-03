import { useId, useState } from 'react';
import { useTranslation } from '../i18n';
import { useRequestHref } from '../lib/router';
import { PageHero } from '../components/PageHero/PageHero';
import { Button } from '../components/ui/Button';
import s from './pages.module.css';
import a from './Services.module.css';

export function Services() {
  const { t } = useTranslation();
  const sv = t.services;
  const requestHref = useRequestHref();
  const [open, setOpen] = useState<number | null>(0);
  const id = useId();

  return (
    <>
      <PageHero label={sv.label} title={sv.title} intro={sv.intro} matter="lattice">
        <p className={s.note}>{sv.priceNote}</p>
      </PageHero>

      <section className={a.listSection}>
        <div className="container">
          <ul className={a.list}>
            {sv.items.map((item, i) => {
              const isOpen = open === i;
              const panelId = `${id}-${i}`;
              return (
                <li key={item.title} className={`${a.item} ${isOpen ? a.open : ''}`}>
                  <h2 className={a.h}>
                    <button
                      type="button"
                      className={a.row}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setOpen(isOpen ? null : i)}
                    >
                      <span className={a.num}>({String(i + 1).padStart(2, '0')})</span>
                      <span className={a.title}>{item.title}</span>
                      <span className={a.icon} aria-hidden="true" />
                    </button>
                  </h2>
                  <div id={panelId} className={a.panel} role="region" aria-label={item.title} inert={!isOpen}>
                    <div className={a.panelInner}>
                      <p className={a.short}>{item.short}</p>
                      <div>
                        <h3 className={a.kicker}>{sv.includesLabel}</h3>
                        <ul className={a.includes}>
                          {item.includes.map((inc) => (
                            <li key={inc}>{inc}</li>
                          ))}
                        </ul>
                        <Button to={requestHref} className={a.discuss}>
                          {sv.discuss}
                        </Button>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

    </>
  );
}
