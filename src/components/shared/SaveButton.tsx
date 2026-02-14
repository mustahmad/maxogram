"use client";

import { Bookmark } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SaveButtonProps {
  isSaved: boolean;
  onToggle: () => void;
}

export default function SaveButton({ isSaved, onToggle }: SaveButtonProps) {
  return (
    <motion.button
      type="button"
      onClick={onToggle}
      whileTap={{ scale: 1.2 }}
      transition={{ type: "spring", stiffness: 400, damping: 15 }}
      className={cn(
        "inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full p-2 transition-colors",
        "hover:text-muted-foreground/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      )}
      aria-label={isSaved ? "Unsave" : "Save"}
    >
      <Bookmark
        size={24}
        className={cn(
          "transition-colors duration-150",
          isSaved
            ? "fill-foreground text-foreground"
            : "fill-none text-foreground"
        )}
      />
    </motion.button>
  );
}
