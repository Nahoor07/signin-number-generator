export type Locale = "en" | "de";

/*
 * The Figma texts are mixed on purpose: Sign In is English, the generator is
 * German. Each screen therefore starts in its Figma language, and these
 * dictionaries only take over once the user switches the language.
 */
export const messages = {
  en: {
    language: {
      current: "Language: English",
      switchTo: "Switch to German",
    },
    signIn: {
      title: "Sign in",
      noAccount: "Don't have an account?",
      getStarted: "Get started",
      email: "Email address",
      password: "Password",
      passwordPlaceholder: "6+ characters",
      showPassword: "Show password",
      hidePassword: "Hide password",
      generateNumbers: "Generate numbers",
      submit: "Sign in",
    },
    generator: {
      title: "Generate numbers",
      description: "Generate 6 numbers between 0 and 9, with no number appearing twice.",
      generate: "Generate",
      back: "Back",
      result: "Generated numbers",
      empty: "No numbers generated yet",
      settings: "Settings",
      settingsHint: "Settings – not part of this task",
    },
  },
  de: {
    language: {
      current: "Sprache: Deutsch",
      switchTo: "Auf Englisch umschalten",
    },
    signIn: {
      title: "Anmelden",
      noAccount: "Noch kein Konto?",
      getStarted: "Jetzt starten",
      email: "E-Mail-Adresse",
      password: "Passwort",
      passwordPlaceholder: "Mind. 6 Zeichen",
      showPassword: "Passwort anzeigen",
      hidePassword: "Passwort verbergen",
      generateNumbers: "Zahlen generieren",
      submit: "Anmelden",
    },
    generator: {
      title: "Zahlen generieren",
      description: "Generiere 6 Zahlen zwischen 0 und 9, wobei keine Zahl doppelt vorkommen darf.",
      generate: "Generieren",
      back: "Zurück",
      result: "Generierte Zahlen",
      empty: "Noch keine Zahlen generiert",
      settings: "Einstellungen",
      settingsHint: "Einstellungen – nicht Teil dieser Aufgabe",
    },
  },
} as const;

export type Messages = (typeof messages)[Locale];
