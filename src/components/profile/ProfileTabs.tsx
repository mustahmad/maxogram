"use client";

import { Grid3x3, Film, Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";

export type ProfileTab = "posts" | "reels" | "saved";

interface ProfileTabsProps {
  activeTab: ProfileTab;
  onTabChange: (tab: ProfileTab) => void;
  isOwnProfile?: boolean;
}

interface TabConfig {
  id: ProfileTab;
  label: string;
  icon: typeof Grid3x3;
  ownOnly?: boolean;
}

const tabs: TabConfig[] = [
  { id: "posts", label: "Posts", icon: Grid3x3 },
  { id: "reels", label: "Reels", icon: Film },
  { id: "saved", label: "Saved", icon: Bookmark, ownOnly: true },
];

export default function ProfileTabs({
  activeTab,
  onTabChange,
  isOwnProfile = false,
}: ProfileTabsProps) {
  const visibleTabs = tabs.filter((tab) => !tab.ownOnly || isOwnProfile);

  return (
    <div className="border-t border-border">
      <div className="flex items-center justify-center">
        {visibleTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "relative flex items-center justify-center gap-1.5 px-6 py-3 text-xs font-semibold uppercase tracking-wider transition-colors",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
                isActive
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground/70",
              )}
              aria-selected={isActive}
              role="tab"
            >
              <Icon size={14} aria-hidden="true" />
              <span className="hidden sm:inline">{tab.label}</span>

              {/* Active indicator */}
              {isActive && (
                <span className="absolute inset-x-0 -top-px h-0.5 bg-foreground" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
