import styles from "./Header.module.css";

/*
 * The Figma header contains a "Logo" instance on the left and a language flag
 * and settings button on the right. The Logo's main component is empty (no
 * layers, no fill) and the flag and settings had no function, so the header is
 * kept only for its height and spacing.
 */
export function Header() {
  return <header className={styles.header} />;
}
