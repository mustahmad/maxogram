import { create } from "zustand";
import type { Post } from "@/types";

interface UserProfile {
  id: string;
  username: string;
  fullName: string;
  bio: string;
  avatar: string;
  postsCount: number;
  followersCount: number;
  followingCount: number;
  isFollowing: boolean;
  isOwnProfile: boolean;
}

interface ProfileState {
  profile: UserProfile | null;
  userPosts: Post[];
  isLoading: boolean;
  fetchProfile: (username: string) => Promise<void>;
  fetchUserPosts: (username: string) => Promise<void>;
  toggleFollow: (username: string) => Promise<void>;
}

export const useProfileStore = create<ProfileState>()((set, get) => ({
  profile: null,
  userPosts: [],
  isLoading: false,

  fetchProfile: async (username: string) => {
    set({ isLoading: true });
    try {
      const res = await fetch(`/api/users/${username}`);
      if (!res.ok) throw new Error("Failed to fetch profile");

      const json = await res.json();
      set({ profile: json.data ?? null, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  fetchUserPosts: async (username: string) => {
    try {
      const res = await fetch(`/api/users/${username}/posts`);
      if (!res.ok) throw new Error("Failed to fetch user posts");

      const json = await res.json();
      set({ userPosts: json.data ?? [] });
    } catch {
      // silently fail
    }
  },

  toggleFollow: async (username: string) => {
    const { profile } = get();
    if (!profile) return;

    const wasFollowing = profile.isFollowing;
    const prevFollowers = profile.followersCount;

    set({
      profile: {
        ...profile,
        isFollowing: !wasFollowing,
        followersCount: wasFollowing ? prevFollowers - 1 : prevFollowers + 1,
      },
    });

    try {
      const res = await fetch(`/api/users/${username}/follow`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed to toggle follow");
    } catch {
      const currentProfile = get().profile;
      if (currentProfile) {
        set({
          profile: {
            ...currentProfile,
            isFollowing: wasFollowing,
            followersCount: prevFollowers,
          },
        });
      }
    }
  },
}));
