export interface User {
  id: string;
  username: string;
  displayName: string;
  email: string;
  avatarUrl: string;
  bio: string;
  website: string;
  isPrivate: boolean;
  isVerified: boolean;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  createdAt: string;
}

export interface UserProfile extends User {
  isFollowing: boolean;
  isFollowedBy: boolean;
  mutualFollowers: Pick<User, "id" | "username" | "avatarUrl">[];
}
