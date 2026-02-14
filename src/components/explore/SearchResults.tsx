"use client";

import { SearchX } from "lucide-react";
import { cn } from "@/lib/utils";
import EmptyState from "@/components/ui/EmptyState";
import UserListItem from "@/components/shared/UserListItem";
import type { User } from "@/types";

interface SearchResultsProps {
  /** List of users matching the search */
  users: User[];
  /** Current search query */
  query: string;
  /** Additional CSS classes */
  className?: string;
}

export default function SearchResults({
  users,
  query,
  className,
}: SearchResultsProps) {
  if (users.length === 0) {
    return (
      <EmptyState
        icon={SearchX}
        title="No results found"
        description={`No users match "${query}". Try a different search.`}
        className={className}
      />
    );
  }

  return (
    <div className={cn("flex flex-col", className)} role="list" aria-label="Search results">
      {users.map((user) => (
        <div key={user.id} role="listitem">
          <UserListItem user={user} />
        </div>
      ))}
    </div>
  );
}
