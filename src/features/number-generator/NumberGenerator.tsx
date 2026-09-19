"use client";

import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/Button/Button";
import { Card } from "@/components/Card/Card";
import { Heading } from "@/components/Heading/Heading";
import { ArrowLeftIcon } from "@/components/icons/icons";
import { useDocumentTitle, useLocale } from "@/i18n/LanguageProvider";
import { DIGIT_COUNT, generateUniqueDigits } from "@/lib/generate-unique-digits";

import { DigitBoxes } from "./DigitBoxes";
import styles from "./NumberGenerator.module.css";

export function NumberGenerator() {
  // null = nothing generated yet, which shows the empty state from Figma.
  const [digits, setDigits] = useState<number[] | null>(null);
  const { locale, t } = useLocale("de");
  useDocumentTitle(t.generator.title);

  return (
    <Card className={styles.card} aria-labelledby="generator-title" lang={locale}>
      <div className={styles.intro}>
        <Heading id="generator-title">{t.generator.title}</Heading>
        <p className={styles.description}>
          {t.generator.description}
        </p>
      </div>

      <div className={styles.body}>
        <DigitBoxes
          digits={digits}
          count={DIGIT_COUNT}
          resultLabel={t.generator.result}
          emptyLabel={t.generator.empty}
        />
        <Button onClick={() => setDigits(generateUniqueDigits())}>{t.generator.generate}</Button>
        <Link href="/" className={styles.back}>
          <ArrowLeftIcon size={16} />
          {t.generator.back}
        </Link>
      </div>
    </Card>
  );
}
