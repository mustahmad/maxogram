"use client";

import { useCallback } from "react";
import { motion } from "framer-motion";
import { cn, formatNumber } from "@/lib/utils";
import { useFeedStore } from "@/stores/useFeedStore";
import PostCardHeader from "@/components/feed/PostCardHeader";
import PostCardMedia from "@/components/feed/PostCardMedia";
import PostCardActions from "@/components/feed/PostCardActions";
import PostCardCaption from "@/components/feed/PostCardCaption";
import PostCardComments from "@/components/feed/PostCardComments";
import CommentInput from "@/components/feed/CommentInput";
import type { Post, Comment } from "@/types";

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const likePost = useFeedStore((s) => s.likePost);
  const savePost = useFeedStore((s) => s.savePost);
  const addComment = useFeedStore((s) => s.addComment);

  const handleLike = useCallback(() => {
    likePost(post.id);
  }, [likePost, post.id]);

  const handleDoubleTapLike = useCallback(() => {
    if (!post.isLiked) {
      likePost(post.id);
    }
  }, [likePost, post.id, post.isLiked]);

  const handleSave = useCallback(() => {
    savePost(post.id);
  }, [savePost, post.id]);

  const handleComment = useCallback(() => {
    // Focus the comment input — the CommentInput component handles the UX
  }, []);

  const handleShare = useCallback(() => {
    if (navigator.share) {
      navigator.share({
        title: `Post by ${post.author.username}`,
        url: `/p/${post.id}`,
      }).catch(() => {});
    }
  }, [post.author.username, post.id]);

  const handleMenuClick = useCallback(() => {
    // Post menu actions (report, copy link, etc.)
  }, []);

  const handleCommentSubmit = useCallback(
    (text: string) => {
      addComment(post.id, text);
    },
    [addComment, post.id]
  );

  // Build preview comments from the post data
  const previewComments: Comment[] = (post as Post & { comments?: Comment[] }).comments?.slice(-2) ?? [];

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn(
        "border-b border-border bg-card"
      )}
    >
      <PostCardHeader
        author={post.author}
        createdAt={post.createdAt}
        onMenuClick={handleMenuClick}
      />

      <PostCardMedia
        media={post.media}
        type={post.type}
        onDoubleTap={handleDoubleTapLike}
      />

      <PostCardActions
        isLiked={post.isLiked}
        isSaved={post.isSaved}
        likesCount={post.likesCount}
        onLike={handleLike}
        onSave={handleSave}
        onComment={handleComment}
        onShare={handleShare}
      />

      {post.likesCount > 0 && (
        <p className="px-4 pt-1 text-sm font-semibold text-foreground">
          {formatNumber(post.likesCount)} likes
        </p>
      )}

      {post.caption && (
        <PostCardCaption
          username={post.author.username}
          caption={post.caption}
          tags={post.tags}
        />
      )}

      <PostCardComments
        commentsCount={post.commentsCount}
        previewComments={previewComments}
      />

      <CommentInput onSubmit={handleCommentSubmit} />
    </motion.article>
  );
}
