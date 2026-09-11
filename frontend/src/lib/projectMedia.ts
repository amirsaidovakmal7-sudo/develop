import { projectVideos } from '../data/videos';

// Vite resolves every matching file at build time and inlines its final
// asset URL — new files dropped in by scripts/fetch-media.mjs are picked up
// automatically, no per-project import list to maintain by hand.
const imageModules = import.meta.glob('/src/assets/projects/*/*.webp', {
  eager: true,
  import: 'default',
}) as Record<string, string>;

const imagesByProject = new Map<string, string[]>();
for (const [filePath, url] of Object.entries(imageModules)) {
  const match = filePath.match(/\/assets\/projects\/([^/]+)\/([^/]+)\.webp$/);
  if (!match) continue;
  const [, projectId] = match;
  const list = imagesByProject.get(projectId) ?? [];
  list.push(url);
  imagesByProject.set(projectId, list);
}
for (const list of imagesByProject.values()) list.sort();

export function getProjectImages(projectId: string): string[] {
  return imagesByProject.get(projectId) ?? [];
}

export function getProjectVideos(projectId: string): string[] {
  return projectVideos[projectId] ?? [];
}
