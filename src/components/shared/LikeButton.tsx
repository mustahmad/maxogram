"use client";

import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import { cn, formatNumber } from "@/lib/utils";

interface LikeButtonProps {
  isLiked: boolean;
  likesCount?: number;
  onToggle: () => void;
  size?: "sm" | "md";
}

const sizeMap = {
  sm: 18,
  md: 24,
} as const;

export default function LikeButton({
  isLiked,
  likesCount,
  onToggle,
  size = "md",
}: LikeButtonProps) {
  const iconSize = sizeMap[size];

  return (
    <div className="flex flex-col items-center">
      <motion.button
        type="button"
        onClick={onToggle}
        whileTap={{ scale: 1.3 }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
        className={cn(
          "inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full transition-colors",
          size === "sm" ? "p-1" : "p-2",
          "hover:text-muted-foreground/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        )}
        aria-label={isLiked ? "Unlike" : "Like"}
      >
        <Heart
          size={iconSize}
          className={cn(
            "transition-colors duration-150",
            isLiked
              ? "fill-red-500 text-red-500"
              : "fill-none text-foreground"
          )}
        />
      </motion.button>
      {typeof likesCount === "number" && (
        <span
          className={cn(
            "font-semibold text-foreground",
            size === "sm" ? "text-xs" : "text-sm"
          )}
        >
          {formatNumber(likesCount)}
        </span>
      )}
    </div>
  );
}
