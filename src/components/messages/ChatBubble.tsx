"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn, timeAgo } from "@/lib/utils";
import type { Message } from "@/types";

interface ChatBubbleProps {
  /** The message to render */
  message: Message;
  /** Whether this message was sent by the current user */
  isOwn: boolean;
}

export default function ChatBubble({ message, isOwn }: ChatBubbleProps) {
  const [showTime, setShowTime] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={cn(
        "flex w-full",
        isOwn ? "justify-end" : "justify-start",
      )}
    >
      <div
        className="max-w-[70%]"
        onMouseEnter={() => setShowTime(true)}
        onMouseLeave={() => setShowTime(false)}
        onTouchStart={() => setShowTime((v) => !v)}
      >
        <div
          className={cn(
            "inline-block break-words px-4 py-2.5 text-sm leading-relaxed",
            isOwn
              ? "bg-brand-gradient text-white rounded-2xl rounded-br-sm"
              : "bg-muted text-foreground rounded-2xl rounded-bl-sm",
          )}
        >
          {message.content}
        </div>

        {/* Timestamp on hover */}
        <motion.div
          initial={false}
          animate={{
            opacity: showTime ? 1 : 0,
            height: showTime ? "auto" : 0,
          }}
          transition={{ duration: 0.15 }}
          className={cn(
            "overflow-hidden",
            isOwn ? "text-right" : "text-left",
          )}
        >
          <span className="inline-block px-1 pt-1 text-[10px] text-muted-foreground">
            {timeAgo(message.createdAt)}
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
}
