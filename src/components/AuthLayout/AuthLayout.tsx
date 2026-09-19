import type { ReactNode } from "react";

import { Background } from "@/components/Background/Background";
import { Header } from "@/components/Header/Header";

import styles from "./AuthLayout.module.css";

type AuthLayoutProps = {
  /**
   * The mobile "Verify" frame in Figma has a plain white page without the
   * blurred background image, the mobile sign-in frame has it. This flag
   * keeps both 1:1 instead of "fixing" the design.
   */
  showBackgroundOnMobile?: boolean;
  children: ReactNode;
};

export function AuthLayout({
  showBackgroundOnMobile = true,
  children,
}: AuthLayoutProps) {
  return (
    <div className={styles.page}>
      <Background className={showBackgroundOnMobile ? undefined : styles.desktopOnly} />
      <Header />
      <main className={styles.main}>{children}</main>
    </div>
  );
}
