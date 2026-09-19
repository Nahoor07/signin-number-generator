"use client";

import { useState, type ComponentProps } from "react";

import { EyeClosedIcon, EyeIcon } from "@/components/icons/icons";
import { IconButton } from "@/components/IconButton/IconButton";
import { TextField } from "@/components/TextField/TextField";

type PasswordFieldProps = Omit<ComponentProps<typeof TextField>, "type" | "endAdornment"> & {
  /** Accessible names of the eye button, passed in so they follow the active language. */
  showLabel: string;
  hideLabel: string;
};

/**
 * Text field with the eye button from Figma. The default (hidden password,
 * closed eye) is the Figma state; toggling the visibility is an addition.
 */
export function PasswordField({ showLabel, hideLabel, ...props }: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <TextField
      {...props}
      type={visible ? "text" : "password"}
      endAdornment={
        <IconButton
          aria-label={visible ? hideLabel : showLabel}
          aria-pressed={visible}
          onClick={() => setVisible((current) => !current)}
        >
          {visible ? <EyeIcon /> : <EyeClosedIcon />}
        </IconButton>
      }
    />
  );
}
