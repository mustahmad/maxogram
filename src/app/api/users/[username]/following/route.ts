import { NextRequest, NextResponse } from "next/server";
import { allUsers, followGraph } from "@/data/users";

export async function GET(
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

  // Following are the users listed in followGraph[targetUser.id]
  const followingIds = followGraph[targetUser.id] ?? [];

  const following = followingIds
    .map((id) => allUsers.find((u) => u.id === id))
    .filter(Boolean);

  return NextResponse.json({ data: following, success: true });
}
