/**
 * Returns `href` when it doesn't match the current page, or `fallback` when it
 * does — preventing self-referencing links that waste crawl budget.
 *
 * Trailing slashes are normalised before comparison so `/about/` and `/about`
 * are treated as the same page.
 */
export function safeHref(
  href: string,
  currentPath: string,
  fallback: string | null = null,
): string | null {
  const normalize = (p: string) => p.replace(/\/$/, '') || '/';
  return normalize(href) === normalize(currentPath) ? fallback : href;
}
