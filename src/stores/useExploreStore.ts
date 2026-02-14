import { create } from "zustand";
import type { Post, User } from "@/types";

interface ExploreState {
  posts: Post[];
  searchQuery: string;
  activeCategory: string;
  searchResults: User[];
  isLoading: boolean;
  fetchExplore: (category?: string) => Promise<void>;
  search: (query: string) => Promise<void>;
  setCategory: (category: string) => void;
  clearSearch: () => void;
}

export const useExploreStore = create<ExploreState>()((set, get) => ({
  posts: [],
  searchQuery: "",
  activeCategory: "all",
  searchResults: [],
  isLoading: false,

  fetchExplore: async (category?: string) => {
    const cat = category || get().activeCategory;
    set({ isLoading: true });

    try {
      const params = new URLSearchParams();
      if (cat && cat !== "all") {
        params.set("category", cat);
      }

      const res = await fetch(`/api/explore?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch explore");

      const json = await res.json();
      set({ posts: json.data ?? [], activeCategory: cat, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  search: async (query: string) => {
    set({ searchQuery: query });

    if (!query.trim()) {
      set({ searchResults: [] });
      return;
    }

    set({ isLoading: true });

    try {
      const res = await fetch(
        `/api/explore/search?q=${encodeURIComponent(query)}`
      );
      if (!res.ok) throw new Error("Failed to search");

      const json = await res.json();
      set({ searchResults: json.data ?? [], isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  setCategory: (category: string) => {
    set({ activeCategory: category });
    get().fetchExplore(category);
  },

  clearSearch: () => {
    set({ searchQuery: "", searchResults: [] });
  },
}));
