import styles from "./Background.module.css";

/**
 * Figma component "background/overlay-1": a photo with a 40px layer blur,
 * covered by the page colour at 90 % opacity. Purely decorative.
 */
export function Background({ className }: { className?: string }) {
  return (
    <div className={[styles.background, className].filter(Boolean).join(" ")} aria-hidden="true">
      <div className={styles.image} />
      <div className={styles.overlay} />
    </div>
  );
}
