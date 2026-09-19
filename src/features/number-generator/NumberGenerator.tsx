"use client";

import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/Button/Button";
import { Card } from "@/components/Card/Card";
import { Heading } from "@/components/Heading/Heading";
import { ArrowLeftIcon } from "@/components/icons/icons";
import { DIGIT_COUNT, generateUniqueDigits } from "@/lib/generate-unique-digits";

import { DigitBoxes } from "./DigitBoxes";
import styles from "./NumberGenerator.module.css";

export function NumberGenerator() {
  // null = nothing generated yet, which shows the empty state from Figma.
  const [digits, setDigits] = useState<number[] | null>(null);

  return (
    <Card className={styles.card} aria-labelledby="generator-title" lang="de">
      <div className={styles.intro}>
        <Heading id="generator-title">Zahlen generieren</Heading>
        <p className={styles.description}>
          Generiere 6 Zahlen zwischen 0 und 9, wobei keine Zahl doppelt vorkommen darf.
        </p>
      </div>

      <div className={styles.body}>
        <DigitBoxes digits={digits} count={DIGIT_COUNT} />
        <Button onClick={() => setDigits(generateUniqueDigits())}>Generieren</Button>
        <Link href="/" className={styles.back}>
          <ArrowLeftIcon size={16} />
          Zurück
        </Link>
      </div>
    </Card>
  );
}
