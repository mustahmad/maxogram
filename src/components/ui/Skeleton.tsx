"use client";

import { cn } from "@/lib/utils";

type SkeletonVariant = "circle" | "rect" | "text";

interface SkeletonProps {
  /** Shape variant of the skeleton */
  variant?: SkeletonVariant;
  /** Additional classes for custom sizing */
  className?: string;
}

const variantStyles: Record<SkeletonVariant, string> = {
  circle: "rounded-full aspect-square",
  rect: "rounded-lg",
  text: "rounded h-4 w-full",
};

export default function Skeleton({
  variant = "rect",
  className,
}: SkeletonProps) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn(
        "animate-pulse bg-muted",
        variantStyles[variant],
        className,
      )}
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}
