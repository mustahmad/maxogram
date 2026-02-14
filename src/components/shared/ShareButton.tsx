"use client";

import { Send } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ShareButtonProps {
  onShare: () => void;
}

export default function ShareButton({ onShare }: ShareButtonProps) {
  return (
    <motion.button
      type="button"
      onClick={onShare}
      whileTap={{ scale: 1.2 }}
      transition={{ type: "spring", stiffness: 400, damping: 15 }}
      className={cn(
        "inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full p-2 transition-colors",
        "text-foreground hover:text-muted-foreground/80",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      )}
      aria-label="Share"
    >
      <Send size={24} className="transition-colors duration-150" />
    </motion.button>
  );
}
