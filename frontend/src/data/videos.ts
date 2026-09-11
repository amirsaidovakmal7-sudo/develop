/**
 * Two projects (Sonata Bot, Akkord) are shown as video in the source site,
 * not stills. The originals are 38-180MB each — there is no video
 * transcoder available in this environment to compress them, and vendoring
 * files that size into the repo/bundle is not reasonable for a portfolio
 * site. They stay on the existing Uploadcare CDN (the same host that was
 * already the source of truth for this media) via the direct-file URL
 * rather than the HLS `adaptive_video` manifest endpoint the old template
 * used (that one serves `.m3u8`, not playable as a plain <video src>).
 *
 * Everything else (all stills across all 12 projects) is downloaded,
 * converted to WebP and served locally — see scripts/fetch-media.mjs.
 */
export const projectVideos: Record<string, string[]> = {
  'sonata-bot': [
    'https://3bbjtzlrh2.ucarecd.net/a7915aa1-48d0-427e-bfa8-068f975bb971/',
    'https://3bbjtzlrh2.ucarecd.net/90ff6597-7024-4887-abbf-c3c3321c3865/',
    'https://3bbjtzlrh2.ucarecd.net/0ae83022-5c87-493b-a032-38876186ad18/',
  ],
  akkord: ['https://3bbjtzlrh2.ucarecd.net/59ba266d-d4a5-4c79-a9da-41b7f902b802/'],
};
