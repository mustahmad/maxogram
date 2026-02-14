import { NextRequest, NextResponse } from "next/server";
import { mockReels } from "@/data/reels";

export async function GET(
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

  return NextResponse.json({ data: reel, success: true });
}
