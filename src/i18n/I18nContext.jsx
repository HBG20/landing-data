import { createContext, useContext, useState, useEffect } from "react";

const I18nContext = createContext();

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
};

export const I18nProvider = ({ children, defaultLocale = "en" }) => {
  const [locale, setLocale] = useState(() => {
    // Try to get locale from localStorage, fallback to default
    const savedLocale = localStorage.getItem("locale");
    return savedLocale || defaultLocale;
  });

  useEffect(() => {
    // Save locale to localStorage when it changes
    localStorage.setItem("locale", locale);
  }, [locale]);

  const t = (key, translationsObj) => {
    if (!translationsObj[locale]) {
      console.warn(`Translation missing for locale: ${locale}, key: ${key}`);
      return translationsObj[defaultLocale]?.[key] || key;
    }
    return translationsObj[locale][key] || translationsObj[defaultLocale]?.[key] || key;
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
};

