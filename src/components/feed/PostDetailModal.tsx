"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, BadgeCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn, formatNumber, timeAgo } from "@/lib/utils";
import { useFeedStore } from "@/stores/useFeedStore";
import Avatar from "@/components/ui/Avatar";
import LikeButton from "@/components/shared/LikeButton";
import CommentButton from "@/components/shared/CommentButton";
import ShareButton from "@/components/shared/ShareButton";
import SaveButton from "@/components/shared/SaveButton";
import CommentInput from "@/components/feed/CommentInput";
import ImageCarousel from "@/components/shared/ImageCarousel";
import VideoPlayer from "@/components/shared/VideoPlayer";
import TimeAgo from "@/components/shared/TimeAgo";
import type { Post, Comment } from "@/types";

interface PostDetailModalProps {
  post: Post | null;
  isOpen: boolean;
  onClose: () => void;
}

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
} as const;

const contentVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 8 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", damping: 25, stiffness: 350 },
  },
  exit: { opacity: 0, scale: 0.95, y: 8, transition: { duration: 0.15 } },
} as const;

export default function PostDetailModal({
  post,
  isOpen,
  onClose,
}: PostDetailModalProps) {
  const likePost = useFeedStore((s) => s.likePost);
  const savePost = useFeedStore((s) => s.savePost);
  const addComment = useFeedStore((s) => s.addComment);

  const [replyTo, setReplyTo] = useState<string | null>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  const handleLike = useCallback(() => {
    if (post) likePost(post.id);
  }, [likePost, post]);

  const handleSave = useCallback(() => {
    if (post) savePost(post.id);
  }, [savePost, post]);

  const handleShare = useCallback(() => {
    if (post && navigator.share) {
      navigator.share({
        title: `Post by ${post.author.username}`,
        url: `/p/${post.id}`,
      }).catch(() => {});
    }
  }, [post]);

  const handleCommentSubmit = useCallback(
    (text: string) => {
      if (!post) return;
      const content = replyTo ? `@${replyTo} ${text}` : text;
      addComment(post.id, content);
      setReplyTo(null);
    },
    [addComment, post, replyTo]
  );

  if (typeof document === "undefined") return null;

  const comments: Comment[] = post
    ? ((post as Post & { comments?: Comment[] }).comments ?? [])
    : [];

  const renderMedia = () => {
    if (!post || post.type === "text" || post.media.length === 0) {
      return (
        <div className="flex aspect-square items-center justify-center bg-muted">
          <p className="text-muted-foreground">No media</p>
        </div>
      );
    }

    if (post.type === "video" && post.media[0]) {
      return (
        <VideoPlayer
          src={post.media[0].url}
          poster={post.media[0].thumbnailUrl}
          className="aspect-square w-full"
        />
      );
    }

    if (post.type === "carousel" && post.media.length > 1) {
      return (
        <ImageCarousel
          images={post.media.map((m) => ({
            url: m.url,
            width: m.width,
            height: m.height,
          }))}
        />
      );
    }

    const image = post.media[0];
    if (!image) return null;

    return (
      <Image
        src={image.url}
        alt="Post"
        width={image.width}
        height={image.height}
        className="h-full w-full object-cover"
        draggable={false}
      />
    );
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && post && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/70"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.2 }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className={cn(
              "absolute right-4 top-4 z-20 rounded-full p-2 text-white",
              "transition-colors hover:bg-white/20",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            )}
            aria-label="Close"
          >
            <X size={24} />
          </button>

          {/* Content */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Post detail"
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={cn(
              "relative z-10 flex w-full max-w-5xl overflow-hidden rounded-xl border border-border bg-card shadow-2xl",
              "max-h-[90vh]",
              // Desktop: side by side. Mobile: stacked.
              "flex-col md:flex-row"
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Media side */}
            <div className="flex aspect-square items-center justify-center bg-black md:w-1/2 lg:w-[55%]">
              {renderMedia()}
            </div>

            {/* Comments side */}
            <div className="flex flex-1 flex-col md:w-1/2 lg:w-[45%]">
              {/* Header */}
              <div className="flex items-center gap-3 border-b border-border px-4 py-3">
                <Avatar
                  src={post.author.avatarUrl}
                  alt={post.author.displayName}
                  size="md"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1">
                    <span className="truncate text-sm font-semibold text-foreground">
                      {post.author.username}
                    </span>
                    {post.author.isVerified && (
                      <BadgeCheck
                        size={14}
                        className="shrink-0 fill-blue-500 text-white"
                        aria-label="Verified"
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Comments list */}
              <div className="flex-1 overflow-y-auto px-4 py-3">
                {/* Caption as first "comment" */}
                {post.caption && (
                  <div className="mb-4 flex gap-3">
                    <Avatar
                      src={post.author.avatarUrl}
                      alt={post.author.displayName}
                      size="sm"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-foreground">
                        <Link
                          href={`/${post.author.username}`}
                          className="mr-1 font-semibold hover:underline"
                        >
                          {post.author.username}
                        </Link>
                        {post.caption}
                      </p>
                      <TimeAgo date={post.createdAt} />
                    </div>
                  </div>
                )}

                {/* All comments */}
                {comments.map((comment) => (
                  <div key={comment.id} className="mb-3 flex gap-3">
                    <Avatar
                      src={comment.author.avatarUrl}
                      alt={comment.author.displayName}
                      size="sm"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-foreground">
                        <Link
                          href={`/${comment.author.username}`}
                          className="mr-1 font-semibold hover:underline"
                        >
                          {comment.author.username}
                        </Link>
                        {comment.content}
                      </p>
                      <div className="mt-1 flex items-center gap-3">
                        <TimeAgo date={comment.createdAt} />
                        {comment.likesCount > 0 && (
                          <span className="text-xs text-muted-foreground">
                            {formatNumber(comment.likesCount)} likes
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => setReplyTo(comment.author.username)}
                          className="text-xs font-semibold text-muted-foreground hover:text-foreground"
                        >
                          Reply
                        </button>
                      </div>
                    </div>
                    <LikeButton
                      isLiked={comment.isLiked}
                      onToggle={() => {}}
                      size="sm"
                    />
                  </div>
                ))}

                {comments.length === 0 && !post.caption && (
                  <div className="flex h-full flex-col items-center justify-center py-8">
                    <p className="text-lg font-semibold text-foreground">
                      No comments yet.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Start the conversation.
                    </p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="border-t border-border">
                <div className="flex items-center justify-between px-4 pt-2">
                  <div className="flex items-center gap-1">
                    <LikeButton isLiked={post.isLiked} onToggle={handleLike} />
                    <CommentButton onClick={() => {}} />
                    <ShareButton onShare={handleShare} />
                  </div>
                  <SaveButton isSaved={post.isSaved} onToggle={handleSave} />
                </div>
                {post.likesCount > 0 && (
                  <p className="px-4 pt-1 text-sm font-semibold text-foreground">
                    {formatNumber(post.likesCount)} likes
                  </p>
                )}
                <p className="px-4 pb-2 pt-0.5">
                  <TimeAgo date={post.createdAt} />
                </p>
              </div>

              {/* Comment input */}
              <CommentInput onSubmit={handleCommentSubmit} />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
