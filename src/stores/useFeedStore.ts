import { create } from "zustand";
import type { Post } from "@/types";

interface FeedState {
  posts: Post[];
  isLoading: boolean;
  page: number;
  hasMore: boolean;
  fetchFeed: () => Promise<void>;
  fetchMore: () => Promise<void>;
  likePost: (id: string) => Promise<void>;
  savePost: (id: string) => Promise<void>;
  addComment: (id: string, content: string) => Promise<void>;
}

export const useFeedStore = create<FeedState>()((set, get) => ({
  posts: [],
  isLoading: false,
  page: 1,
  hasMore: true,

  fetchFeed: async () => {
    set({ isLoading: true, page: 1 });
    try {
      const res = await fetch("/api/posts?page=1");
      if (!res.ok) throw new Error("Failed to fetch feed");

      const json = await res.json();
      set({
        posts: json.data ?? [],
        hasMore: json.pagination?.hasNext ?? false,
        page: 1,
        isLoading: false,
      });
    } catch {
      set({ isLoading: false });
    }
  },

  fetchMore: async () => {
    const { page, hasMore, isLoading } = get();
    if (!hasMore || isLoading) return;

    const nextPage = page + 1;
    set({ isLoading: true });

    try {
      const res = await fetch(`/api/posts?page=${nextPage}`);
      if (!res.ok) throw new Error("Failed to fetch more posts");

      const json = await res.json();
      set((state) => ({
        posts: [...state.posts, ...(json.data ?? [])],
        hasMore: json.pagination?.hasNext ?? false,
        page: nextPage,
        isLoading: false,
      }));
    } catch {
      set({ isLoading: false });
    }
  },

  likePost: async (id: string) => {
    const { posts } = get();
    const post = posts.find((p) => p.id === id);
    if (!post) return;

    const wasLiked = post.isLiked;
    const prevLikes = post.likesCount;

    set({
      posts: posts.map((p) =>
        p.id === id
          ? {
              ...p,
              isLiked: !wasLiked,
              likesCount: wasLiked ? prevLikes - 1 : prevLikes + 1,
            }
          : p
      ),
    });

    try {
      const res = await fetch(`/api/posts/${id}/like`, { method: "POST" });
      if (!res.ok) throw new Error("Failed to toggle like");
    } catch {
      set({
        posts: get().posts.map((p) =>
          p.id === id ? { ...p, isLiked: wasLiked, likesCount: prevLikes } : p
        ),
      });
    }
  },

  savePost: async (id: string) => {
    const { posts } = get();
    const post = posts.find((p) => p.id === id);
    if (!post) return;

    const wasSaved = post.isSaved;

    set({
      posts: posts.map((p) =>
        p.id === id ? { ...p, isSaved: !wasSaved } : p
      ),
    });

    try {
      const res = await fetch(`/api/posts/${id}/save`, { method: "POST" });
      if (!res.ok) throw new Error("Failed to toggle save");
    } catch {
      set({
        posts: get().posts.map((p) =>
          p.id === id ? { ...p, isSaved: wasSaved } : p
        ),
      });
    }
  },

  addComment: async (id: string, content: string) => {
    try {
      const res = await fetch(`/api/posts/${id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      if (!res.ok) throw new Error("Failed to add comment");

      const data = await res.json();

      set({
        posts: get().posts.map((p) =>
          p.id === id
            ? { ...p, commentsCount: p.commentsCount + 1 }
            : p
        ),
      });
    } catch {
      throw new Error("Failed to add comment");
    }
  },
}));
