"use client";

import { cn } from "@/lib/utils";

interface BadgeProps {
  /** Notification count to display */
  count: number;
  /** Additional CSS classes */
  className?: string;
}

export default function Badge({ count, className }: BadgeProps) {
  if (count <= 0) return null;

  const display = count > 99 ? "99+" : count.toString();

  return (
    <span
      role="status"
      aria-label={`${count} notifications`}
      className={cn(
        "inline-flex items-center justify-center rounded-full bg-red-500 font-bold text-white",
        "min-w-[18px] px-1 py-0.5 text-[10px] leading-none",
        className,
      )}
    >
      {display}
    </span>
  );
}
