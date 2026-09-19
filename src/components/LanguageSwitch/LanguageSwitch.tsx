"use client";

import { Flag } from "@/components/Flag/Flag";
import { IconButton } from "@/components/IconButton/IconButton";
import { useLocale } from "@/i18n/LanguageProvider";
import type { Locale } from "@/i18n/messages";

import styles from "./LanguageSwitch.module.css";

type LanguageSwitchProps = {
  figmaLocale: Locale;
  /**
   * Sign In has the flag inside a 40 × 40 IconButton, the generator shows the
   * bare flag image. "plain" keeps the generator's layout by making the button
   * exactly as big as the flag.
   */
  variant: "icon-button" | "plain";
  flagClassName?: string;
};

/** Shows the flag of the active language; a click switches between English and German. */
export function LanguageSwitch({ figmaLocale, variant, flagClassName }: LanguageSwitchProps) {
  const { locale, t, toggle } = useLocale(figmaLocale);
  const flag = <Flag locale={locale} className={flagClassName} decorative />;
  const buttonProps = {
    "aria-label": `${t.language.current}. ${t.language.switchTo}`,
    title: t.language.switchTo,
    onClick: toggle,
  };

  if (variant === "icon-button") {
    return <IconButton {...buttonProps}>{flag}</IconButton>;
  }

  return (
    <button type="button" className={styles.plain} {...buttonProps}>
      {flag}
    </button>
  );
}
