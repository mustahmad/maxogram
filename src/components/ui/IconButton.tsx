"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type IconButtonSize = "sm" | "md" | "lg";

const sizeStyles: Record<IconButtonSize, string> = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-12 w-12",
};

const iconSizeStyles: Record<IconButtonSize, string> = {
  sm: "[&_svg]:h-4 [&_svg]:w-4",
  md: "[&_svg]:h-5 [&_svg]:w-5",
  lg: "[&_svg]:h-6 [&_svg]:w-6",
};

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Button size */
  size?: IconButtonSize;
  /** Icon element rendered as children */
  children: ReactNode;
}

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ size = "md", className, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        disabled={disabled}
        aria-disabled={disabled}
        className={cn(
          "inline-flex items-center justify-center rounded-full",
          "text-foreground transition-colors duration-150",
          "hover:bg-muted active:bg-muted/80",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
          "disabled:pointer-events-none disabled:opacity-50",
          sizeStyles[size],
          iconSizeStyles[size],
          className,
        )}
        {...props}
      >
        {children}
      </button>
    );
  },
);

IconButton.displayName = "IconButton";

export default IconButton;
