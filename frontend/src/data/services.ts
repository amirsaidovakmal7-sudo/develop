export type ServiceId = 'websites' | 'webapps' | 'bots' | 'backend' | 'automation';

export interface ServiceDefinition {
  id: ServiceId;
  num: string;
  /** Prefix into the `services` i18n namespace: `services.<i18nKey>Title` etc. */
  i18nKey: string;
}

/** WHAT I BUILD list (TECH_TASK_REDISIGN.md п.15) — one shared visual stage, five states. */
export const services: ServiceDefinition[] = [
  { id: 'websites', num: '01', i18nKey: 'websites' },
  { id: 'webapps', num: '02', i18nKey: 'webapps' },
  { id: 'bots', num: '03', i18nKey: 'bots' },
  { id: 'backend', num: '04', i18nKey: 'backend' },
  { id: 'automation', num: '05', i18nKey: 'automation' },
];
