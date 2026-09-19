import type { ButtonHTMLAttributes } from "react";

import styles from "./IconButton.module.css";

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  /** Figma "Color" variant: Default = action/active, Inherit = text/primary. */
  color?: "default" | "inherit";
  /** An icon-only button always needs an accessible name. */
  "aria-label": string;
};

export function IconButton({
  color = "default",
  className,
  type = "button",
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type}
      className={[styles.iconButton, styles[color], className].filter(Boolean).join(" ")}
      {...props}
    />
  );
}
