"use client";

import { cn } from "@/lib/utils";
import type { Post } from "@/types";
import ExploreCard from "./ExploreCard";

interface ExploreGridProps {
  /** Array of posts to display */
  posts: Post[];
  /** Callback when a post is clicked */
  onPostClick: (post: Post) => void;
}

/**
 * CSS grid layout for the explore page.
 *
 * Uses a repeating 9-item pattern where positions 3 and 6
 * (within each group of 9) span 2 rows to create visual
 * variety similar to Instagram's Explore grid.
 */
export default function ExploreGrid({ posts, onPostClick }: ExploreGridProps) {
  return (
    <div
      className="grid grid-cols-3 gap-0.5"
      role="list"
      aria-label="Explore posts"
    >
      {posts.map((post, index) => {
        // Within each group of 9 items, positions 2 and 5 (0-indexed)
        // correspond to the 3rd and 6th items which are tall.
        const positionInGroup = index % 9;
        const isTall = positionInGroup === 2 || positionInGroup === 5;

        return (
          <div
            key={post.id}
            role="listitem"
            className={cn(isTall && "row-span-2")}
          >
            <ExploreCard
              post={post}
              onClick={() => onPostClick(post)}
            />
          </div>
        );
      })}
    </div>
  );
}
