import type { Metadata } from "next";

import { AuthLayout } from "@/components/AuthLayout/AuthLayout";
import { NumberGenerator } from "@/features/number-generator/NumberGenerator";

export const metadata: Metadata = {
  title: "Zahlen generieren",
};

export default function NumberGeneratorPage() {
  return (
    <AuthLayout showBackgroundOnMobile={false}>
      <NumberGenerator />
    </AuthLayout>
  );
}
