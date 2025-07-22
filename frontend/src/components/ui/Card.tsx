import React, { forwardRef } from "react";
import type { ReactNode } from "react";
import { Card as MuiCard, CardContent } from "@mui/material";
import type { CardProps as MuiCardProps } from "@mui/material";

export interface CustomCardProps extends MuiCardProps {
  children: ReactNode;
  variant?: "elevation" | "outlined";
}

const Card = forwardRef<HTMLDivElement, CustomCardProps>(
  ({ children, variant = "elevation", ...props }, ref) => (
    <MuiCard ref={ref} variant={variant} {...props}>
      <CardContent>{children}</CardContent>
    </MuiCard>
  )
);

Card.displayName = "Card";
export default Card;
