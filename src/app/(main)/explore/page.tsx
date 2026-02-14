"use client";

import { useCallback, useEffect, type ChangeEvent } from "react";
import { cn } from "@/lib/utils";
import { useExploreStore } from "@/stores/useExploreStore";
import { useDebounce } from "@/hooks/useDebounce";
import SearchInput from "@/components/ui/SearchInput";
import Skeleton from "@/components/ui/Skeleton";
import CategoryPills from "@/components/explore/CategoryPills";
import ExploreGrid from "@/components/explore/ExploreGrid";
import SearchResults from "@/components/explore/SearchResults";
import type { Post } from "@/types";

const CATEGORIES = [
  "all",
  "trending",
  "photography",
  "art",
  "food",
  "travel",
  "fashion",
  "music",
  "sports",
  "tech",
];

function ExploreGridSkeleton() {
  return (
    <div className="grid grid-cols-3 gap-0.5">
      {Array.from({ length: 12 }).map((_, i) => (
        <Skeleton key={i} variant="rect" className="aspect-square w-full" />
      ))}
    </div>
  );
}

export default function ExplorePage() {
  const {
    posts,
    searchQuery,
    activeCategory,
    searchResults,
    isLoading,
    fetchExplore,
    search,
    setCategory,
    clearSearch,
  } = useExploreStore();

  const debouncedQuery = useDebounce(searchQuery, 300);

  // Fetch explore data on mount
  useEffect(() => {
    fetchExplore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Search when debounced query changes
  useEffect(() => {
    if (debouncedQuery.trim()) {
      search(debouncedQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery]);

  const handleSearchChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      // Optimistically set the query for input responsiveness
      useExploreStore.setState({ searchQuery: value });

      if (!value.trim()) {
        clearSearch();
      }
    },
    [clearSearch]
  );

  const handleClearSearch = useCallback(() => {
    clearSearch();
  }, [clearSearch]);

  const handleCategorySelect = useCallback(
    (category: string) => {
      setCategory(category);
    },
    [setCategory]
  );

  const handlePostClick = useCallback((post: Post) => {
    // Navigate to post detail or open modal
    // This can be expanded to use a router push or modal store
    console.log("Post clicked:", post.id);
  }, []);

  const isSearchActive = searchQuery.trim().length > 0;

  return (
    <div className="mx-auto max-w-4xl">
      {/* Sticky search bar */}
      <div
        className={cn(
          "sticky top-0 z-20 bg-background/80 px-4 pb-1 pt-3 backdrop-blur-md"
        )}
      >
        <SearchInput
          value={searchQuery}
          onChange={handleSearchChange}
          onClear={handleClearSearch}
          placeholder="Search users..."
        />
      </div>

      {/* Category pills */}
      {!isSearchActive && (
        <div className="px-4">
          <CategoryPills
            categories={CATEGORIES}
            active={activeCategory}
            onSelect={handleCategorySelect}
          />
        </div>
      )}

      {/* Content area */}
      <div className="mt-1">
        {isSearchActive ? (
          /* Search results */
          isLoading ? (
            <div className="flex flex-col gap-2 px-4 pt-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 py-2">
                  <Skeleton variant="circle" className="h-10 w-10" />
                  <div className="flex flex-1 flex-col gap-1.5">
                    <Skeleton variant="text" className="h-3.5 w-28" />
                    <Skeleton variant="text" className="h-3 w-20" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <SearchResults users={searchResults} query={searchQuery} />
          )
        ) : /* Explore grid */
        isLoading ? (
          <ExploreGridSkeleton />
        ) : (
          <ExploreGrid posts={posts} onPostClick={handlePostClick} />
        )}
      </div>
    </div>
  );
}
