"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type FollowButtonSize = "sm" | "md";

interface FollowButtonProps {
  isFollowing: boolean;
  onToggle: () => void;
  size?: FollowButtonSize;
}

const sizeStyles: Record<FollowButtonSize, string> = {
  sm: "h-8 px-4 text-xs rounded-lg",
  md: "h-9 px-6 text-sm rounded-xl",
};

export default function FollowButton({
  isFollowing,
  onToggle,
  size = "md",
}: FollowButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  const showUnfollow = isFollowing && isHovered;

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      onClick={onToggle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "inline-flex items-center justify-center font-semibold transition-colors duration-200 select-none",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        sizeStyles[size],
        isFollowing
          ? showUnfollow
            ? "border border-red-500 bg-transparent text-red-500 hover:bg-red-500/10"
            : "bg-muted text-foreground border border-border"
          : "bg-brand-gradient text-white",
      )}
      aria-label={isFollowing ? "Unfollow" : "Follow"}
    >
      {isFollowing ? (showUnfollow ? "Unfollow" : "Following") : "Follow"}
    </motion.button>
  );
}
