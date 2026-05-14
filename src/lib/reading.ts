// Estimate reading time at ~225 WPM
export function readingMinutes(words: number): number {
  return Math.max(1, Math.round((words || 0) / 225));
}
export function readingLabel(words: number): string {
  const m = readingMinutes(words);
  if (m < 60) return `${m} min read`;
  const h = Math.floor(m / 60);
  const r = m % 60;
  return r ? `${h}h ${r}m read` : `${h}h read`;
}
