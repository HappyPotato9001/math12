/** Public asset helper. Keep leading slash paths root-relative. */
export function assetPath(path: string) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return normalized;
}

export function imageUrl(imageId: string) {
  return `/api/images/${imageId}`;
}
