"use client";

import { useState, useCallback, useRef, useEffect, type KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Hash, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface CaptionEditorProps {
  caption: string;
  onCaptionChange: (text: string) => void;
  tags: string[];
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
}

const MAX_CAPTION_LENGTH = 2200;

const HASHTAG_SUGGESTIONS = [
  "photography",
  "photooftheday",
  "instagood",
  "nature",
  "travel",
  "art",
  "love",
  "beautiful",
  "fashion",
  "fitness",
  "food",
  "music",
  "sunset",
  "selfie",
  "lifestyle",
  "explore",
  "happy",
  "design",
  "motivation",
  "summer",
];

export default function CaptionEditor({
  caption,
  onCaptionChange,
  tags,
  onAddTag,
  onRemoveTag,
}: CaptionEditorProps) {
  const [tagInput, setTagInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [hashtagQuery, setHashtagQuery] = useState("");
  const tagInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const charCount = caption.length;
  const isNearLimit = charCount >= MAX_CAPTION_LENGTH * 0.9;
  const isAtLimit = charCount >= MAX_CAPTION_LENGTH;

  // Detect # in caption for inline suggestions
  useEffect(() => {
    const lastHash = caption.lastIndexOf("#");
    if (lastHash >= 0) {
      const afterHash = caption.slice(lastHash + 1);
      // If there's a space after the hash text or nothing after hash, no suggestions
      if (afterHash.includes(" ") || afterHash.includes("\n")) {
        setShowSuggestions(false);
        setHashtagQuery("");
      } else if (afterHash.length > 0) {
        setHashtagQuery(afterHash.toLowerCase());
        setShowSuggestions(true);
      } else {
        setHashtagQuery("");
        setShowSuggestions(true);
      }
    } else {
      setShowSuggestions(false);
      setHashtagQuery("");
    }
  }, [caption]);

  const filteredSuggestions = HASHTAG_SUGGESTIONS.filter(
    (s) => s.startsWith(hashtagQuery) && !tags.includes(s),
  ).slice(0, 6);

  const handleCaptionChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;
      if (value.length <= MAX_CAPTION_LENGTH) {
        onCaptionChange(value);
      }
    },
    [onCaptionChange],
  );

  const handleSuggestionClick = useCallback(
    (suggestion: string) => {
      // Replace the partial hashtag in caption
      const lastHash = caption.lastIndexOf("#");
      if (lastHash >= 0) {
        const before = caption.slice(0, lastHash);
        onCaptionChange(`${before}#${suggestion} `);
      }
      setShowSuggestions(false);
      textareaRef.current?.focus();
    },
    [caption, onCaptionChange],
  );

  const handleTagKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const trimmed = tagInput.trim().replace(/^#/, "");
        if (trimmed && !tags.includes(trimmed.toLowerCase())) {
          onAddTag(trimmed.toLowerCase());
          setTagInput("");
        }
      }
    },
    [tagInput, tags, onAddTag],
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      {/* Caption textarea */}
      <div className="relative">
        <label
          htmlFor="caption-editor"
          className="mb-1.5 block text-sm font-medium text-foreground"
        >
          Caption
        </label>
        <textarea
          ref={textareaRef}
          id="caption-editor"
          value={caption}
          onChange={handleCaptionChange}
          placeholder="Write a caption..."
          rows={5}
          maxLength={MAX_CAPTION_LENGTH}
          className={cn(
            "w-full resize-none rounded-xl border bg-muted px-3 py-2.5 text-sm text-foreground",
            "border-border placeholder:text-muted-foreground",
            "transition-colors duration-150",
            "focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent",
          )}
        />

        {/* Character counter */}
        <div className="mt-1 flex justify-end">
          <span
            className={cn(
              "text-xs",
              isAtLimit
                ? "text-red-500 font-semibold"
                : isNearLimit
                  ? "text-orange-500"
                  : "text-muted-foreground",
            )}
          >
            {charCount}/{MAX_CAPTION_LENGTH}
          </span>
        </div>

        {/* Hashtag suggestions dropdown */}
        <AnimatePresence>
          {showSuggestions && filteredSuggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="absolute left-0 right-0 z-20 mt-1 rounded-xl border border-border bg-card shadow-lg"
            >
              {filteredSuggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted first:rounded-t-xl last:rounded-b-xl"
                >
                  <Hash size={14} className="text-muted-foreground" />
                  <span>{suggestion}</span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Tag input */}
      <div>
        <label
          htmlFor="tag-input"
          className="mb-1.5 block text-sm font-medium text-foreground"
        >
          Tags
        </label>
        <div className="flex items-center gap-2 rounded-xl border border-border bg-muted px-3 py-2.5">
          <Hash size={16} className="shrink-0 text-muted-foreground" />
          <input
            ref={tagInputRef}
            id="tag-input"
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
            placeholder="Add a tag and press Enter"
            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
        </div>

        {/* Tag pills */}
        <AnimatePresence mode="popLayout">
          {tags.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-3 flex flex-wrap gap-2"
            >
              {tags.map((tag) => (
                <motion.span
                  key={tag}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="inline-flex items-center gap-1 rounded-full bg-accent/15 px-3 py-1 text-xs font-medium text-accent"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => onRemoveTag(tag)}
                    className="ml-0.5 rounded-full p-0.5 transition-colors hover:bg-accent/20 focus-visible:outline-2 focus-visible:outline-accent"
                    aria-label={`Remove tag ${tag}`}
                  >
                    <X size={12} />
                  </button>
                </motion.span>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
