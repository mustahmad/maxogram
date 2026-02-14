"use client";

import { MessageCircle } from "lucide-react";
import { cn, formatNumber } from "@/lib/utils";

interface CommentButtonProps {
  onClick: () => void;
  count?: number;
}

export default function CommentButton({ onClick, count }: CommentButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex min-h-[44px] min-w-[44px] items-center gap-1 rounded-full p-2 transition-colors",
        "text-foreground hover:text-muted-foreground/80",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      )}
      aria-label="Comment"
    >
      <MessageCircle size={24} className="transition-colors duration-150" />
      {typeof count === "number" && count > 0 && (
        <span className="text-sm font-semibold text-foreground">
          {formatNumber(count)}
        </span>
      )}
    </button>
  );
}
