import type { HTMLAttributes } from "react";

import styles from "./Card.module.css";

/** The white form card shared by both screens (Figma: Auth/Form/*). */
export function Card({ className, ...props }: HTMLAttributes<HTMLElement>) {
  return <section className={[styles.card, className].filter(Boolean).join(" ")} {...props} />;
}
