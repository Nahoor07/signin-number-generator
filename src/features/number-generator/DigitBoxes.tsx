import styles from "./DigitBoxes.module.css";

type DigitBoxesProps = {
  /** null renders the empty state. */
  digits: readonly number[] | null;
  count: number;
  /** Screen reader texts, passed in so they follow the active language. */
  resultLabel: string;
  emptyLabel: string;
};

export function DigitBoxes({ digits, count, resultLabel, emptyLabel }: DigitBoxesProps) {
  const boxes = Array.from({ length: count }, (_, index) => digits?.[index] ?? null);

  return (
    // <output> is a live region, so screen readers announce every new result.
    <output className={styles.row}>
      <span className="visually-hidden">
        {digits ? `${resultLabel}: ${digits.join(", ")}` : emptyLabel}
      </span>
      {boxes.map((digit, index) => (
        <span
          key={index}
          className={styles.box}
          data-testid="digit-box"
          data-empty={digit === null}
          aria-hidden="true"
        >
          {digit ?? "-"}
        </span>
      ))}
    </output>
  );
}
