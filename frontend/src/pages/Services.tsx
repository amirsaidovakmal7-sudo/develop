import { useId, useState } from 'react';
import { useTranslation } from '../i18n';
import { useRequestHref, useRouter } from '../lib/router';
import { HUB_ITEM_PAGES } from '../lib/routes';
import { PageHero } from '../components/PageHero/PageHero';
import { Button } from '../components/ui/Button';
import s from './pages.module.css';
import a from './Services.module.css';

export function Services() {
  const { t } = useTranslation();
  const sv = t.services;
  const { href } = useRouter();
  const requestHref = useRequestHref();
  const [open, setOpen] = useState<number | null>(0);
  const id = useId();

  return (
    <>
      <PageHero label={sv.label} title={sv.title} titleSub={sv.titleSub} intro={sv.intro} matter="lattice">
        <p className={s.note}>{sv.priceNote}</p>
      </PageHero>

      <section className={a.listSection}>
        <div className="container">
          <ul className={a.list}>
            {sv.items.map((item, i) => {
              const isOpen = open === i;
              const panelId = `${id}-${i}`;
              const detail = HUB_ITEM_PAGES[i];
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
                      <span className={a.num} data-num={`(${String(i + 1).padStart(2, '0')})`} aria-hidden="true" />
                      <span className={a.title}>{item.title}</span>
                      <span className={a.icon} aria-hidden="true" />
                    </button>
                  </h2>
                  <div id={panelId} className={a.panel} role="region" aria-label={item.title} inert={!isOpen}>
                    <div className={a.panelInner}>
                      <p className={a.short}>{item.short}</p>
                      <div>
                        <p className={a.kicker}>{sv.includesLabel}</p>
                        <ul className={a.includes}>
                          {item.includes.map((inc) => (
                            <li key={inc}>{inc}</li>
                          ))}
                        </ul>
                        <div className={a.actions}>
                          <Button to={requestHref}>{sv.discuss}</Button>
                          {detail ? (
                            <Button to={href(detail)} variant="ghost" arrow={null}>
                              {t.common.more}
                              <span className="visually-hidden">: {t.servicePages[detail].name}</span>
                            </Button>
                          ) : null}
                        </div>
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
