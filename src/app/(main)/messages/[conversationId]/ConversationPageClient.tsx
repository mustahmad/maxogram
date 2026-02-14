"use client";

import { useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { useMessageStore } from "@/stores/useMessageStore";
import ChatHeader from "@/components/messages/ChatHeader";
import ChatView from "@/components/messages/ChatView";
import Skeleton from "@/components/ui/Skeleton";

export default function ConversationPageClient() {
  const params = useParams<{ conversationId: string }>();
  const conversationId = params.conversationId;

  const {
    conversations,
    messages,
    isLoading,
    fetchConversations,
    fetchMessages,
    sendMessage,
  } = useMessageStore();

  useEffect(() => {
    if (conversations.length === 0) {
      fetchConversations();
    }
  }, [conversations.length, fetchConversations]);

  useEffect(() => {
    if (conversationId) {
      fetchMessages(conversationId);
    }
  }, [conversationId, fetchMessages]);

  const conversation = useMemo(
    () => conversations.find((c) => c.id === conversationId),
    [conversations, conversationId],
  );

  const otherUser = conversation?.participants[0];

  const handleSend = (text: string) => {
    if (conversationId) {
      sendMessage(conversationId, text);
    }
  };

  // Loading skeleton
  if (isLoading && !otherUser) {
    return (
      <div className="flex h-[calc(100dvh-4rem)] flex-col lg:h-dvh">
        {/* Header skeleton */}
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <Skeleton variant="circle" className="h-8 w-8" />
          <Skeleton variant="circle" className="h-8 w-8" />
          <div className="space-y-1.5">
            <Skeleton variant="text" className="h-4 w-24" />
            <Skeleton variant="text" className="h-3 w-16" />
          </div>
        </div>

        {/* Messages skeleton */}
        <div className="flex flex-1 flex-col gap-3 overflow-hidden px-4 py-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"}`}
            >
              <Skeleton
                variant="rect"
                className={`h-10 rounded-2xl ${i % 2 === 0 ? "w-48" : "w-36"}`}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100dvh-4rem)] flex-col lg:h-dvh">
      {/* Header */}
      {otherUser && (
        <ChatHeader
          user={{
            username: otherUser.username,
            displayName: otherUser.displayName,
            avatarUrl: otherUser.avatarUrl,
          }}
          onBack="/messages"
        />
      )}

      {/* Chat view */}
      <div className="flex-1 overflow-hidden">
        <ChatView
          conversationId={conversationId}
          messages={messages}
          currentUserId="self"
          isLoading={isLoading}
          onSend={handleSend}
        />
      </div>
    </div>
  );
}
