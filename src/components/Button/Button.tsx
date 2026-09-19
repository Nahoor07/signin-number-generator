import type { ButtonHTMLAttributes } from "react";

import styles from "./Button.module.css";

/** Figma "Button": Variant=Contained, Color=Primary, Size=L, full width. */
export function Button({
  className,
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type={type} className={[styles.button, className].filter(Boolean).join(" ")} {...props} />
  );
}
