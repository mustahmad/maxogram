"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-gradient text-white hover:bg-brand-gradient-hover shadow-sm active:scale-[0.98]",
  secondary:
    "bg-muted text-foreground hover:bg-muted/80 active:scale-[0.98]",
  ghost:
    "bg-transparent text-foreground hover:bg-muted active:bg-muted/80",
  danger:
    "bg-red-500 text-white hover:bg-red-600 active:scale-[0.98]",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-sm gap-1.5 rounded-lg",
  md: "h-10 px-4 text-sm gap-2 rounded-xl",
  lg: "h-12 px-6 text-base gap-2 rounded-xl",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style variant */
  variant?: ButtonVariant;
  /** Button size */
  size?: ButtonSize;
  /** Whether the button takes full width */
  fullWidth?: boolean;
  /** Show loading spinner and disable interaction */
  loading?: boolean;
  /** Icon displayed before children */
  iconLeft?: ReactNode;
  /** Icon displayed after children */
  iconRight?: ReactNode;
  children: ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      fullWidth = false,
      loading = false,
      disabled = false,
      iconLeft,
      iconRight,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        type="button"
        disabled={isDisabled}
        aria-disabled={isDisabled}
        aria-busy={loading}
        className={cn(
          "inline-flex items-center justify-center font-semibold transition-all duration-150 select-none",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
          "disabled:pointer-events-none disabled:opacity-50",
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && "w-full",
          className,
        )}
        {...props}
      >
        {loading ? (
          <Loader2
            className="animate-spin"
            size={size === "sm" ? 14 : size === "md" ? 16 : 18}
            aria-hidden="true"
          />
        ) : (
          iconLeft && <span aria-hidden="true">{iconLeft}</span>
        )}
        <span>{children}</span>
        {!loading && iconRight && <span aria-hidden="true">{iconRight}</span>}
      </button>
    );
  },
);

Button.displayName = "Button";

export default Button;
