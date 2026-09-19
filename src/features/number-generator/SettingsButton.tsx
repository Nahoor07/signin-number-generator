"use client";

import { IconButton } from "@/components/IconButton/IconButton";
import { SettingsIcon } from "@/components/icons/icons";
import { useLocale } from "@/i18n/LanguageProvider";

/** In Figma, but settings are not part of this task; the tooltip says so. */
export function SettingsButton() {
  const { t } = useLocale("de");

  return (
    <IconButton color="inherit" aria-label={t.generator.settings} title={t.generator.settingsHint}>
      <SettingsIcon />
    </IconButton>
  );
}
