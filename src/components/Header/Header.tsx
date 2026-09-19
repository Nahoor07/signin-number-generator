import type { ReactNode } from "react";

import styles from "./Header.module.css";

/*
 * The Figma header also contains a "Logo" instance on the left. Its main
 * component is empty (no layers, no fill), so it renders nothing in Figma and
 * is left out here. The actions are right-aligned, so the logo slot has no
 * influence on the layout.
 */
export function Header({ children }: { children: ReactNode }) {
  return (
    <header className={styles.header}>
      <div className={styles.actions}>{children}</div>
    </header>
  );
}
