"use client";

import { useState, useCallback, useRef } from "react";
import { Smile } from "lucide-react";
import { cn } from "@/lib/utils";

interface CommentInputProps {
  onSubmit: (text: string) => void;
}

export default function CommentInput({ onSubmit }: CommentInputProps) {
  const [text, setText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = useCallback(() => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    setText("");
  }, [text, onSubmit]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  return (
    <div
      className={cn(
        "flex items-center gap-2 border-t border-border px-4 py-3"
      )}
    >
      <button
        type="button"
        className="flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center text-foreground hover:text-muted-foreground"
        aria-label="Add emoji"
      >
        <Smile size={24} />
      </button>
      <input
        ref={inputRef}
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Add a comment..."
        className={cn(
          "flex-1 bg-transparent text-sm text-foreground outline-none",
          "placeholder:text-muted-foreground"
        )}
        aria-label="Add a comment"
      />
      <button
        type="button"
        onClick={handleSubmit}
        disabled={text.trim().length === 0}
        className={cn(
          "shrink-0 min-h-[44px] px-2 text-sm font-semibold transition-opacity",
          text.trim().length > 0
            ? "text-accent hover:text-accent/80"
            : "pointer-events-none text-accent/40"
        )}
      >
        Post
      </button>
    </div>
  );
}
