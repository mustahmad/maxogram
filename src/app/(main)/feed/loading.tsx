"use client";

import Skeleton from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";

function StoriesSkeleton() {
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

function PostCardSkeleton() {
  return (
    <div className="border-b border-border bg-card">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3">
        <Skeleton variant="circle" className="h-10 w-10" />
        <div className="flex-1 space-y-1.5">
          <Skeleton variant="text" className="h-3 w-28" />
          <Skeleton variant="text" className="h-2.5 w-16" />
        </div>
      </div>
      {/* Media */}
      <Skeleton variant="rect" className="aspect-square w-full rounded-none" />
      {/* Actions */}
      <div className="flex items-center gap-3 px-4 py-3">
        <Skeleton variant="rect" className="h-6 w-6" />
        <Skeleton variant="rect" className="h-6 w-6" />
        <Skeleton variant="rect" className="h-6 w-6" />
        <div className="flex-1" />
        <Skeleton variant="rect" className="h-6 w-6" />
      </div>
      {/* Caption */}
      <div className="space-y-1.5 px-4 pb-3">
        <Skeleton variant="text" className="h-3 w-20" />
        <Skeleton variant="text" className="h-3 w-full" />
        <Skeleton variant="text" className="h-3 w-3/4" />
      </div>
    </div>
  );
}

export default function FeedLoading() {
  return (
    <div className={cn("mx-auto w-full max-w-[630px]")}>
      <StoriesSkeleton />
      {Array.from({ length: 3 }).map((_, i) => (
        <PostCardSkeleton key={i} />
      ))}
    </div>
  );
}
