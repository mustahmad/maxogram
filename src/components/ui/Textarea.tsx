"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  type TextareaHTMLAttributes,
} from "react";
import { cn } from "@/lib/utils";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Label text displayed above the textarea */
  label?: string;
  /** Error message displayed below the textarea */
  error?: string;
  /** Maximum number of visible rows before scrolling */
  maxRows?: number;
  /** Additional classes for the outer wrapper */
  wrapperClassName?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      maxRows = 6,
      className,
      wrapperClassName,
      id,
      disabled,
      onChange,
      value,
      ...props
    },
    forwardedRef,
  ) => {
    const internalRef = useRef<HTMLTextAreaElement | null>(null);
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    const setRef = useCallback(
      (node: HTMLTextAreaElement | null) => {
        internalRef.current = node;
        if (typeof forwardedRef === "function") {
          forwardedRef(node);
        } else if (forwardedRef) {
          forwardedRef.current = node;
        }
      },
      [forwardedRef],
    );

    const autoResize = useCallback(() => {
      const textarea = internalRef.current;
      if (!textarea) return;

      textarea.style.height = "auto";

      const lineHeight = parseInt(getComputedStyle(textarea).lineHeight, 10) || 20;
      const maxHeight = lineHeight * maxRows;

      textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`;
      textarea.style.overflowY =
        textarea.scrollHeight > maxHeight ? "auto" : "hidden";
    }, [maxRows]);

    useEffect(() => {
      autoResize();
    }, [value, autoResize]);

    return (
      <div className={cn("flex flex-col gap-1.5", wrapperClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-foreground"
          >
            {label}
          </label>
        )}

        <textarea
          ref={setRef}
          id={inputId}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          rows={1}
          value={value}
          onChange={(e) => {
            onChange?.(e);
            autoResize();
          }}
          className={cn(
            "w-full resize-none rounded-xl border bg-muted px-3 py-2.5 text-sm text-foreground",
            "border-border placeholder:text-muted-foreground",
            "transition-colors duration-150",
            "focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-red-500 focus:border-red-500 focus:ring-red-500",
            className,
          )}
          {...props}
        />

        {error && (
          <p
            id={`${inputId}-error`}
            className="text-xs text-red-500"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    );
  },
);

Textarea.displayName = "Textarea";

export default Textarea;
