"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { BadgeCheck, MessageCircle, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import ProfileStats from "./ProfileStats";
import FollowButton from "./FollowButton";
import FollowersModal from "./FollowersModal";
import FollowingModal from "./FollowingModal";

interface ProfileData {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  bio: string;
  website: string;
  isVerified: boolean;
  isFollowing: boolean;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  isOwnProfile: boolean;
}

interface ProfileHeaderProps {
  profile: ProfileData;
  onFollowToggle?: () => void;
}

export default function ProfileHeader({
  profile,
  onFollowToggle,
}: ProfileHeaderProps) {
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="px-4 py-6"
      >
        {/* Top section: Avatar + Stats */}
        <div className="flex items-center gap-6 md:gap-10">
          {/* Avatar */}
          <div className="shrink-0">
            <Avatar
              src={profile.avatarUrl}
              alt={profile.displayName}
              size="xl"
            />
          </div>

          {/* Stats + Actions (desktop layout) */}
          <div className="flex-1">
            {/* Username row */}
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <h1 className="text-xl font-semibold text-foreground">
                {profile.username}
              </h1>
              {profile.isVerified && (
                <BadgeCheck
                  size={20}
                  className="text-accent"
                  aria-label="Verified"
                />
              )}

              {/* Actions inline on desktop */}
              <div className="hidden items-center gap-2 sm:flex">
                {profile.isOwnProfile ? (
                  <>
                    <Link href="/settings/edit-profile">
                      <Button variant="secondary" size="sm">
                        Edit Profile
                      </Button>
                    </Link>
                    <Link href="/settings">
                      <Button variant="ghost" size="sm">
                        <Settings size={18} />
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <FollowButton
                      isFollowing={profile.isFollowing}
                      onToggle={onFollowToggle ?? (() => {})}
                      size="sm"
                    />
                    <Link href={`/messages?user=${profile.username}`}>
                      <Button
                        variant="secondary"
                        size="sm"
                        iconLeft={<MessageCircle size={16} />}
                      >
                        Message
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Stats row -- visible on desktop */}
            <div className="hidden sm:block">
              <ProfileStats
                postsCount={profile.postsCount}
                followersCount={profile.followersCount}
                followingCount={profile.followingCount}
                onFollowersClick={() => setShowFollowers(true)}
                onFollowingClick={() => setShowFollowing(true)}
              />
            </div>

            {/* Bio -- visible on desktop */}
            <div className="mt-4 hidden sm:block">
              <p className="text-sm font-semibold text-foreground">
                {profile.displayName}
              </p>
              {profile.bio && (
                <p className="mt-1 whitespace-pre-line text-sm text-foreground">
                  {profile.bio}
                </p>
              )}
              {profile.website && (
                <a
                  href={
                    profile.website.startsWith("http")
                      ? profile.website
                      : `https://${profile.website}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-block text-sm font-medium text-accent hover:underline"
                >
                  {profile.website}
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Bio -- mobile only */}
        <div className="mt-4 sm:hidden">
          <p className="text-sm font-semibold text-foreground">
            {profile.displayName}
          </p>
          {profile.bio && (
            <p className="mt-1 whitespace-pre-line text-sm text-foreground">
              {profile.bio}
            </p>
          )}
          {profile.website && (
            <a
              href={
                profile.website.startsWith("http")
                  ? profile.website
                  : `https://${profile.website}`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-block text-sm font-medium text-accent hover:underline"
            >
              {profile.website}
            </a>
          )}
        </div>

        {/* Actions -- mobile only */}
        <div className="mt-4 flex items-center gap-2 sm:hidden">
          {profile.isOwnProfile ? (
            <>
              <Link href="/settings/edit-profile" className="flex-1">
                <Button variant="secondary" size="sm" fullWidth>
                  Edit Profile
                </Button>
              </Link>
              <Link href="/settings">
                <Button variant="ghost" size="sm">
                  <Settings size={18} />
                </Button>
              </Link>
            </>
          ) : (
            <>
              <div className="flex-1">
                <FollowButton
                  isFollowing={profile.isFollowing}
                  onToggle={onFollowToggle ?? (() => {})}
                  size="sm"
                />
              </div>
              <Link href={`/messages?user=${profile.username}`}>
                <Button
                  variant="secondary"
                  size="sm"
                  iconLeft={<MessageCircle size={16} />}
                >
                  Message
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Stats -- mobile only */}
        <div className="mt-4 border-t border-border pt-3 sm:hidden">
          <ProfileStats
            postsCount={profile.postsCount}
            followersCount={profile.followersCount}
            followingCount={profile.followingCount}
            onFollowersClick={() => setShowFollowers(true)}
            onFollowingClick={() => setShowFollowing(true)}
          />
        </div>
      </motion.div>

      {/* Modals */}
      <FollowersModal
        isOpen={showFollowers}
        onClose={() => setShowFollowers(false)}
        username={profile.username}
      />
      <FollowingModal
        isOpen={showFollowing}
        onClose={() => setShowFollowing(false)}
        username={profile.username}
      />
    </>
  );
}
