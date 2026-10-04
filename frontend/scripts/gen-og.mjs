/**
 * Link previews and app icons, written to public/ (copied into dist/ by `vite build`, committed):
 *   public/og/og-{ru,uz,en}.png   1200×630 preview per language (Telegram, WhatsApp, Facebook, search)
 *   public/apple-touch-icon.png   180×180
 *   public/icon-192.png, icon-512.png + public/site.webmanifest
 *   public/favicon.ico            16/32/48, PNG-in-ICO
 *
 * Headlines come from `seo.ogHeadline` / `seo.ogSub` in the i18n dictionaries.
 * Needs Chrome (CHROME_PATH or the default Windows install) for the text; re-run when those texts change:
 *   npm run gen-og
 */
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import puppeteer from 'puppeteer-core';
import sharp from 'sharp';
import { ru } from '../src/i18n/ru.ts';
import { uz } from '../src/i18n/uz.ts';
import { en } from '../src/i18n/en.ts';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const pub = resolve(root, 'public');
const fonts = resolve(root, 'src/assets/fonts');
const CHROME = process.env.CHROME_PATH || 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe';
const dictionaries = { ru, uz, en };

const font = (family, file, range) =>
  `@font-face{font-family:'${family}';font-weight:400 700;src:url('${pathToFileURL(resolve(fonts, file)).href}') format('woff2');unicode-range:${range}}`;
const LATIN = 'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD';
const LATIN_EXT = 'U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+1E00-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF';
const CYR = 'U+0301,U+0400-045F,U+0490-0491,U+04B0-04B1,U+2116';
const FONT_CSS = [
  font('Inter Tight', 'inter-tight-latin.woff2', LATIN),
  font('Inter Tight', 'inter-tight-latin-ext.woff2', LATIN_EXT),
  font('Inter Tight', 'inter-tight-cyrillic.woff2', CYR),
  font('JetBrains Mono', 'jetbrains-mono-latin.woff2', LATIN),
  font('JetBrains Mono', 'jetbrains-mono-latin-ext.woff2', LATIN_EXT),
  font('JetBrains Mono', 'jetbrains-mono-cyrillic.woff2', CYR),
].join('');

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

