"use client";

import { useEffect, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import ChatBubble from "./ChatBubble";
import ChatInput from "./ChatInput";
import Skeleton from "@/components/ui/Skeleton";
import type { Message } from "@/types";

interface ChatViewProps {
  /** The active conversation ID */
  conversationId: string;
  /** Messages to display */
  messages: Message[];
  /** The current user's ID (to determine own messages) */
  currentUserId: string;
  /** Whether messages are loading */
  isLoading?: boolean;
  /** Callback to send a message */
  onSend?: (text: string) => void;
}

/** Group messages by calendar date */
function groupMessagesByDate(
  messages: Message[],
): { date: string; messages: Message[] }[] {
  const groups: Map<string, Message[]> = new Map();

  for (const msg of messages) {
    const dateKey = new Date(msg.createdAt).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });

    if (!groups.has(dateKey)) {
      groups.set(dateKey, []);
    }
    groups.get(dateKey)!.push(msg);
  }

  return Array.from(groups.entries()).map(([date, msgs]) => ({
    date,
    messages: msgs,
  }));
}

export default function ChatView({
  conversationId,
  messages,
  currentUserId,
  isLoading = false,
  onSend,
}: ChatViewProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const groupedMessages = useMemo(
    () => groupMessagesByDate(messages),
    [messages],
  );

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages.length]);

  const handleSend = (text: string) => {
    onSend?.(text);
  };

  return (
    <div className="flex h-full flex-col">
      {/* Scrollable message area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-4"
      >
        {isLoading ? (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "flex",
                  i % 2 === 0 ? "justify-start" : "justify-end",
                )}
              >
                <Skeleton
                  variant="rect"
                  className={cn(
                    "h-10 rounded-2xl",
                    i % 2 === 0 ? "w-48" : "w-36",
                  )}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            {groupedMessages.map((group) => (
              <div key={group.date} className="flex flex-col gap-1">
                {/* Date separator */}
                <div className="flex items-center justify-center py-4">
                  <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                    {group.date}
                  </span>
                </div>

                {/* Messages */}
                {group.messages.map((msg) => (
                  <ChatBubble
                    key={msg.id}
                    message={msg}
                    isOwn={msg.senderId === currentUserId}
                  />
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Input bar */}
      <ChatInput onSend={handleSend} />
    </div>
  );
}
