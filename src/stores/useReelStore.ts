import { create } from "zustand";
import type { Reel } from "@/types";

interface ReelState {
  reels: Reel[];
  activeIndex: number;
  isLoading: boolean;
  fetchReels: () => Promise<void>;
  likeReel: (id: string) => Promise<void>;
  setActiveIndex: (index: number) => void;
}

export const useReelStore = create<ReelState>()((set, get) => ({
  reels: [],
  activeIndex: 0,
  isLoading: false,

  fetchReels: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch("/api/reels");
      if (!res.ok) throw new Error("Failed to fetch reels");

      const json = await res.json();
      set({ reels: json.data ?? [], isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  likeReel: async (id: string) => {
    const { reels } = get();
    const reel = reels.find((r) => r.id === id);
    if (!reel) return;

    const wasLiked = reel.isLiked;
    const prevLikes = reel.likesCount;

    set({
      reels: reels.map((r) =>
        r.id === id
          ? {
              ...r,
              isLiked: !wasLiked,
              likesCount: wasLiked ? prevLikes - 1 : prevLikes + 1,
            }
          : r
      ),
    });

    try {
      const res = await fetch(`/api/reels/${id}/like`, { method: "POST" });
      if (!res.ok) throw new Error("Failed to toggle like");
    } catch {
      set({
        reels: get().reels.map((r) =>
          r.id === id ? { ...r, isLiked: wasLiked, likesCount: prevLikes } : r
        ),
      });
    }
  },

  setActiveIndex: (index: number) => {
    set({ activeIndex: index });
  },
}));
