"use client";

import { type ReactNode } from "react";
import Avatar from "@/components/ui/Avatar";
import { cn } from "@/lib/utils";
import type { User } from "@/types";

interface UserListItemProps {
  user: Pick<User, "id" | "username" | "displayName" | "avatarUrl">;
  action?: ReactNode;
}

export default function UserListItem({ user, action }: UserListItemProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 px-4 py-2"
      )}
    >
      <Avatar
        src={user.avatarUrl}
        alt={user.displayName}
        size="md"
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-foreground">
          {user.username}
        </p>
        <p className="truncate text-sm text-muted-foreground">
          {user.displayName}
        </p>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
