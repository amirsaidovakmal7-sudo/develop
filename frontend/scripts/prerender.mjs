/**
 * Snapshots the markup of every page × language into dist-seo/prerender/<lang>/<page>.html.
 * Django puts the snapshot inside <div id="root"> (app/seo.py), so crawlers that do not run
 * JavaScript get the same text, headings and links as visitors; React replaces it with the
 * identical first render on load.
 *
 * The snapshot is the app's *initial* state: IntersectionObserver is stubbed, so nothing is
 * revealed yet and the markup matches what React renders first — no flash when it swaps in.
 *
 * Needs Chrome (CHROME_PATH or the default Windows install); without it the step is skipped
 * and the site still works, only without the crawler snapshot. Runs after `vite build`.
 */
import { createServer } from 'node:http';
import { existsSync, mkdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';
import { LOCALES, PAGE_IDS, pathFor } from '../src/lib/routes.ts';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = resolve(root, 'dist');
const outDir = resolve(root, 'dist-seo/prerender');
const CHROME = process.env.CHROME_PATH || 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe';
const TYPES = {
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.woff2': 'font/woff2',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.mp4': 'video/mp4',
  '.json': 'application/json',
};

if (!existsSync(CHROME)) {
  console.warn(`prerender: Chrome not found at ${CHROME} — set CHROME_PATH. Snapshots not regenerated.`);
  process.exit(0);
}

// Same layout as production: assets under /static/, every other address gets the app shell.
const shell = readFileSync(resolve(dist, 'index.html'));
const server = createServer((req, res) => {
  const url = new URL(req.url, 'http://x');
  if (url.pathname.startsWith('/static/')) {
    const file = join(dist, decodeURIComponent(url.pathname.slice('/static/'.length)));
    if (file.startsWith(dist) && existsSync(file) && statSync(file).isFile()) {
      res.writeHead(200, { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream' });
      res.end(readFileSync(file));
      return;
    }
    res.writeHead(404).end();
    return;
  }
  if (url.pathname === '/order') {
    res.writeHead(404).end();
    return;
  }
  res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
  res.end(shell);
});
await new Promise((ok) => server.listen(0, '127.0.0.1', ok));
const base = `http://127.0.0.1:${server.address().port}`;

const targets = [
  ...LOCALES.flatMap((locale) => PAGE_IDS.map((page) => ({ locale, page, path: pathFor(page, locale) }))),
  ...LOCALES.map((locale) => ({ locale, page: 'notFound', path: `${pathFor('home', locale) === '/' ? '' : pathFor('home', locale)}/__not-found__` })),
];

rmSync(outDir, { recursive: true, force: true });
const browser = await puppeteer.launch({ executablePath: CHROME, headless: true });
try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.evaluateOnNewDocument(() => {
    window.IntersectionObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
      takeRecords() {
        return [];
      }
    };
  });
  for (const { locale, page: id, path } of targets) {
    await page.goto(base + path, { waitUntil: 'networkidle0' });
    await page.waitForSelector('#main');
    // Two frames: effects that set initial inline styles (the home scene) have run.
    await page.evaluate(() => new Promise((ok) => requestAnimationFrame(() => requestAnimationFrame(ok))));
    const html = await page.evaluate(() => document.getElementById('root').innerHTML);
    const h1 = await page.evaluate(() => document.querySelectorAll('h1').length);
    if (h1 !== 1) throw new Error(`${path}: expected exactly one <h1>, found ${h1}`);
    const file = resolve(outDir, locale, `${id}.html`);
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, html);
  }
  console.log(`prerender → ${outDir} (${targets.length} snapshots)`);
} finally {
  await browser.close();
  server.close();
}
