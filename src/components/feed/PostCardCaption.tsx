"use client";

import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface PostCardCaptionProps {
  username: string;
  caption: string;
  tags: string[];
}

const MAX_CAPTION_LENGTH = 100;

export default function PostCardCaption({
  username,
  caption,
  tags,
}: PostCardCaptionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const shouldTruncate = caption.length > MAX_CAPTION_LENGTH && !isExpanded;

  const handleExpand = useCallback(() => {
    setIsExpanded(true);
  }, []);

  return (
    <div className={cn("px-4 pt-1")}>
      <p className="text-sm text-foreground">
        <Link
          href={`/${username}`}
          className="mr-1 font-semibold hover:underline"
        >
          {username}
        </Link>
        {shouldTruncate ? (
          <>
            {caption.slice(0, MAX_CAPTION_LENGTH)}
            <button
              type="button"
              onClick={handleExpand}
              className="text-muted-foreground hover:text-foreground"
            >
              ...more
            </button>
          </>
        ) : (
          caption
        )}
      </p>
      {tags.length > 0 && (
        <div className="mt-1 flex flex-wrap gap-1">
          {tags.map((tag) => (
            <Link
              key={tag}
              href={`/explore/tags/${tag}`}
              className="text-sm text-accent hover:text-accent/80"
            >
              #{tag}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
