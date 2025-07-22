import React, { forwardRef } from "react";
import { TextField, type TextFieldProps } from "@mui/material";

export type CustomInputProps = TextFieldProps & {
  size?: "small" | "medium";
  variant?: "outlined" | "filled" | "standard";
};

const Input = forwardRef<HTMLInputElement, CustomInputProps>(
  ({ size = "medium", variant = "outlined", ...props }, ref) => (
    <TextField ref={ref} size={size} variant={variant} {...props} />
  )
);

Input.displayName = "Input";
export default Input;
