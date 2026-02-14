"use client";

import Link from "next/link";
import { cn, formatNumber } from "@/lib/utils";
import type { Comment } from "@/types";

interface PostCardCommentsProps {
  commentsCount: number;
  previewComments: Comment[];
}

export default function PostCardComments({
  commentsCount,
  previewComments,
}: PostCardCommentsProps) {
  const displayComments = previewComments.slice(0, 2);

  if (commentsCount === 0 && displayComments.length === 0) {
    return null;
  }

  return (
    <div className={cn("px-4 pt-1")}>
      {commentsCount > 0 && (
        <button
          type="button"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          View all {formatNumber(commentsCount)} comments
        </button>
      )}
      {displayComments.map((comment) => (
        <p key={comment.id} className="mt-0.5 text-sm text-foreground">
          <Link
            href={`/${comment.author.username}`}
            className="mr-1 font-semibold hover:underline"
          >
            {comment.author.username}
          </Link>
          {comment.content}
        </p>
      ))}
    </div>
  );
}
