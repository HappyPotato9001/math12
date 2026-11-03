import { publicBasePath } from "./runtime";

/** Public asset helper. Prefixes GitHub Pages base path when set. */
export function assetPath(path: string) {
  const base = publicBasePath();
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}`;
}

/** Prefix fetch/API paths for GitHub Pages base path. */
export function apiPath(path: string) {
  return assetPath(path);
}
