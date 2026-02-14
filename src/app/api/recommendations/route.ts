import { NextResponse } from "next/server";
import { allUsers, followGraph, isFollowing, getMutualFollowers } from "@/data/users";

export async function GET() {
  await new Promise((r) => setTimeout(r, 150));

  const currentFollowing = new Set(followGraph["current-user"] ?? []);

  // Suggest users the current user is NOT following (exclude self)
  const suggestions = allUsers
    .filter(
      (user) =>
        user.id !== "current-user" && !currentFollowing.has(user.id),
    )
    .map((user) => ({
      ...user,
      isFollowing: false,
      isFollowedBy: isFollowing(user.id, "current-user"),
      mutualFollowers: getMutualFollowers(user.id),
    }));

  return NextResponse.json({
    data: suggestions,
    success: true,
  });
}
