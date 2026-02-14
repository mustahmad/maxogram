import type { User, UserProfile } from "@/types";

export const currentMockUser: User = {
  id: "current-user",
  username: "maxo_user",
  displayName: "Max User",
  email: "max@maxogram.app",
  avatarUrl: "https://i.pravatar.cc/150?img=12",
  bio: "Building things & breaking stuff. Coffee enthusiast. 📷 Photography | 🧑‍💻 Code | ☕ Caffeine",
  website: "https://maxogram.app",
  isPrivate: false,
  isVerified: true,
  followersCount: 1243,
  followingCount: 489,
  postsCount: 87,
  createdAt: "2025-03-15T08:00:00Z",
};

export const mockUsers: User[] = [
  {
    id: "user-1",
    username: "luna_captures",
    displayName: "Luna Chen",
    email: "luna@example.com",
    avatarUrl: "https://i.pravatar.cc/150?img=5",
    bio: "Photographer & visual storyteller. Based in Tokyo. Chasing golden hours around the world.",
    website: "https://lunacaptures.com",
    isPrivate: false,
    isVerified: true,
    followersCount: 52400,
    followingCount: 312,
    postsCount: 634,
    createdAt: "2024-11-01T12:00:00Z",
  },
  {
    id: "user-2",
    username: "dev_marcus",
    displayName: "Marcus Johnson",
    email: "marcus@example.com",
    avatarUrl: "https://i.pravatar.cc/150?img=8",
    bio: "Full-stack dev. Open source contributor. TypeScript is my love language.",
    website: "https://marcusj.dev",
    isPrivate: false,
    isVerified: false,
    followersCount: 3210,
    followingCount: 587,
    postsCount: 142,
    createdAt: "2025-01-20T09:30:00Z",
  },
  {
    id: "user-3",
    username: "aria_nomad",
    displayName: "Aria Patel",
    email: "aria@example.com",
    avatarUrl: "https://i.pravatar.cc/150?img=9",
    bio: "Digital nomad. 42 countries and counting. Currently: Lisbon 🇵🇹",
    website: "https://arianomad.blog",
    isPrivate: false,
    isVerified: true,
    followersCount: 98700,
    followingCount: 445,
    postsCount: 1203,
    createdAt: "2024-06-10T14:00:00Z",
  },
  {
    id: "user-4",
    username: "chef_oliver",
    displayName: "Oliver Kim",
    email: "oliver@example.com",
    avatarUrl: "https://i.pravatar.cc/150?img=11",
    bio: "Chef & food photographer. Farm-to-table advocate. Recipes in highlights.",
    website: "https://olivercooks.com",
    isPrivate: false,
    isVerified: false,
    followersCount: 15800,
    followingCount: 290,
    postsCount: 478,
    createdAt: "2024-09-05T16:00:00Z",
  },
  {
    id: "user-5",
    username: "fitnesswithsam",
    displayName: "Samantha Rivera",
    email: "sam@example.com",
    avatarUrl: "https://i.pravatar.cc/150?img=23",
    bio: "Certified PT | Yoga instructor | Your daily dose of motivation 💪",
    website: "https://fitnesswithsam.co",
    isPrivate: false,
    isVerified: true,
    followersCount: 234000,
    followingCount: 198,
    postsCount: 2100,
    createdAt: "2024-03-18T07:00:00Z",
  },
  {
    id: "user-6",
    username: "neon_dreams",
    displayName: "Kai Tanaka",
    email: "kai@example.com",
    avatarUrl: "https://i.pravatar.cc/150?img=33",
    bio: "Digital artist & illustrator. Commissions open. Turning pixels into feelings.",
    website: "https://neondreams.art",
    isPrivate: false,
    isVerified: false,
    followersCount: 8920,
    followingCount: 412,
    postsCount: 310,
    createdAt: "2025-02-01T11:00:00Z",
  },
  {
    id: "user-7",
    username: "bookish_emma",
    displayName: "Emma Larsson",
    email: "emma@example.com",
    avatarUrl: "https://i.pravatar.cc/150?img=44",
    bio: "Librarian by day, bookstagrammer by night. Currently reading: Project Hail Mary.",
    website: "https://bookishemma.com",
    isPrivate: false,
    isVerified: false,
    followersCount: 4560,
    followingCount: 623,
    postsCount: 256,
    createdAt: "2025-04-22T13:00:00Z",
  },
  {
    id: "user-8",
    username: "urban_jay",
    displayName: "Jay Okonkwo",
    email: "jay@example.com",
    avatarUrl: "https://i.pravatar.cc/150?img=52",
    bio: "Street photographer | NYC born & raised | The city never sleeps and neither do I.",
    website: "https://urbanjay.photo",
    isPrivate: false,
    isVerified: true,
    followersCount: 41200,
    followingCount: 375,
    postsCount: 890,
    createdAt: "2024-07-30T10:00:00Z",
  },
];

export const allUsers: User[] = [currentMockUser, ...mockUsers];

/** Follow graph: key = userId, value = array of userIds they follow */
export const followGraph: Record<string, string[]> = {
  "current-user": ["user-1", "user-2", "user-3", "user-5", "user-6", "user-8"],
  "user-1": ["current-user", "user-3", "user-5", "user-8"],
  "user-2": ["current-user", "user-1", "user-4", "user-6", "user-7"],
  "user-3": ["current-user", "user-1", "user-5", "user-8"],
  "user-4": ["user-1", "user-3", "user-5", "user-7"],
  "user-5": ["current-user", "user-1", "user-3", "user-4", "user-8"],
  "user-6": ["current-user", "user-2", "user-7", "user-8"],
  "user-7": ["user-2", "user-4", "user-6"],
  "user-8": ["current-user", "user-1", "user-3", "user-5", "user-6"],
};

/** Helper: does userA follow userB? */
export function isFollowing(userAId: string, userBId: string): boolean {
  return followGraph[userAId]?.includes(userBId) ?? false;
}

/** Helper: get mutual followers between current user and target user */
export function getMutualFollowers(
  targetUserId: string
): Pick<User, "id" | "username" | "avatarUrl">[] {
  const currentFollowing = new Set(followGraph["current-user"] ?? []);
  const targetFollowers = Object.entries(followGraph)
    .filter(([, following]) => following.includes(targetUserId))
    .map(([userId]) => userId);

  return targetFollowers
    .filter((uid) => currentFollowing.has(uid) && uid !== "current-user")
    .map((uid) => {
      const user = allUsers.find((u) => u.id === uid)!;
      return { id: user.id, username: user.username, avatarUrl: user.avatarUrl };
    });
}

/** Build a full UserProfile for display */
export function buildUserProfile(userId: string): UserProfile | null {
  const user = allUsers.find((u) => u.id === userId);
  if (!user) return null;

  return {
    ...user,
    isFollowing: isFollowing("current-user", userId),
    isFollowedBy: isFollowing(userId, "current-user"),
    mutualFollowers: getMutualFollowers(userId),
  };
}
