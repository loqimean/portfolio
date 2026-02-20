// @ts-check
import { defineConfig, passthroughImageService } from 'astro/config';
import { DEFAULT_LANGUAGE, translations } from './src/i18n/translations';

import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  i18n: {
    defaultLocale: DEFAULT_LANGUAGE,
    locales: Object.keys(translations),
    routing: {
      prefixDefaultLocale: false
    }
  },

  image: {
    service: passthroughImageService()
  },

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [
    react()
  ]
});
