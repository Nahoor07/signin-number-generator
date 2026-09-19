import type { Metadata } from "next";

import { AuthLayout } from "@/components/AuthLayout/AuthLayout";
import { LanguageSwitch } from "@/components/LanguageSwitch/LanguageSwitch";
import { SignInForm } from "@/features/sign-in/SignInForm";

import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Sign in",
};

export default function SignInPage() {
  return (
    <AuthLayout
      headerActions={<LanguageSwitch figmaLocale="en" variant="icon-button" flagClassName={styles.flag} />}
    >
      <SignInForm />
    </AuthLayout>
  );
}
