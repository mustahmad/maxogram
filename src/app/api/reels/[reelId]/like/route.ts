import { NextRequest, NextResponse } from "next/server";
import { mockReels } from "@/data/reels";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ reelId: string }> },
) {
  await new Promise((r) => setTimeout(r, 150));

  const { reelId } = await params;
  const reel = mockReels.find((r) => r.id === reelId);

  if (!reel) {
    return NextResponse.json(
      { data: null, success: false, message: "Reel not found" },
      { status: 404 },
    );
  }

  reel.isLiked = !reel.isLiked;
  reel.likesCount += reel.isLiked ? 1 : -1;

  return NextResponse.json({
    data: { isLiked: reel.isLiked, likesCount: reel.likesCount },
    success: true,
  });
}
