import { projectVideos } from '../data/videos';
import { MEDIA_SIZES } from '../data/mediaSizes.generated';

export interface ProjectImage {
  src: string;
  width: number;
  height: number;
}

// Vite resolves every matching file at build time and inlines its final
// asset URL — new files dropped in by scripts/fetch-media.mjs are picked up
// automatically, no per-project import list to maintain by hand.
const imageModules = import.meta.glob('/src/assets/projects/*/*.webp', {
  eager: true,
  import: 'default',
}) as Record<string, string>;

const imagesByProject = new Map<string, ProjectImage[]>();

for (const [filePath, url] of Object.entries(imageModules)) {
  const match = filePath.match(/\/assets\/projects\/([^/]+)\/([^/]+\.webp)$/);
  if (!match) continue;
  const [, projectId, file] = match;
  // Intrinsic size comes from scripts/gen-media-sizes.mjs so every <img> can
  // reserve its box before it decodes; the fallback is only a safety net for
  // a file added without re-running the generator.
  const [width, height] = MEDIA_SIZES[`${projectId}/${file}`] ?? [1600, 900];
  const list = imagesByProject.get(projectId) ?? [];
  list.push({ src: url, width, height });
  imagesByProject.set(projectId, list);
}

for (const [id, list] of imagesByProject) {
  // Vite's glob keys are the source paths, so sorting by URL would sort by
  // content hash. Re-derive the order from the original file names.
  const order = new Map(
    Object.entries(imageModules)
      .filter(([p]) => p.includes(`/projects/${id}/`))
      .map(([p, url]) => [url, p]),
  );
  list.sort((a, b) => (order.get(a.src) ?? '').localeCompare(order.get(b.src) ?? ''));
}

/**
 * Frames captured from the two video-only projects by
 * scripts/gen-video-posters.mjs. They are kept out of `imagesByProject` on
 * purpose: they represent a recording, so they belong in the index and as
 * the <video poster>, not in the case view's list of screenshots.
 */
const posterModules = import.meta.glob('/src/assets/posters/*.webp', {
  eager: true,
  import: 'default',
}) as Record<string, string>;

const postersByProject = new Map<string, string>();
for (const [filePath, url] of Object.entries(posterModules)) {
  const match = filePath.match(/\/assets\/posters\/([^/]+)\.webp$/);
  if (match) postersByProject.set(match[1], url);
}

export function getProjectImages(projectId: string): ProjectImage[] {
  return imagesByProject.get(projectId) ?? [];
}

export function getProjectVideos(projectId: string): string[] {
  return projectVideos[projectId] ?? [];
}

/**
 * The single frame that represents a project in the index and on the stage:
 * its first screenshot, or — for a project that only exists as a recording
 * — the captured video frame. Either way the index shows a real image and
 * never starts a 38 MB video download to draw a thumbnail.
 */
export function getProjectPoster(projectId: string): ProjectImage | null {
  const still = getProjectImages(projectId)[0];
  if (still) return still;
  const captured = postersByProject.get(projectId);
  return captured ? { src: captured, width: 1600, height: 900 } : null;
}

export function getMediaCount(projectId: string): number {
  return getProjectImages(projectId).length + getProjectVideos(projectId).length;
}
