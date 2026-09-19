import type { Metadata } from "next";

import { AuthLayout } from "@/components/AuthLayout/AuthLayout";
import { Flag } from "@/components/Flag/Flag";
import { IconButton } from "@/components/IconButton/IconButton";
import { SettingsIcon } from "@/components/icons/icons";
import { NumberGenerator } from "@/features/number-generator/NumberGenerator";

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
          <Flag locale="de" className={styles.flag} />
          <span className={styles.settings}>
            <IconButton color="inherit" aria-label="Einstellungen">
              <SettingsIcon />
            </IconButton>
          </span>
        </>
      }
    >
      <NumberGenerator />
    </AuthLayout>
  );
}
