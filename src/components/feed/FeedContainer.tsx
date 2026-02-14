"use client";

import { useEffect, useRef, useCallback, Fragment } from "react";
import { useFeedStore } from "@/stores/useFeedStore";
import { cn } from "@/lib/utils";
import PostCard from "@/components/feed/PostCard";
import StoriesBar from "@/components/stories/StoriesBar";
import FollowSuggestions from "@/components/shared/FollowSuggestions";
import Skeleton from "@/components/ui/Skeleton";

function PostCardSkeleton() {
  return (
    <div className="border-b border-border bg-card">
      {/* Header skeleton */}
      <div className="flex items-center gap-3 px-4 py-3">
        <Skeleton variant="circle" className="h-10 w-10" />
        <div className="flex-1 space-y-1.5">
          <Skeleton variant="text" className="h-3 w-28" />
          <Skeleton variant="text" className="h-2.5 w-16" />
        </div>
      </div>
      {/* Media skeleton */}
      <Skeleton variant="rect" className="aspect-square w-full rounded-none" />
      {/* Actions skeleton */}
      <div className="flex items-center gap-3 px-4 py-3">
        <Skeleton variant="rect" className="h-6 w-6" />
        <Skeleton variant="rect" className="h-6 w-6" />
        <Skeleton variant="rect" className="h-6 w-6" />
        <div className="flex-1" />
        <Skeleton variant="rect" className="h-6 w-6" />
      </div>
      {/* Caption skeleton */}
      <div className="space-y-1.5 px-4 pb-3">
        <Skeleton variant="text" className="h-3 w-20" />
        <Skeleton variant="text" className="h-3 w-full" />
        <Skeleton variant="text" className="h-3 w-3/4" />
      </div>
    </div>
  );
}

function StoriesBarSkeleton() {
  return (
    <div className="flex gap-4 overflow-hidden border-b border-border px-4 py-3">
      {Array.from({ length: 7 }).map((_, i) => (
        <div key={i} className="flex flex-col items-center gap-1.5">
          <Skeleton variant="circle" className="h-16 w-16" />
          <Skeleton variant="text" className="h-2.5 w-12" />
        </div>
      ))}
    </div>
  );
}

export default function FeedContainer() {
  const posts = useFeedStore((s) => s.posts);
  const isLoading = useFeedStore((s) => s.isLoading);
  const hasMore = useFeedStore((s) => s.hasMore);
  const fetchFeed = useFeedStore((s) => s.fetchFeed);
  const fetchMore = useFeedStore((s) => s.fetchMore);

  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchFeed();
  }, [fetchFeed]);

  // Infinite scroll with IntersectionObserver
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore && !isLoading) {
          fetchMore();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [hasMore, isLoading, fetchMore]);

  // Initial loading state
  if (isLoading && posts.length === 0) {
    return (
      <div>
        <StoriesBarSkeleton />
        {Array.from({ length: 3 }).map((_, i) => (
          <PostCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col")}>
      <StoriesBar />

      {posts.map((post, index) => (
        <Fragment key={post.id}>
          <PostCard post={post} />
          {/* Insert FollowSuggestions after every 5th post */}
          {(index + 1) % 5 === 0 && <FollowSuggestions />}
        </Fragment>
      ))}

      {/* Sentinel for infinite scroll */}
      <div ref={sentinelRef} className="h-1" aria-hidden="true" />

      {/* Loading more indicator */}
      {isLoading && posts.length > 0 && (
        <div className="py-4">
          <PostCardSkeleton />
        </div>
      )}

      {/* End of feed */}
      {!hasMore && posts.length > 0 && (
        <div className="py-8 text-center">
          <p className="text-sm text-muted-foreground">
            You&apos;re all caught up
          </p>
        </div>
      )}
    </div>
  );
}
