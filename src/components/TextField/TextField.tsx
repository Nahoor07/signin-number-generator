import { useId, type InputHTMLAttributes, type ReactNode } from "react";

import styles from "./TextField.module.css";

type TextFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "id"> & {
  label: string;
  endAdornment?: ReactNode;
};

/** Figma "TextField": Variant=Filled, Size=M. */
export function TextField({ label, endAdornment, className, ...inputProps }: TextFieldProps) {
  const id = useId();

  return (
    <div
      className={[styles.field, endAdornment ? styles.withEndAdornment : undefined, className]
        .filter(Boolean)
        .join(" ")}
    >
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      <input id={id} className={styles.input} {...inputProps} />
      {endAdornment ? <div className={styles.endAdornment}>{endAdornment}</div> : null}
    </div>
  );
}
