"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useProfileStore } from "@/stores/useProfileStore";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileTabs, { type ProfileTab } from "@/components/profile/ProfileTabs";
import ProfilePostsGrid from "@/components/profile/ProfilePostsGrid";
import Skeleton from "@/components/ui/Skeleton";
import type { Post } from "@/types";

function ProfileSkeleton() {
  return (
    <div className="mx-auto max-w-4xl animate-pulse">
      {/* Header skeleton */}
      <div className="px-4 py-6">
        <div className="flex items-center gap-6 md:gap-10">
          <Skeleton variant="circle" className="h-24 w-24" />
          <div className="flex-1 space-y-3">
            <Skeleton variant="text" className="h-6 w-40" />
            <div className="flex gap-6">
              <Skeleton variant="text" className="h-10 w-16" />
              <Skeleton variant="text" className="h-10 w-16" />
              <Skeleton variant="text" className="h-10 w-16" />
            </div>
            <Skeleton variant="text" className="h-4 w-32" />
            <Skeleton variant="text" className="h-4 w-64" />
          </div>
        </div>
      </div>

      {/* Tabs skeleton */}
      <div className="flex justify-center gap-12 border-t border-border py-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} variant="rect" className="h-4 w-12" />
        ))}
      </div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-3 gap-0.5 sm:gap-1">
        {Array.from({ length: 9 }).map((_, i) => (
          <Skeleton key={i} variant="rect" className="aspect-square w-full" />
        ))}
      </div>
    </div>
  );
}

export default function ProfilePageClient() {
  const params = useParams<{ username: string }>();
  const router = useRouter();
  const username = params.username;

  const { profile, userPosts, isLoading, fetchProfile, fetchUserPosts, toggleFollow } =
    useProfileStore();

  const [activeTab, setActiveTab] = useState<ProfileTab>("posts");

  useEffect(() => {
    if (username) {
      fetchProfile(username);
      fetchUserPosts(username);
    }
  }, [username, fetchProfile, fetchUserPosts]);

  const handleFollowToggle = useCallback(() => {
    if (username) {
      toggleFollow(username);
    }
  }, [username, toggleFollow]);

  const handlePostClick = useCallback(
    (post: Post) => {
      router.push(`/p/${post.id}`);
    },
    [router],
  );

  const handleTabChange = useCallback((tab: ProfileTab) => {
    setActiveTab(tab);
  }, []);

  if (isLoading || !profile) {
    return <ProfileSkeleton />;
  }

  // Map store profile shape to ProfileHeader expected shape
  const profileData = {
    id: profile.id,
    username: profile.username,
    displayName: profile.fullName,
    avatarUrl: profile.avatar,
    bio: profile.bio,
    website: "",
    isVerified: false,
    isFollowing: profile.isFollowing,
    followersCount: profile.followersCount,
    followingCount: profile.followingCount,
    postsCount: profile.postsCount,
    isOwnProfile: profile.isOwnProfile,
  };

  // Filter posts by active tab
  const filteredPosts =
    activeTab === "posts"
      ? userPosts
      : activeTab === "reels"
        ? userPosts.filter(
            (p) => p.type === "video" || p.media.some((m) => m.type === "video"),
          )
        : userPosts.filter((p) => p.isSaved);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="mx-auto max-w-4xl"
    >
      <ProfileHeader profile={profileData} onFollowToggle={handleFollowToggle} />

      <ProfileTabs
        activeTab={activeTab}
        onTabChange={handleTabChange}
        isOwnProfile={profile.isOwnProfile}
      />

      <div className="mt-1">
        <ProfilePostsGrid posts={filteredPosts} onPostClick={handlePostClick} />
      </div>
    </motion.div>
  );
}
