import type { HTMLAttributes } from "react";

import styles from "./Heading.module.css";

/** Page title in the kit's "h4" style (24/36 on desktop, 20/30 on mobile). */
export function Heading({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h1 className={[styles.heading, className].filter(Boolean).join(" ")} {...props} />;
}
