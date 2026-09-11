#!/usr/bin/env node
/**
 * Downloads every external screenshot/video currently referenced by the old
 * Django template (ucarecdn.com, pub-...r2.dev — see app/templates/index.html
 * before the redesign) plus the images already committed under
 * app/static/media/, normalises them per project, and converts stills to
 * WebP with sharp. Output lands in src/assets/projects/<project-id>/, which
 * Project.tsx picks up at build time via `import.meta.glob`.
 *
 * TECH_TASK_REDISIGN.md п.50: "скачать, оптимизировать, перевести в
 * WebP/AVIF, сохранить локально" — this script is that step, run once
 * (idempotent: re-running skips files that already exist locally).
 *
 * Usage: npm run fetch-media
 */
import { mkdir, readdir, copyFile, writeFile, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(import.meta.dirname, '..');
const RAW_DIR = path.join(ROOT, 'raw-media');
const OUT_DIR = path.join(ROOT, 'src', 'assets', 'projects');
const LOCAL_MEDIA_DIR = path.resolve(ROOT, '..', 'app', 'static', 'media');
const WEBP_QUALITY = 82;
const MAX_WIDTH = 1600;

/** @type {Record<string, {remote?: string[]; local?: string[]}>} */
const PROJECT_ASSETS = {
  cashflow: { local: ['cash1.png', 'cash2.png', 'cash3.png', 'cash4.png'] },
  'sonata-school': {
    remote: [
      'https://3bbjtzlrh2.ucarecd.net/b7fc08cb-6a54-4751-88ac-2cf6d8ec2265/-/preview/1000x562/',
      'https://3bbjtzlrh2.ucarecd.net/659cac68-cc6b-406e-a8f4-281a354bba75/-/preview/1000x562/',
      'https://3bbjtzlrh2.ucarecd.net/97a80232-caf1-4e68-858e-c38a364733a7/-/preview/1000x562/',
      'https://3bbjtzlrh2.ucarecd.net/c79022aa-a48c-4d9a-9a68-c25624600683/-/preview/1000x562/',
    ],
  },
  flexcamp: { local: ['flex1.png', 'flex2.png', 'flex3.png'] },
  aysdrums: { local: ['a1.png', 'a2.png', 'a3.png', 'a4.png', 'a5.png', 'a6.png', 'a7.png'] },
  // sonata-bot has no local/downloaded stills or video — see src/data/videos.ts
  // (the originals are 40-180MB each; too large to vendor into the repo without
  // a video transcoder, which this environment does not have — kept as external
  // CDN links instead, per the trade-off documented there).
  'learning-center': {
    remote: [
      'https://3bbjtzlrh2.ucarecd.net/1c26a283-b20a-420d-bb38-37778c27f505/-/preview/1000x562/',
      'https://3bbjtzlrh2.ucarecd.net/41712e34-a3cf-4aef-9507-88d6ad5537aa/-/preview/1000x562/',
      'https://3bbjtzlrh2.ucarecd.net/cd862417-b9f4-44c7-bd7e-c58522e0c80a/-/preview/1000x562/',
      'https://3bbjtzlrh2.ucarecd.net/5905014a-a6cd-4d35-867a-430076647c99/-/preview/1000x562/',
      'https://3bbjtzlrh2.ucarecd.net/7e3efdf7-06be-4255-b6f5-61178a2e3511/-/preview/1000x562/',
    ],
  },
  'tech-project': {
    remote: [
      'https://3bbjtzlrh2.ucarecd.net/921a46f6-d70f-42a7-a665-1045a63bce79/-/preview/1000x562/',
      'https://3bbjtzlrh2.ucarecd.net/5357da26-a85e-4ebf-ac9a-1b0b2d8e595d/-/preview/1000x562/',
      'https://3bbjtzlrh2.ucarecd.net/4b612eca-bfe3-4226-9da4-f1bf847c778a/-/preview/1000x562/',
      'https://3bbjtzlrh2.ucarecd.net/7411ba0f-b650-498a-b48d-f4cf52d6a065/-/preview/1000x562/',
    ],
  },
  'online-shop': {
    remote: [
      'https://3bbjtzlrh2.ucarecd.net/dd9ac458-b2c0-4eb6-ae33-dbd14824f54f/-/preview/1000x562/',
      'https://3bbjtzlrh2.ucarecd.net/24b047d5-fcb4-4d37-9caa-ce8a2ba96665/-/preview/1000x562/',
    ],
  },
  'fastfood-bot': {
    remote: [
      'https://3bbjtzlrh2.ucarecd.net/442ac452-d338-404b-b906-7c4a37b1412c/-/preview/1000x562/',
      'https://3bbjtzlrh2.ucarecd.net/7e3b2d69-3851-4103-bdb7-fb828da44c23/-/preview/1000x562/',
      'https://3bbjtzlrh2.ucarecd.net/6f600cc3-3db1-4110-844a-98f944e30157/-/preview/1000x562/',
    ],
  },
  messenger: {
    remote: [
      'https://3bbjtzlrh2.ucarecd.net/2a4637ba-f01c-4b25-83be-72091a6a110b/-/preview/1000x562/',
      'https://3bbjtzlrh2.ucarecd.net/93fbc79a-62d1-4ec9-bc29-82a9fa37c00d/-/preview/1000x562/',
      'https://3bbjtzlrh2.ucarecd.net/5ef662dc-8aae-4d8d-b2e4-1ae462cc0ecc/-/preview/1000x562/',
    ],
  },
  'news-portal': {
    remote: [
      'https://3bbjtzlrh2.ucarecd.net/c891987e-8c89-4470-a501-c89884250e6b/-/preview/1000x562/',
      'https://3bbjtzlrh2.ucarecd.net/ab975182-bb6a-4853-a338-adfeddb7f170/-/preview/1000x562/',
      'https://3bbjtzlrh2.ucarecd.net/27bf4d04-e721-4f5c-b975-b2d69ea5c063/-/preview/1000x562/',
      'https://3bbjtzlrh2.ucarecd.net/fa75b92c-50d2-4dd3-bb8f-634672876775/-/preview/1000x562/',
      'https://3bbjtzlrh2.ucarecd.net/578561f0-f963-4681-b4c3-a09bd388386a/-/preview/1000x562/',
    ],
  },
  // akkord is video-only in the source site too — see src/data/videos.ts.
};

const EXT_BY_MIME = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'video/mp4': 'mp4',
};

