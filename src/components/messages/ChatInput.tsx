"use client";

import { useState, useRef, type FormEvent, type KeyboardEvent } from "react";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  /** Callback when a message is sent */
  onSend: (text: string) => void;
}

export default function ChatInput({ onSend }: ChatInputProps) {
  const [text, setText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e?: FormEvent) => {
    e?.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;

    onSend(trimmed);
    setText("");
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const isEmpty = text.trim().length === 0;

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 border-t border-border px-4 py-3"
    >
      <input
        ref={inputRef}
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Message..."
        aria-label="Type a message"
        className={cn(
          "flex-1 rounded-full bg-muted px-4 py-2.5 text-sm text-foreground",
          "placeholder:text-muted-foreground",
          "transition-colors duration-150",
          "focus:outline-none focus:ring-1 focus:ring-accent",
        )}
      />

      <button
        type="submit"
        disabled={isEmpty}
        aria-label="Send message"
        className={cn(
          "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
          "transition-all duration-150",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
          isEmpty
            ? "text-muted-foreground opacity-50 cursor-not-allowed"
            : "text-accent hover:bg-accent/10 active:scale-95",
        )}
      >
        <Send size={20} />
      </button>
    </form>
  );
}
