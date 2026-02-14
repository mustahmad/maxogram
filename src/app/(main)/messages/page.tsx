"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMessageStore } from "@/stores/useMessageStore";
import ConversationList from "@/components/messages/ConversationList";
import ChatHeader from "@/components/messages/ChatHeader";
import ChatView from "@/components/messages/ChatView";
import EmptyState from "@/components/ui/EmptyState";
import Skeleton from "@/components/ui/Skeleton";

export default function MessagesPage() {
  const router = useRouter();
  const {
    conversations,
    activeConversation,
    messages,
    isLoading,
    fetchConversations,
    setActiveConversation,
    sendMessage,
  } = useMessageStore();

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Find the active conversation data for the header
  const activeConv = conversations.find((c) => c.id === activeConversation);
  const otherUser = activeConv?.participants[0];

  const handleSelectConversation = (id: string) => {
    // On mobile, navigate to the dedicated page
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      router.push(`/messages/${id}`);
      return;
    }
    setActiveConversation(id);
  };

  const handleSend = (text: string) => {
    if (activeConversation) {
      sendMessage(activeConversation, text);
    }
  };

  // Loading state
  if (isLoading && conversations.length === 0) {
    return (
      <div className="mx-auto flex h-full max-w-4xl">
        <div className="w-full border-r border-border lg:w-80">
          <div className="border-b border-border px-4 py-3">
            <Skeleton variant="text" className="h-7 w-28" />
          </div>
          <div className="px-4 py-3">
            <Skeleton variant="rect" className="h-10 w-full rounded-xl" />
          </div>
          <div className="flex flex-col gap-1 px-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 py-3">
                <Skeleton variant="circle" className="h-10 w-10" />
                <div className="flex-1 space-y-2">
                  <Skeleton variant="text" className="h-4 w-24" />
                  <Skeleton variant="text" className="h-3 w-40" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-4rem)] max-w-4xl lg:h-screen">
      {/* Conversation list - always visible on desktop, only on mobile when no active */}
      <div
        className={cn(
          "h-full border-r border-border",
          "w-full lg:w-80 lg:block",
        )}
      >
        <ConversationList
          conversations={conversations}
          activeId={activeConversation}
          onSelect={handleSelectConversation}
        />
      </div>

      {/* Chat area - desktop only */}
      <div className="hidden flex-1 lg:flex lg:flex-col">
        {activeConversation && otherUser ? (
          <>
            <ChatHeader
              user={{
                username: otherUser.username,
                displayName: otherUser.displayName,
                avatarUrl: otherUser.avatarUrl,
              }}
              onBack="/messages"
            />
            <div className="flex-1 overflow-hidden">
              <ChatView
                conversationId={activeConversation}
                messages={messages}
                currentUserId="self"
                isLoading={isLoading}
                onSend={handleSend}
              />
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <EmptyState
              icon={MessageCircle}
              title="Your messages"
              description="Select a conversation to start chatting."
            />
          </div>
        )}
      </div>
    </div>
  );
}
