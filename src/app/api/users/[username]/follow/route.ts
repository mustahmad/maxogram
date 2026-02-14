import { NextRequest, NextResponse } from "next/server";
import { allUsers, followGraph, isFollowing } from "@/data/users";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ username: string }> },
) {
  await new Promise((r) => setTimeout(r, 150));

  const { username } = await params;
  const targetUser = allUsers.find((u) => u.username === username);

  if (!targetUser) {
    return NextResponse.json(
      { data: null, success: false, message: "User not found" },
      { status: 404 },
    );
  }

  const currentlyFollowing = isFollowing("current-user", targetUser.id);

  if (currentlyFollowing) {
    // Unfollow: remove from follow graph
    const index = followGraph["current-user"]?.indexOf(targetUser.id) ?? -1;
    if (index > -1) {
      followGraph["current-user"].splice(index, 1);
    }
  } else {
    // Follow: add to follow graph
    if (!followGraph["current-user"]) {
      followGraph["current-user"] = [];
    }
    followGraph["current-user"].push(targetUser.id);
  }

  return NextResponse.json({
    data: { isFollowing: !currentlyFollowing },
    success: true,
  });
}
