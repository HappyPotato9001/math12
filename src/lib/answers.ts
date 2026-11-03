export function normalizeExpression(value: string): string {
  return value
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/−/g, "-")
    .replace(/\u00d7/g, "*")
    .replace(/\u00f7/g, "/")
    .replace(/\^/g, "**")
    .replace(/\{|\}/g, "");
}

export function answersMatch(
  userAnswer: string,
  correct: string | number,
  accepted: string[] = [],
): boolean {
  const trimmed = userAnswer.trim();
  if (!trimmed) return false;

  const candidates = [
    String(correct),
    ...accepted.map(String),
  ].map((item) => item.trim());

  const asNumber = Number(trimmed);
  if (!Number.isNaN(asNumber) && candidates.some((c) => Number(c) === asNumber)) {
    return true;
  }

  const normalizedUser = normalizeExpression(trimmed);
  return candidates.some((c) => normalizeExpression(c) === normalizedUser);
}
