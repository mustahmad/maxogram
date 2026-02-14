import { NextRequest, NextResponse } from "next/server";
import { allUsers, isFollowing, getMutualFollowers } from "@/data/users";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ username: string }> },
) {
  await new Promise((r) => setTimeout(r, 150));

  const { username } = await params;
  const user = allUsers.find((u) => u.username === username);

  if (!user) {
    return NextResponse.json(
      { data: null, success: false, message: "User not found" },
      { status: 404 },
    );
  }

  const profile = {
    ...user,
    isFollowing: isFollowing("current-user", user.id),
    isFollowedBy: isFollowing(user.id, "current-user"),
    mutualFollowers: getMutualFollowers(user.id),
  };

  return NextResponse.json({ data: profile, success: true });
}
