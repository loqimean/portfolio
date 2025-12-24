# Internationalization (i18n)

This folder contains all translation files for the portfolio application.

## Structure

- `translations.ts` - Main file that exports all translations and helper functions
- `en.ts` - English translations (default language)
- `uk.ts` - Ukrainian translations (Українська)
- `pl.ts` - Polish translations (Polski)
- `es.ts` - Spanish translations (Español)

## How to Use

Import translations in your components:

```typescript
import { getTranslations } from '../i18n/translations';

const t = getTranslations('en'); // or 'uk', 'pl', 'es'
console.log(t.name); // "Your Name"
```

## Adding a New Language

1. Create a new file (e.g., `de.ts` for German)
2. Copy the structure from any existing language file
3. Translate all strings
4. Import and add it to `translations.ts`:
   ```typescript
   import de from './de';

   export const translations = {
     en,
     uk,
     pl,
     es,
     de, // Add here
   } as const;
   ```
6. Add a button in `Header.astro` for the new language
