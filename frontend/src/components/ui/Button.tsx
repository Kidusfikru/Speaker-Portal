import React, { forwardRef } from "react";
import { Button as MuiButton } from "@mui/material";
import type { ButtonProps as MuiButtonProps } from "@mui/material";

// Only allow MUI-supported color values for type safety
type MuiColor =
  | "primary"
  | "secondary"
  | "success"
  | "error"
  | "info"
  | "warning"
  | "inherit";

export interface ButtonProps extends Omit<MuiButtonProps, "color"> {
  variant?: "contained" | "outlined" | "text";
  color?: MuiColor;
  size?: "small" | "medium" | "large";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { variant = "contained", color = "primary", size = "medium", ...props },
    ref
  ) => (
    <MuiButton
      ref={ref}
      variant={variant}
      color={color}
      size={size}
      {...props}
    />
  )
);

Button.displayName = "Button";
export default Button;
