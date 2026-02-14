"use client";

import { useEffect, useState, useCallback } from "react";
import Modal from "@/components/ui/Modal";
import UserListItem from "@/components/shared/UserListItem";
import FollowButton from "./FollowButton";
import Skeleton from "@/components/ui/Skeleton";
import type { User } from "@/types";

interface FollowingUser extends Pick<User, "id" | "username" | "displayName" | "avatarUrl"> {
  isFollowing: boolean;
}

interface FollowingModalProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
}

export default function FollowingModal({
  isOpen,
  onClose,
  username,
}: FollowingModalProps) {
  const [following, setFollowing] = useState<FollowingUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchFollowing = useCallback(async () => {
    if (!username) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/users/${username}/following`);
      if (!res.ok) throw new Error("Failed to fetch following");
      const data = await res.json();
      setFollowing(data.following ?? data.data ?? []);
    } catch {
      setFollowing([]);
    } finally {
      setIsLoading(false);
    }
  }, [username]);

  useEffect(() => {
    if (isOpen) {
      fetchFollowing();
    }
  }, [isOpen, fetchFollowing]);

  const handleToggleFollow = async (userId: string) => {
    setFollowing((prev) =>
      prev.map((f) =>
        f.id === userId ? { ...f, isFollowing: !f.isFollowing } : f,
      ),
    );

    try {
      const user = following.find((f) => f.id === userId);
      if (!user) return;
      const res = await fetch(`/api/users/${user.username}/follow`, {
        method: "POST",
      });
      if (!res.ok) {
        setFollowing((prev) =>
          prev.map((f) =>
            f.id === userId ? { ...f, isFollowing: !f.isFollowing } : f,
          ),
        );
      }
    } catch {
      setFollowing((prev) =>
        prev.map((f) =>
          f.id === userId ? { ...f, isFollowing: !f.isFollowing } : f,
        ),
      );
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Following" className="max-h-[70vh]">
      <div className="max-h-[50vh] overflow-y-auto -mx-6 px-0">
        {isLoading ? (
          <div className="space-y-3 px-4 py-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-2">
                <Skeleton variant="circle" className="h-10 w-10" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton variant="text" className="h-3.5 w-24" />
                  <Skeleton variant="text" className="h-3 w-32" />
                </div>
                <Skeleton variant="rect" className="h-8 w-20 rounded-lg" />
              </div>
            ))}
          </div>
        ) : following.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-sm text-muted-foreground">Not following anyone yet</p>
          </div>
        ) : (
          following.map((user) => (
            <UserListItem
              key={user.id}
              user={user}
              action={
                <FollowButton
                  isFollowing={user.isFollowing}
                  onToggle={() => handleToggleFollow(user.id)}
                  size="sm"
                />
              }
            />
          ))
        )}
      </div>
    </Modal>
  );
}
