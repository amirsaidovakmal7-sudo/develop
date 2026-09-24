#!/usr/bin/env node
/**
 * Captures a still frame from each remote project video into
 * src/assets/posters/<project>.webp.
 *
 * Two projects (Sonata Bot, Akkord) exist only as screen recordings, hosted
 * on the Uploadcare CDN the original site already used. Those files are
 * 38-180 MB, so using the video itself as the thumbnail in the work index
 * would start a multi-megabyte download per card on a phone. A real frame
 * from the real recording gives the index something honest to show, and the
 * video then loads only when someone opens the case and presses play.
 *
 * There is no ffmpeg in this environment, so the frame is captured by
 * seeking the video in Chrome and screenshotting the element — which also
 * sidesteps canvas tainting, since the CDN sends no CORS header.
 *
 * Usage: node scripts/gen-video-posters.mjs
 * Requires: a Chrome with --remote-debugging-port=9333, or CHROME_PATH set.
 */
import { mkdirSync, writeFileSync, unlinkSync } from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer-core';
import sharp from 'sharp';

const ROOT = path.resolve(import.meta.dirname, '..');
const OUT_DIR = path.join(ROOT, 'src', 'assets', 'posters');

/**
 * Which frame reads best as a thumbnail, and what to trim off it. Both
 * recordings are full-desktop captures, so the Windows taskbar is cropped
 * from each; the Telegram recording also has the owner's personal chat list
 * down the left edge, which has no business being a portfolio thumbnail.
 */
const SOURCES = {
  'sonata-bot': {
    url: 'https://3bbjtzlrh2.ucarecd.net/a7915aa1-48d0-427e-bfa8-068f975bb971/',
    at: 2.5,
    crop: { left: 70, top: 0, rightInset: 0, bottomInset: 32 },
  },
  akkord: {
    url: 'https://3bbjtzlrh2.ucarecd.net/59ba266d-d4a5-4c79-a9da-41b7f902b802/',
    at: 3,
    crop: { left: 0, top: 0, rightInset: 0, bottomInset: 32 },
  },
};

mkdirSync(OUT_DIR, { recursive: true });

const browser = await puppeteer.connect({
  browserURL: process.env.BROWSER_URL || 'http://127.0.0.1:9333',
  defaultViewport: null,
});

for (const [id, { url, at, crop }] of Object.entries(SOURCES)) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 1280, deviceScaleFactor: 1 });
  await page.setContent(
    `<style>html,body{margin:0;background:#05070c}video{display:block}</style><video id="v" src="${url}" muted playsinline preload="auto"></video>`,
    { waitUntil: 'domcontentloaded' },
  );

  const size = await page.evaluate(
    (seekTo) =>
      new Promise((resolve, reject) => {
        const v = document.getElementById('v');
        const fail = setTimeout(() => reject(new Error('timed out waiting for frame')), 120000);
        v.addEventListener('loadedmetadata', () => {
          v.width = v.videoWidth;
          v.height = v.videoHeight;
          v.currentTime = Math.min(seekTo, Math.max(0, v.duration - 0.1));
        });
        v.addEventListener('seeked', () => {
          clearTimeout(fail);
          // One more paint so the seeked frame is definitely composited.
          requestAnimationFrame(() => requestAnimationFrame(() => resolve({ w: v.videoWidth, h: v.videoHeight })));
        });
        v.addEventListener('error', () => reject(new Error('video failed to load')));
      }),
    at,
  );

  await page.setViewport({ width: size.w, height: size.h, deviceScaleFactor: 1 });
  const png = await page.$eval('#v', () => null).then(() => page.screenshot({ type: 'png' }));

  const tmp = path.join(OUT_DIR, `${id}.tmp.png`);
  writeFileSync(tmp, png);
  await sharp(tmp)
    .extract({
      left: crop.left,
      top: crop.top,
      width: size.w - crop.left - crop.rightInset,
      height: size.h - crop.top - crop.bottomInset,
    })
    .resize({ width: 1600, height: 900, fit: 'cover', position: 'top' })
    .webp({ quality: 80 })
    .toFile(path.join(OUT_DIR, `${id}.webp`));
  unlinkSync(tmp);

  console.log(`${id}: captured ${size.w}x${size.h} at ${at}s`);
  await page.close();
}

await browser.disconnect();
