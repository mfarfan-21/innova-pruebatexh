import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { translations, type Language, type Translation } from '../../shared/constants/translations';

interface LanguageContextType {
  t: Translation;
  currentLanguage: Language;
  changeLanguage: (lang: Language) => void;
  availableLanguages: Language[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');

  const t: Translation = translations[currentLanguage];

  const changeLanguage = (lang: Language) => {
    setCurrentLanguage(lang);
    // Opcionalmente guardar en localStorage
    localStorage.setItem('preferred-language', lang);
  };

  // Cargar idioma preferido al inicio
  useState(() => {
    const savedLang = localStorage.getItem('preferred-language') as Language;
    if (savedLang && translations[savedLang]) {
      setCurrentLanguage(savedLang);
    }
  });

  const value: LanguageContextType = {
    t,
    currentLanguage,
    changeLanguage,
    availableLanguages: Object.keys(translations) as Language[]
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
