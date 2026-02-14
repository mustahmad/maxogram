"use client";

import { Heart, MessageCircle, Send, Bookmark } from "lucide-react";
import { motion } from "framer-motion";
import { cn, formatNumber } from "@/lib/utils";
import type { Reel } from "@/types";

interface ReelActionsProps {
  /** Reel data */
  reel: Reel;
  /** Like toggle callback */
  onLike: () => void;
  /** Open comments callback */
  onComment: () => void;
  /** Share callback */
  onShare: () => void;
  /** Save toggle callback */
  onSave: () => void;
}

interface ActionItemProps {
  icon: React.ReactNode;
  label: string;
  count?: number;
  onClick: () => void;
}

function ActionItem({ icon, label, count, onClick }: ActionItemProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.85 }}
      className="flex flex-col items-center gap-1"
      aria-label={label}
    >
      {icon}
      {count !== undefined && (
        <span className="text-xs font-medium text-white">
          {formatNumber(count)}
        </span>
      )}
    </motion.button>
  );
}

export default function ReelActions({
  reel,
  onLike,
  onComment,
  onShare,
  onSave,
}: ReelActionsProps) {
  return (
    <div className="flex flex-col items-center gap-5">
      {/* Like */}
      <ActionItem
        icon={
          <Heart
            className={cn(
              "h-7 w-7",
              reel.isLiked
                ? "fill-red-500 text-red-500"
                : "text-white"
            )}
          />
        }
        label={reel.isLiked ? "Unlike" : "Like"}
        count={reel.likesCount}
        onClick={onLike}
      />

      {/* Comment */}
      <ActionItem
        icon={<MessageCircle className="h-7 w-7 text-white" />}
        label="Comment"
        count={reel.commentsCount}
        onClick={onComment}
      />

      {/* Share */}
      <ActionItem
        icon={<Send className="h-7 w-7 text-white" />}
        label="Share"
        onClick={onShare}
      />

      {/* Save */}
      <ActionItem
        icon={
          <Bookmark
            className={cn(
              "h-7 w-7",
              reel.isSaved
                ? "fill-white text-white"
                : "text-white"
            )}
          />
        }
        label={reel.isSaved ? "Unsave" : "Save"}
        onClick={onSave}
      />
    </div>
  );
}
