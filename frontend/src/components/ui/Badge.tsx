import React, { forwardRef } from "react";
import type { ReactNode } from "react";
import { Badge as MuiBadge } from "@mui/material";
import type { BadgeProps as MuiBadgeProps } from "@mui/material";

// Only allow MUI-supported color values for type safety
type MuiColor =
  | "primary"
  | "secondary"
  | "success"
  | "error"
  | "info"
  | "warning";

export interface CustomBadgeProps extends Omit<MuiBadgeProps, "color"> {
  color?: MuiColor;
  children: ReactNode;
  badgeContent: ReactNode;
}

const Badge = forwardRef<HTMLSpanElement, CustomBadgeProps>(
  ({ color = "primary", children, badgeContent, ...props }, ref) => (
    <MuiBadge ref={ref} color={color} badgeContent={badgeContent} {...props}>
      {children}
    </MuiBadge>
  )
);

Badge.displayName = "Badge";
export default Badge;
