import Image from "next/image";

import styles from "./Flag.module.css";

const FLAGS = {
  en: { src: "/images/flags/en.png", label: "English" },
  de: { src: "/images/flags/de.png", label: "Deutsch" },
} as const;

type FlagProps = {
  locale: keyof typeof FLAGS;
  /** Sizes differ per screen in Figma, so they are set from the outside via CSS. */
  className?: string;
  /** Inside a labelled button the flag is decoration and must not be read twice. */
  decorative?: boolean;
};

export function Flag({ locale, className, decorative = false }: FlagProps) {
  const { src, label } = FLAGS[locale];

  return (
    <Image
      src={src}
      alt={decorative ? "" : label}
      width={34}
      height={20}
      className={[styles.flag, className].filter(Boolean).join(" ")}
    />
  );
}
