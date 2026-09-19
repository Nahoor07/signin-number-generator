"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

import { messages, type Locale } from "./messages";

type LanguageContextValue = {
  /** null until the user picks a language; each screen then uses its Figma language. */
  choice: Locale | null;
  setChoice: (locale: Locale) => void;
};

const LanguageContext = createContext<LanguageContextValue>({
  choice: null,
  setChoice: () => {},
});

/*
 * Lives in the root layout, which stays mounted during client-side navigation,
 * so the choice carries over between the two screens. It is not persisted: a
 * reload shows the Figma state again, and the server-rendered HTML always
 * matches the first client render.
 */
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [choice, setChoice] = useState<Locale | null>(null);

  return <LanguageContext.Provider value={{ choice, setChoice }}>{children}</LanguageContext.Provider>;
}

/** The active locale and its texts; `figmaLocale` is the language the screen has in Figma. */
export function useLocale(figmaLocale: Locale) {
  const { choice, setChoice } = useContext(LanguageContext);
  const locale = choice ?? figmaLocale;

  return {
    locale,
    t: messages[locale],
    toggle: () => setChoice(locale === "en" ? "de" : "en"),
  };
}

/** Keeps the browser tab title in the active language (same format as the metadata template). */
export function useDocumentTitle(title: string) {
  useEffect(() => {
    document.title = `${title} | TJ Labs`;
  }, [title]);
}
