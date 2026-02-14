"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Heart, MessageCircle, Film } from "lucide-react";
import { cn, formatNumber } from "@/lib/utils";
import type { Post } from "@/types";

interface ProfilePostsGridProps {
  posts: Post[];
  onPostClick: (post: Post) => void;
}

function PostThumbnail({
  post,
  onPostClick,
  index,
}: {
  post: Post;
  onPostClick: (post: Post) => void;
  index: number;
}) {
  const [isHovered, setIsHovered] = useState(false);

  const thumbnailUrl =
    post.media[0]?.thumbnailUrl || post.media[0]?.url || "";
  const isVideo = post.type === "video" || post.media[0]?.type === "video";

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2, delay: index * 0.03 }}
      onClick={() => onPostClick(post)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "group relative aspect-square w-full overflow-hidden bg-muted",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
      )}
      aria-label={`Post by ${post.author.username}: ${post.caption?.slice(0, 50) || "No caption"}`}
    >
      {/* Thumbnail image */}
      {thumbnailUrl ? (
        <Image
          src={thumbnailUrl}
          alt=""
          fill
          className="object-cover"
          sizes="(max-width: 768px) 33vw, 300px"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-muted">
          <Film size={24} className="text-muted-foreground" />
        </div>
      )}

      {/* Video indicator */}
      {isVideo && (
        <div className="absolute right-2 top-2 z-10">
          <Film size={16} className="text-white drop-shadow-md" />
        </div>
      )}

      {/* Carousel indicator */}
      {post.media.length > 1 && (
        <div className="absolute right-2 top-2 z-10">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="white"
            className="drop-shadow-md"
          >
            <path d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zm-7 14H5V5h7v12z" />
          </svg>
        </div>
      )}

      {/* Hover overlay */}
      <div
        className={cn(
          "absolute inset-0 flex items-center justify-center gap-5 bg-black/40 transition-opacity duration-200",
          isHovered ? "opacity-100" : "opacity-0",
        )}
      >
        <div className="flex items-center gap-1.5 text-white">
          <Heart size={18} fill="white" />
          <span className="text-sm font-bold">
            {formatNumber(post.likesCount)}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-white">
          <MessageCircle size={18} fill="white" />
          <span className="text-sm font-bold">
            {formatNumber(post.commentsCount)}
          </span>
        </div>
      </div>
    </motion.button>
  );
}

export default function ProfilePostsGrid({
  posts,
  onPostClick,
}: ProfilePostsGridProps) {
  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 rounded-full border-2 border-foreground p-6">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="M21 15l-5-5L5 21" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-foreground">No Posts Yet</h3>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-0.5 sm:gap-1">
      {posts.map((post, index) => (
        <PostThumbnail
          key={post.id}
          post={post}
          onPostClick={onPostClick}
          index={index}
        />
      ))}
    </div>
  );
}
