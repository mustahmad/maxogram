"use client";

import Image from "next/image";
import { Film, Heart, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { cn, formatNumber } from "@/lib/utils";
import type { Post } from "@/types";

interface ExploreCardProps {
  /** Post data to display */
  post: Post;
  /** Callback when the card is clicked */
  onClick: () => void;
}

export default function ExploreCard({ post, onClick }: ExploreCardProps) {
  const thumbnailUrl =
    post.media[0]?.thumbnailUrl || post.media[0]?.url || "";
  const isVideo = post.type === "video";

  return (
    <motion.button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative aspect-square w-full overflow-hidden rounded-sm",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      )}
      whileTap={{ scale: 0.98 }}
    >
      {/* Thumbnail */}
      {thumbnailUrl && (
        <Image
          src={thumbnailUrl}
          alt={post.caption || "Post thumbnail"}
          fill
          sizes="(max-width: 640px) 33vw, (max-width: 1024px) 25vw, 20vw"
          className="object-cover"
          draggable={false}
        />
      )}

      {/* Video indicator */}
      {isVideo && (
        <div className="absolute right-2 top-2 z-10">
          <Film className="h-5 w-5 text-white drop-shadow-md" aria-hidden="true" />
        </div>
      )}

      {/* Hover overlay (desktop) */}
      <div
        className={cn(
          "absolute inset-0 flex items-center justify-center gap-4",
          "bg-black/40 opacity-0 transition-opacity duration-200",
          "group-hover:opacity-100"
        )}
        aria-hidden="true"
      >
        <span className="flex items-center gap-1.5 text-sm font-bold text-white">
          <Heart className="h-5 w-5 fill-white" />
          {formatNumber(post.likesCount)}
        </span>
        <span className="flex items-center gap-1.5 text-sm font-bold text-white">
          <MessageCircle className="h-5 w-5 fill-white" />
          {formatNumber(post.commentsCount)}
        </span>
      </div>
    </motion.button>
  );
}
