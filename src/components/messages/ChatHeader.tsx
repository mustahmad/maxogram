"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import Avatar from "@/components/ui/Avatar";

interface ChatHeaderUser {
  username: string;
  displayName: string;
  avatarUrl?: string | null;
}

interface ChatHeaderProps {
  /** The other user in the conversation */
  user: ChatHeaderUser;
  /** Href for the back button */
  onBack?: string;
}

export default function ChatHeader({ user, onBack = "/messages" }: ChatHeaderProps) {
  return (
    <header
      className={cn(
        "flex items-center gap-3 border-b border-border px-4 py-3",
      )}
    >
      {/* Back button */}
      <Link
        href={onBack}
        aria-label="Back to messages"
        className={cn(
          "inline-flex h-8 w-8 items-center justify-center rounded-full",
          "text-foreground transition-colors duration-150",
          "hover:bg-muted active:bg-muted/80",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        )}
      >
        <ArrowLeft size={20} />
      </Link>

      {/* Avatar */}
      <Avatar
        src={user.avatarUrl}
        alt={user.displayName}
        size="sm"
      />

      {/* Name + Status */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold text-foreground">
          {user.displayName}
        </p>
        <p className="text-xs text-green-500">Active now</p>
      </div>
    </header>
  );
}
