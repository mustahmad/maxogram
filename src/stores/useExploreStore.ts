import { create } from "zustand";
import type { Post, User } from "@/types";
import { mockPosts } from "@/data/posts";
import { allUsers } from "@/data/users";
import { mockCategories } from "@/data/categories";

/** Map category slugs to tags that belong in that category */
const categoryTagMap: Record<string, string[]> = {};
for (const cat of mockCategories) {
  categoryTagMap[cat.slug] = cat.trendingTags;
}

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
    await new Promise((r) => setTimeout(r, 300));

    let filtered: Post[];
    if (!cat || cat === "all") {
      filtered = [...mockPosts];
    } else {
      const tagsForCategory = categoryTagMap[cat] ?? [];
      filtered = mockPosts.filter((post) =>
        post.tags?.some((tag) => tagsForCategory.includes(tag))
      );
    }

    set({ posts: filtered, activeCategory: cat, isLoading: false });
  },

  search: async (query: string) => {
    set({ searchQuery: query });

    if (!query.trim()) {
      set({ searchResults: [] });
      return;
    }

    set({ isLoading: true });
    await new Promise((r) => setTimeout(r, 300));

    const q = query.toLowerCase();
    const results = allUsers.filter(
      (u) =>
        u.username.toLowerCase().includes(q) ||
        u.displayName.toLowerCase().includes(q)
    );

    set({ searchResults: results, isLoading: false });
  },

  setCategory: (category: string) => {
    set({ activeCategory: category });
    get().fetchExplore(category);
  },

  clearSearch: () => {
    set({ searchQuery: "", searchResults: [] });
  },
}));
