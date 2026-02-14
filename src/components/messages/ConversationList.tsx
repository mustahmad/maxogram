"use client";

import { useState, useMemo } from "react";
import { Edit } from "lucide-react";
import { cn } from "@/lib/utils";
import SearchInput from "@/components/ui/SearchInput";
import IconButton from "@/components/ui/IconButton";
import EmptyState from "@/components/ui/EmptyState";
import ConversationItem from "./ConversationItem";
import { MessageCircle } from "lucide-react";
import type { Conversation } from "@/types";

interface ConversationListProps {
  /** List of conversations to display */
  conversations: Conversation[];
  /** ID of the currently active conversation */
  activeId?: string | null;
  /** Callback when a conversation is selected */
  onSelect: (conversationId: string) => void;
}

export default function ConversationList({
  conversations,
  activeId,
  onSelect,
}: ConversationListProps) {
  const [search, setSearch] = useState("");

  const filteredConversations = useMemo(() => {
    if (!search.trim()) return conversations;

    const query = search.toLowerCase();
    return conversations.filter((conv) =>
      conv.participants.some(
        (p) =>
          p.displayName.toLowerCase().includes(query) ||
          p.username.toLowerCase().includes(query),
      ),
    );
  }, [conversations, search]);

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h1 className="text-xl font-bold text-foreground">Messages</h1>
        <IconButton aria-label="New message">
          <Edit size={20} />
        </IconButton>
      </div>

      {/* Search */}
      <div className="px-4 py-3">
        <SearchInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onClear={() => setSearch("")}
          placeholder="Search conversations..."
        />
      </div>

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length > 0 ? (
          filteredConversations.map((conversation) => (
            <ConversationItem
              key={conversation.id}
              conversation={conversation}
              isActive={conversation.id === activeId}
              onClick={() => onSelect(conversation.id)}
            />
          ))
        ) : (
          <EmptyState
            icon={MessageCircle}
            title="No conversations"
            description={
              search.trim()
                ? "No conversations match your search."
                : "Start a new conversation to get chatting."
            }
          />
        )}
      </div>
    </div>
  );
}
