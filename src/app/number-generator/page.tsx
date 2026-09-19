import type { Metadata } from "next";

import { AuthLayout } from "@/components/AuthLayout/AuthLayout";
import { LanguageSwitch } from "@/components/LanguageSwitch/LanguageSwitch";
import { NumberGenerator } from "@/features/number-generator/NumberGenerator";
import { SettingsButton } from "@/features/number-generator/SettingsButton";

import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Zahlen generieren",
};

export default function NumberGeneratorPage() {
  return (
    <AuthLayout
      showBackgroundOnMobile={false}
      headerActions={
        <>
          <LanguageSwitch figmaLocale="de" variant="plain" flagClassName={styles.flag} />
          <span className={styles.settings}>
            <SettingsButton />
          </span>
        </>
      }
    >
      <NumberGenerator />
    </AuthLayout>
  );
}
