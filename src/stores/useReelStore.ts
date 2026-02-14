import { create } from "zustand";
import type { Reel } from "@/types";
import { mockReels } from "@/data/reels";

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
    await new Promise((r) => setTimeout(r, 300));
    set({ reels: mockReels, isLoading: false });
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
  },

  setActiveIndex: (index: number) => {
    set({ activeIndex: index });
  },
}));
