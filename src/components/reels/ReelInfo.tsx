"use client";

import { useState } from "react";
import { Music } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ReelInfoProps {
  /** Author username */
  author: string;
  /** Reel caption text */
  caption: string;
  /** Name of the audio/song used */
  audioName: string;
}

export default function ReelInfo({ author, caption, audioName }: ReelInfoProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="flex max-w-[70%] flex-col gap-2">
      {/* Username */}
      <p className="text-sm font-bold text-white">@{author}</p>

      {/* Caption */}
      <AnimatePresence initial={false}>
        <motion.button
          type="button"
          onClick={() => setIsExpanded((prev) => !prev)}
          className="text-left"
          aria-label={isExpanded ? "Collapse caption" : "Expand caption"}
        >
          <p
            className={cn(
              "text-sm text-white/90",
              !isExpanded && "line-clamp-2"
            )}
          >
            {caption}
          </p>
        </motion.button>
      </AnimatePresence>

      {/* Audio */}
      <div className="flex items-center gap-2 overflow-hidden">
        <Music className="h-3.5 w-3.5 shrink-0 text-white" aria-hidden="true" />
        <div className="overflow-hidden">
          <p
            className={cn(
              "whitespace-nowrap text-xs text-white/80",
              "animate-[marquee_8s_linear_infinite]"
            )}
            style={{
              // Inline keyframes as fallback in case the Tailwind
              // animate utility is not configured for marquee
              animation: "marquee 8s linear infinite",
            }}
          >
            {audioName}
          </p>
        </div>
      </div>
    </div>
  );
}
