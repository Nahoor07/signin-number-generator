import type { Metadata, Viewport } from "next";
import { Barlow, Outfit, Public_Sans } from "next/font/google";

import { LanguageProvider } from "@/i18n/LanguageProvider";

import "./globals.css";

// Only the weights that appear in the Figma file are loaded.
const barlow = Barlow({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["600"],
});

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["600"],
});

export const metadata: Metadata = {
  title: {
    default: "TJ Labs",
    template: "%s | TJ Labs",
  },
  description: "Sign in and number generator screens, rebuilt 1:1 from Figma.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${barlow.variable} ${publicSans.variable} ${outfit.variable}`}>
      <body>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
