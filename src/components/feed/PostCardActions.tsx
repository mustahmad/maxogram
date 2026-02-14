"use client";

import LikeButton from "@/components/shared/LikeButton";
import CommentButton from "@/components/shared/CommentButton";
import ShareButton from "@/components/shared/ShareButton";
import SaveButton from "@/components/shared/SaveButton";
import { cn } from "@/lib/utils";

interface PostCardActionsProps {
  isLiked: boolean;
  isSaved: boolean;
  likesCount: number;
  onLike: () => void;
  onSave: () => void;
  onComment: () => void;
  onShare: () => void;
}

export default function PostCardActions({
  isLiked,
  isSaved,
  likesCount,
  onLike,
  onSave,
  onComment,
  onShare,
}: PostCardActionsProps) {
  return (
    <div className={cn("flex items-center justify-between px-4 pt-2")}>
      <div className="flex items-center gap-1">
        <LikeButton isLiked={isLiked} onToggle={onLike} />
        <CommentButton onClick={onComment} />
        <ShareButton onShare={onShare} />
      </div>
      <SaveButton isSaved={isSaved} onToggle={onSave} />
    </div>
  );
}
