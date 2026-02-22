const WORDS_PER_MINUTE = 110;

/**
 * Strips markdown syntax so word count reflects readable prose, not raw markup.
 * Removes: frontmatter, code blocks, inline code, images, links, headings,
 * HTML tags, emphasis markers, and horizontal rules.
 */
function stripMarkdown(raw: string): string {
  return raw
    // frontmatter
    .replace(/^---[\s\S]*?---\n?/, '')
    // fenced code blocks
    .replace(/```[\s\S]*?```/g, '')
    // inline code
    .replace(/`[^`]*`/g, '')
    // images
    .replace(/!\[.*?\]\(.*?\)/g, '')
    // links — keep label text
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    // headings markers
    .replace(/^#{1,6}\s+/gm, '')
    // HTML tags
    .replace(/<[^>]+>/g, '')
    // bold / italic markers
    .replace(/[*_]{1,3}([^*_]+)[*_]{1,3}/g, '$1')
    // horizontal rules
    .replace(/^[-*_]{3,}\s*$/gm, '')
    // extra whitespace
    .replace(/\s+/g, ' ')
    .trim();
}

export function readingTime(rawBody: string): string {
  const text  = stripMarkdown(rawBody);
  const words = text.split(' ').filter(Boolean).length;
  const minutes  = Math.max(1, Math.round(words / WORDS_PER_MINUTE));

  return `${minutes} min`;
}
