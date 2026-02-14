import { create } from "zustand";
import type { Post } from "@/types";
import { allUsers, isFollowing } from "@/data/users";
import { mockPosts } from "@/data/posts";

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
    await new Promise((r) => setTimeout(r, 300));

    const user = allUsers.find(
      (u) => u.username.toLowerCase() === username.toLowerCase()
    );

    if (!user) {
      set({ profile: null, isLoading: false });
      return;
    }

    const profileData: UserProfile = {
      id: user.id,
      username: user.username,
      fullName: user.displayName,
      bio: user.bio ?? "",
      avatar: user.avatarUrl,
      postsCount: user.postsCount ?? 0,
      followersCount: user.followersCount ?? 0,
      followingCount: user.followingCount ?? 0,
      isFollowing: isFollowing("current-user", user.id),
      isOwnProfile: user.id === "current-user",
    };

    set({ profile: profileData, isLoading: false });
  },

  fetchUserPosts: async (username: string) => {
    await new Promise((r) => setTimeout(r, 300));

    const user = allUsers.find(
      (u) => u.username.toLowerCase() === username.toLowerCase()
    );

    if (!user) {
      set({ userPosts: [] });
      return;
    }

    const posts = mockPosts.filter((p) => p.authorId === user.id);
    set({ userPosts: posts });
  },

  toggleFollow: async (_username: string) => {
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
  },
}));
