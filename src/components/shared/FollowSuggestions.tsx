"use client";

import { useEffect, useState, useCallback } from "react";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import type { User } from "@/types";

type SuggestedUser = Pick<
  User,
  "id" | "username" | "displayName" | "avatarUrl"
>;

export default function FollowSuggestions() {
  const [suggestions, setSuggestions] = useState<SuggestedUser[]>([]);
  const [following, setFollowing] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const res = await fetch("/api/recommendations");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setSuggestions((data.users ?? data.recommendations ?? []).slice(0, 5));
      } catch {
        // Suggestions are non-critical; silently fail
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuggestions();
  }, []);

  const handleFollow = useCallback(async (userId: string) => {
    setFollowing((prev) => {
      const next = new Set(prev);
      if (next.has(userId)) {
        next.delete(userId);
      } else {
        next.add(userId);
      }
      return next;
    });
  }, []);

  if (isLoading) {
    return (
      <div className="py-4">
        <div className="mb-3 flex items-center justify-between px-4">
          <div className="h-4 w-32 animate-pulse rounded bg-muted" />
          <div className="h-4 w-16 animate-pulse rounded bg-muted" />
        </div>
        <div className="flex gap-3 overflow-x-auto px-4 scrollbar-hide">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-48 min-w-[150px] animate-pulse rounded-xl bg-muted"
            />
          ))}
        </div>
      </div>
    );
  }

  if (suggestions.length === 0) return null;

  return (
    <div className="py-4">
      <div className="mb-3 flex items-center justify-between px-4">
        <h3 className="text-sm font-semibold text-foreground">
          Suggested for you
        </h3>
        <button
          type="button"
          className="text-xs font-semibold text-accent hover:text-accent/80"
        >
          See All
        </button>
      </div>
      <div className="flex gap-3 overflow-x-auto px-4 scrollbar-hide">
        {suggestions.map((user) => {
          const isFollowing = following.has(user.id);
          return (
            <div
              key={user.id}
              className={cn(
                "flex min-w-[150px] flex-col items-center gap-2 rounded-xl border border-border bg-card p-4"
              )}
            >
              <Avatar
                src={user.avatarUrl}
                alt={user.displayName}
                size="lg"
              />
              <p className="w-full truncate text-center text-sm font-semibold text-foreground">
                {user.username}
              </p>
              <p className="w-full truncate text-center text-xs text-muted-foreground">
                {user.displayName}
              </p>
              <Button
                variant={isFollowing ? "secondary" : "primary"}
                size="sm"
                fullWidth
                onClick={() => handleFollow(user.id)}
              >
                {isFollowing ? "Following" : "Follow"}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
