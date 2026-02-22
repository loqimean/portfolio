import { LANGUAGE_COLORS } from './constants';

export function formatCount(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (n >= 1_000)     return (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'k';

  return n.toString();
}

export function getLangColor(lang: string | null): string {
  if (!lang) return '#8b8b8b';

  return LANGUAGE_COLORS[lang] ?? '#8b8b8b';
}
