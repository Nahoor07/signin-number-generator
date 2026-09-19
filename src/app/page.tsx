import type { Metadata } from "next";

import { AuthLayout } from "@/components/AuthLayout/AuthLayout";
import { Flag } from "@/components/Flag/Flag";
import { IconButton } from "@/components/IconButton/IconButton";
import { SignInForm } from "@/features/sign-in/SignInForm";

import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Sign in",
};

export default function SignInPage() {
  return (
    <AuthLayout
      headerActions={
        <IconButton aria-label="Language: English">
          <Flag locale="en" className={styles.flag} decorative />
        </IconButton>
      }
    >
      <SignInForm />
    </AuthLayout>
  );
}
