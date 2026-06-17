"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

type Language = "ar" | "en";

const LanguageContext = createContext<{
  language: Language;
  isArabic: boolean;
  toggleLanguage: () => void;
}>({
  language: "ar",
  isArabic: true,
  toggleLanguage: () => {}
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("ar");

  useEffect(() => {
    const saved = window.localStorage.getItem("domus_language");
    if (saved === "ar" || saved === "en") setLanguage(saved);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    window.localStorage.setItem("domus_language", language);
  }, [language]);

  const value = useMemo(
    () => ({
      language,
      isArabic: language === "ar",
      toggleLanguage: () => setLanguage((current) => (current === "ar" ? "en" : "ar"))
    }),
    [language]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}
