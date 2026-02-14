"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CategoryPillsProps {
  /** List of category labels */
  categories: string[];
  /** Currently active category */
  active: string;
  /** Callback when a category is selected */
  onSelect: (category: string) => void;
}

export default function CategoryPills({
  categories,
  active,
  onSelect,
}: CategoryPillsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={scrollRef}
      className="scrollbar-hide flex gap-2 overflow-x-auto py-2"
      role="tablist"
      aria-label="Category filters"
    >
      {categories.map((category) => {
        const isActive = category === active;

        return (
          <motion.button
            key={category}
            type="button"
            role="tab"
            aria-selected={isActive}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(category)}
            className={cn(
              "shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              isActive
                ? "bg-brand-gradient text-white"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </motion.button>
        );
      })}
    </div>
  );
}
