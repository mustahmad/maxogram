"use client";

import { cn, formatNumber } from "@/lib/utils";

interface ProfileStatsProps {
  postsCount: number;
  followersCount: number;
  followingCount: number;
  onFollowersClick?: () => void;
  onFollowingClick?: () => void;
}

interface StatItemProps {
  value: number;
  label: string;
  onClick?: () => void;
}

function StatItem({ value, label, onClick }: StatItemProps) {
  const content = (
    <>
      <span className="text-lg font-bold text-foreground">
        {formatNumber(value)}
      </span>
      <span className="text-sm text-muted-foreground">{label}</span>
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "flex flex-col items-center gap-0.5 transition-opacity hover:opacity-70",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent rounded-lg px-2 py-1",
        )}
      >
        {content}
      </button>
    );
  }

  return (
    <div className="flex flex-col items-center gap-0.5 px-2 py-1">
      {content}
    </div>
  );
}

export default function ProfileStats({
  postsCount,
  followersCount,
  followingCount,
  onFollowersClick,
  onFollowingClick,
}: ProfileStatsProps) {
  return (
    <div className="flex items-center gap-6">
      <StatItem value={postsCount} label="posts" />
      <StatItem
        value={followersCount}
        label="followers"
        onClick={onFollowersClick}
      />
      <StatItem
        value={followingCount}
        label="following"
        onClick={onFollowingClick}
      />
    </div>
  );
}