/** Same visual language as the site: near-black, saffron accent, a sphere of particles on the right. */
function card(t) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>${FONT_CSS}
  *{margin:0;box-sizing:border-box}
  html,body{width:1200px;height:630px;background:#050506;overflow:hidden}
  body{position:relative;font-family:'Inter Tight',sans-serif;color:#f4f2ee}
  .glow{position:absolute;right:-120px;top:-60px;width:760px;height:760px;border-radius:50%;
    background:radial-gradient(closest-side,rgba(255,184,41,.22),rgba(255,184,41,.06) 55%,transparent 72%)}
  canvas{position:absolute;right:30px;top:65px}
  .text{position:absolute;left:72px;top:64px;bottom:64px;width:640px;display:flex;flex-direction:column}
  .logo{font-weight:600;font-size:34px;letter-spacing:-.03em}
  .logo span{color:#ffb829}
  h1{margin-top:auto;font-weight:500;font-size:64px;line-height:1.02;letter-spacing:-.04em}
  .sub{margin-top:28px;font:500 22px/1.3 'JetBrains Mono',monospace;letter-spacing:.02em;color:#a6a3ab}
  .sub b{color:#ffb829;font-weight:500}
  </style></head><body>
  <div class="glow"></div><canvas id="c" width="500" height="500"></canvas>
  <div class="text"><div class="logo">akmal<span>.dev</span></div>
  <h1>${esc(t.seo.ogHeadline)}</h1><p class="sub"><b>[</b> ${esc(t.seo.ogSub)} <b>]</b></p></div>
  <script>
  const c=document.getElementById('c'),x=c.getContext('2d');let s=7;const r=()=>(s=(s*16807)%2147483647)/2147483647;
  const pts=[];for(let i=0;i<5200;i++){const u=r()*2-1,a=r()*Math.PI*2,q=Math.sqrt(1-u*u),k=.92+r()*.12;
    let px=q*Math.cos(a)*k,py=u*k,pz=q*Math.sin(a)*k;const ry=.5,rx=.35;
    [px,pz]=[px*Math.cos(ry)-pz*Math.sin(ry),px*Math.sin(ry)+pz*Math.cos(ry)];[py,pz]=[py*Math.cos(rx)-pz*Math.sin(rx),py*Math.sin(rx)+pz*Math.cos(rx)];
    pts.push([px,py,pz]);}
  pts.sort((a,b)=>a[2]-b[2]);
  for(const[px,py,pz]of pts){const d=(pz+1)/2;x.fillStyle='rgba(255,'+Math.round(170+d*40)+','+Math.round(41+d*90)+','+(.18+d*.7).toFixed(2)+')';
    x.beginPath();x.arc(250+px*215,250+py*215,.6+d*1.5,0,6.283);x.fill();}
  </script></body></html>`;
}

function ico(pngs) {
  // ICONDIR + one ICONDIRENTRY per image, images stored as PNG (supported by every current browser).
  const header = Buffer.alloc(6 + 16 * pngs.length);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(pngs.length, 4);
  let offset = header.length;
  pngs.forEach(({ size, data }, i) => {
    const o = 6 + 16 * i;
    header.writeUInt8(size >= 256 ? 0 : size, o);
    header.writeUInt8(size >= 256 ? 0 : size, o + 1);
    header.writeUInt16LE(1, o + 4);
    header.writeUInt16LE(32, o + 6);
    header.writeUInt32LE(data.length, o + 8);
    header.writeUInt32LE(offset, o + 12);
    offset += data.length;
  });
  return Buffer.concat([header, ...pngs.map((p) => p.data)]);
}

async function icons() {
  const svg = readFileSync(resolve(pub, 'favicon.svg'));
  // Full-bleed square on the favicon's own background: iOS and Android apply their own rounded mask.
  const square = async (size) =>
    sharp({ create: { width: size, height: size, channels: 4, background: '#05070a' } })
      .composite([{ input: await sharp(svg, { density: 72 * (size / 32) * 1.2 }).resize(Math.round(size * 0.86)).png().toBuffer(), gravity: 'center' }])
      .png({ compressionLevel: 9 })
      .toBuffer();
  writeFileSync(resolve(pub, 'apple-touch-icon.png'), await square(180));
  writeFileSync(resolve(pub, 'icon-192.png'), await square(192));
  writeFileSync(resolve(pub, 'icon-512.png'), await square(512));
  const sizes = [16, 32, 48];
  const pngs = await Promise.all(sizes.map(async (size) => ({ size, data: await sharp(svg, { density: 72 * (size / 32) * 2 }).resize(size).png().toBuffer() })));
  writeFileSync(resolve(pub, 'favicon.ico'), ico(pngs));
  const manifest = {
    name: 'akmal.dev',
    short_name: 'akmal.dev',
    description: ru.seo.orgDescription,
    lang: 'ru',
    start_url: '/',
    display: 'browser',
    background_color: '#050506',
    theme_color: '#050506',
    icons: [
      { src: '/static/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/static/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  };
  writeFileSync(resolve(pub, 'site.webmanifest'), JSON.stringify(manifest, null, 2) + '\n');
  console.log('icons → public/apple-touch-icon.png, icon-192.png, icon-512.png, favicon.ico, site.webmanifest');
}

async function previews() {
  if (!existsSync(CHROME)) {
    console.warn(`gen-og: Chrome not found at ${CHROME} — set CHROME_PATH. Previews not regenerated.`);
    return;
  }
  mkdirSync(resolve(pub, 'og'), { recursive: true });
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--allow-file-access-from-files'] });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
    for (const [locale, t] of Object.entries(dictionaries)) {
      const tmp = resolve(root, `node_modules/.tmp/og-${locale}.html`);
      mkdirSync(dirname(tmp), { recursive: true });
      writeFileSync(tmp, card(t));
      await page.goto(pathToFileURL(tmp).href, { waitUntil: 'load' });
      await page.evaluate(() => document.fonts.ready);
      const shot = await page.screenshot({ type: 'png' });
      const out = resolve(pub, `og/og-${locale}.png`);
      await sharp(shot).png({ compressionLevel: 9, palette: true, quality: 92, dither: 0.6 }).toFile(out);
      console.log(`og → public/og/og-${locale}.png (${Math.round(statSync(out).size / 1024)} KB)`);
    }
  } finally {
    await browser.close();
  }
}

await icons();
await previews();
