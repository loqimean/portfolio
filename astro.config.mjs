// @ts-check
import { defineConfig } from 'astro/config';
import { DEFAULT_LANGUAGE, translations } from './src/i18n/translations';
import { rehypeAccessibleEmojis } from 'rehype-accessible-emojis';
import rehypeExternalLinks from 'rehype-external-links';

import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';


// https://astro.build/config
export default defineConfig({
  site: 'https://ivanmarynych.com',
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
    sitemap(),
    react()
  ]
});
