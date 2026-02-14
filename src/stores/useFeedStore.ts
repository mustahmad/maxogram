import { create } from "zustand";
import type { Post } from "@/types";
import { mockPosts } from "@/data/posts";

const PAGE_SIZE = 6;

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
    await new Promise((r) => setTimeout(r, 300));

    const firstPage = mockPosts.slice(0, PAGE_SIZE);
    set({
      posts: firstPage,
      hasMore: mockPosts.length > PAGE_SIZE,
      page: 1,
      isLoading: false,
    });
  },

  fetchMore: async () => {
    const { page, hasMore, isLoading } = get();
    if (!hasMore || isLoading) return;

    const nextPage = page + 1;
    set({ isLoading: true });
    await new Promise((r) => setTimeout(r, 300));

    const start = (nextPage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    const nextPosts = mockPosts.slice(start, end);

    set((state) => ({
      posts: [...state.posts, ...nextPosts],
      hasMore: end < mockPosts.length,
      page: nextPage,
      isLoading: false,
    }));
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
  },

  addComment: async (id: string, _content: string) => {
    set({
      posts: get().posts.map((p) =>
        p.id === id
          ? { ...p, commentsCount: p.commentsCount + 1 }
          : p
      ),
    });
  },
}));
