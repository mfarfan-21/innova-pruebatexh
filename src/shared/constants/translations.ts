import en from '../../domain/translations/en.json';
import es from '../../domain/translations/es.json';
import ca from '../../domain/translations/ca.json';

// Diccionario de traducciones
export const translations = {
  en,
  es,
  ca
} as const;

export type Language = keyof typeof translations;
export type TranslationKeys = keyof typeof translations.en;
export type Translation = Record<TranslationKeys, string>;
