import en from './en';
import uk from './uk';
import pl from './pl';
import es from './es';

export const DEFAULT_LANGUAGE = 'en';

export const translations = {
  en,
  uk,
  pl,
  es,
} as const;

export type Language = keyof typeof translations;
export type TranslationKey = keyof typeof translations.en;

export function getTranslations(lang: string = DEFAULT_LANGUAGE) {
  return translations[lang as Language] || translations.en;
}

export function getLocalizedPath(locale: string): string {
  return locale === DEFAULT_LANGUAGE ? '/' : `/${locale}`;
}
