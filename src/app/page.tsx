import type { Metadata } from "next";

import { AuthLayout } from "@/components/AuthLayout/AuthLayout";
import { SignInForm } from "@/features/sign-in/SignInForm";

export const metadata: Metadata = {
  title: "Sign in",
};

export default function SignInPage() {
  return (
    <AuthLayout>
      <SignInForm />
    </AuthLayout>
  );
}
