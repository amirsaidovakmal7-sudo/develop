/**
 * Автоматический аудит переводов (TECH_TASK_REDISIGN.md п.43/77).
 * Сравнивает набор ключей RU/EN/UZ словарей и падает с ненулевым кодом,
 * если ключи расходятся или значение пустое/не-строка.
 *
 * Запуск: node scripts/check-i18n.ts  (или npm run check-i18n)
 * Требует нативную поддержку TypeScript в Node >= 22.6 (--experimental-strip-types
 * не нужен начиная с Node 23.6 / 24.x — тип-аннотации стрипаются самим Node).
 */
import { ru } from '../src/i18n/ru.ts';
import { en } from '../src/i18n/en.ts';
import { uz } from '../src/i18n/uz.ts';

type Dict = Record<string, unknown>;

function flatten(obj: Dict, prefix = ''): Map<string, unknown> {
  const out = new Map<string, unknown>();
  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      for (const [k, v] of flatten(value as Dict, path)) out.set(k, v);
    } else {
      out.set(path, value);
    }
  }
  return out;
}

const dicts: Record<string, Map<string, unknown>> = {
  ru: flatten(ru),
  en: flatten(en),
  uz: flatten(uz),
};

const allKeys = new Set<string>();
for (const map of Object.values(dicts)) for (const key of map.keys()) allKeys.add(key);

let missing = 0;
let invalid = 0;
const report: string[] = [];

for (const key of Array.from(allKeys).sort()) {
  const presentIn = Object.entries(dicts).filter(([, map]) => map.has(key));
  if (presentIn.length !== Object.keys(dicts).length) {
    const missingIn = Object.keys(dicts).filter((lang) => !dicts[lang].has(key));
    report.push(`MISSING  ${key}  (missing in: ${missingIn.join(', ')})`);
    missing += missingIn.length;
  }
  for (const [lang, map] of Object.entries(dicts)) {
    const value = map.get(key);
    if (map.has(key) && (typeof value !== 'string' || value.trim() === '')) {
      report.push(`INVALID  ${key}  (${lang} is empty/non-string: ${JSON.stringify(value)})`);
      invalid += 1;
    }
  }
}

if (report.length > 0) {
  console.error('i18n audit found problems:\n' + report.join('\n'));
  console.error(`\nmissing translation keys = ${missing}`);
  console.error(`undefined/empty translations = ${invalid}`);
  process.exit(1);
}

console.log(`i18n audit OK — ${allKeys.size} keys, RU/EN/UZ fully in sync.`);
console.log('missing translation keys = 0');
console.log('undefined translations = 0');
