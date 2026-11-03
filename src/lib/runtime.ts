/** True when building/serving the static GitHub Pages export. */
export function isStaticExport() {
  return process.env.NEXT_PUBLIC_STATIC_EXPORT === "1";
}

/** Repo base path on GitHub Pages, e.g. `/math12`, or empty for local/server. */
export function publicBasePath() {
  return process.env.NEXT_PUBLIC_BASE_PATH || "";
}
