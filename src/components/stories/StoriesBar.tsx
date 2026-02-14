"use client";

import { useEffect } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useStoryStore } from "@/stores/useStoryStore";
import { useAuthStore } from "@/stores/useAuthStore";
import Avatar from "@/components/ui/Avatar";
import StoryBubble from "@/components/stories/StoryBubble";
import StoryViewer from "@/components/stories/StoryViewer";

export default function StoriesBar() {
  const storyGroups = useStoryStore((s) => s.storyGroups);
  const fetchStories = useStoryStore((s) => s.fetchStories);
  const openViewer = useStoryStore((s) => s.openViewer);
  const isViewerOpen = useStoryStore((s) => s.isViewerOpen);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    fetchStories();
  }, [fetchStories]);

  return (
    <>
      <div
        className={cn(
          "flex gap-4 overflow-x-auto border-b border-border px-4 py-3 scrollbar-hide"
        )}
        role="list"
        aria-label="Stories"
      >
        {/* Your Story */}
        <div className="flex flex-col items-center gap-1" role="listitem">
          <div className="relative">
            <Avatar
              src={user?.avatarUrl}
              alt={user?.displayName ?? "Your Story"}
              size="lg"
            />
            <div
              className={cn(
                "absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center",
                "rounded-full border-2 border-background bg-accent text-white"
              )}
            >
              <Plus size={12} strokeWidth={3} />
            </div>
          </div>
          <span className="w-16 truncate text-center text-xs text-foreground">
            Your Story
          </span>
        </div>

        {/* Other stories */}
        {storyGroups.map((group, index) => (
          <div key={group.user.id} role="listitem">
            <StoryBubble
              user={group.user}
              hasUnviewed={group.hasUnviewed}
              onClick={() => openViewer(index)}
            />
          </div>
        ))}
      </div>

      {/* Story viewer overlay */}
      {isViewerOpen && <StoryViewer />}
    </>
  );
}
