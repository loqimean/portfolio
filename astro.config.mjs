// @ts-check
import { defineConfig } from 'astro/config';
import { DEFAULT_LANGUAGE, translations } from './src/i18n/translations';
import { rehypeAccessibleEmojis } from 'rehype-accessible-emojis';
import rehypeExternalLinks from 'rehype-external-links';
import { readFileSync, readdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { join } from 'path';

import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// Build a slug → pubDate map by reading blog frontmatter at config time
const blogDir = fileURLToPath(new URL('./src/content/blog', import.meta.url));
/** @type {Record<string, string>} */
const blogLastmod = {};
for (const file of readdirSync(blogDir)) {
  if (!file.endsWith('.md')) continue;
  const content = readFileSync(join(blogDir, file), 'utf-8');
  const match = content.match(/^pubDate:\s*(.+)$/m);
  if (match) {
    const slug = file.replace(/\.md$/, '');
    blogLastmod[slug] = new Date(match[1].trim()).toISOString().split('T')[0];
  }
}


// https://astro.build/config
export default defineConfig({
  site: 'https://ivanmarynych.com',
  redirects: {
    '/en/': '/',
  },
  i18n: {
    defaultLocale: DEFAULT_LANGUAGE,
    locales: Object.keys(translations),
    routing: {
      prefixDefaultLocale: false
    }
  },

  markdown: {
    rehypePlugins: [
      [rehypeExternalLinks, { target: '_blank', rel: ['noopener', 'noreferrer'] }],
      rehypeAccessibleEmojis
    ],
  },

  vite: {
    plugins: [tailwindcss()],
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('@react-three') || id.includes('three')) {
              return 'three';
            }
            if (id.includes('gsap')) {
              return 'gsap';
            }
          },
        },
      },
    },
  },

  integrations: [
    sitemap({
      i18n: {
        defaultLocale: DEFAULT_LANGUAGE,
        locales: {
          en: 'en',
          uk: 'uk',
          pl: 'pl',
          es: 'es',
        },
      },
      serialize(item) {
        // Use actual pubDate for blog posts, build date for everything else
        const blogSlugMatch = item.url.match(/\/blog\/([^/]+)\//);
        const lastmod = blogSlugMatch
          ? (blogLastmod[blogSlugMatch[1]] ?? new Date().toISOString().split('T')[0])
          : new Date().toISOString().split('T')[0];
        return { ...item, lastmod };
      },
    }),
    react()
  ]
});
