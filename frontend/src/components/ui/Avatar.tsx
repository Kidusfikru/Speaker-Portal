import React, { forwardRef } from "react";
import { Avatar as MuiAvatar } from "@mui/material";
import type { AvatarProps as MuiAvatarProps } from "@mui/material";

export interface CustomAvatarProps extends MuiAvatarProps {
  size?: "small" | "medium" | "large";
}

const sizeMap = {
  small: 32,
  medium: 48,
  large: 72,
};

const Avatar = forwardRef<HTMLDivElement, CustomAvatarProps>(
  ({ size = "medium", sx, ...props }, ref) => (
    <MuiAvatar
      ref={ref}
      sx={{ width: sizeMap[size], height: sizeMap[size], ...(sx || {}) }}
      {...props}
    />
  )
);

Avatar.displayName = "Avatar";
export default Avatar;
