"use client";

import { useRef, type ChangeEvent } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchInputProps {
  /** Current search value */
  value: string;
  /** Called when the input value changes */
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  /** Called when the clear button is clicked */
  onClear: () => void;
  /** Placeholder text */
  placeholder?: string;
  /** Additional CSS classes */
  className?: string;
}

export default function SearchInput({
  value,
  onChange,
  onClear,
  placeholder = "Search...",
  className,
}: SearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className={cn("relative", className)} role="search">
      {/* Search icon */}
      <Search
        size={18}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />

      <input
        ref={inputRef}
        type="search"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        aria-label={placeholder}
        className={cn(
          "w-full rounded-xl border border-border bg-muted py-2.5 pl-10 pr-10 text-sm text-foreground",
          "placeholder:text-muted-foreground",
          "transition-colors duration-150",
          "focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent",
        )}
      />

      {/* Clear button */}
      {value.length > 0 && (
        <button
          type="button"
          onClick={() => {
            onClear();
            inputRef.current?.focus();
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground transition-colors hover:bg-border hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          aria-label="Clear search"
        >
          <X size={16} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