async function download(url, destNoExt) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`GET ${url} -> ${res.status}`);
  const mime = res.headers.get('content-type')?.split(';')[0] ?? '';
  const ext = EXT_BY_MIME[mime] ?? (url.includes('adaptive_video') ? 'mp4' : 'jpg');
  const dest = `${destNoExt}.${ext}`;
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(dest, buf);
  return dest;
}

async function main() {
  await mkdir(RAW_DIR, { recursive: true });
  await mkdir(OUT_DIR, { recursive: true });

  for (const [projectId, assets] of Object.entries(PROJECT_ASSETS)) {
    const rawProjectDir = path.join(RAW_DIR, projectId);
    const outProjectDir = path.join(OUT_DIR, projectId);
    await mkdir(rawProjectDir, { recursive: true });
    await mkdir(outProjectDir, { recursive: true });

    let index = 1;

    for (const filename of assets.local ?? []) {
      const src = path.join(LOCAL_MEDIA_DIR, filename);
      if (!existsSync(src)) {
        console.warn(`[skip] ${projectId}: local file not found: ${src}`);
        continue;
      }
      const rawDest = path.join(rawProjectDir, String(index).padStart(2, '0') + path.extname(filename));
      if (!existsSync(rawDest)) await copyFile(src, rawDest);
      index += 1;
    }

    for (const url of assets.remote ?? []) {
      const destNoExt = path.join(rawProjectDir, String(index).padStart(2, '0'));
      const already = existsSync(`${destNoExt}.jpg`) || existsSync(`${destNoExt}.png`) || existsSync(`${destNoExt}.webp`);
      if (!already) {
        console.log(`[fetch] ${projectId} <- ${url}`);
        await download(url, destNoExt);
      }
      index += 1;
    }


    // Convert/copy raw-media -> optimized src/assets/projects/<id>/
    const files = await readdir(rawProjectDir);
    for (const file of files) {
      const rawPath = path.join(rawProjectDir, file);
      const ext = path.extname(file).toLowerCase();
      const base = path.basename(file, ext);

      if (ext === '.mp4') {
        const outPath = path.join(outProjectDir, `${base}.mp4`);
        if (!existsSync(outPath)) await copyFile(rawPath, outPath);
        continue;
      }

      const outPath = path.join(outProjectDir, `${base}.webp`);
      if (existsSync(outPath)) continue;
      const info = await stat(rawPath);
      if (info.size === 0) continue;
      await sharp(rawPath)
        .resize({ width: MAX_WIDTH, withoutEnlargement: true })
        .webp({ quality: WEBP_QUALITY })
        .toFile(outPath);
      console.log(`[webp] ${projectId}/${base}.webp`);
    }
  }

  console.log('\nDone. Optimized media is under frontend/src/assets/projects/<project-id>/.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
