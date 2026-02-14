import { NextRequest, NextResponse } from "next/server";
import { mockReels } from "@/data/reels";

export async function GET(request: NextRequest) {
  await new Promise((r) => setTimeout(r, 150));

  const { searchParams } = request.nextUrl;
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const pageSize = Math.max(1, parseInt(searchParams.get("pageSize") || "5", 10));

  const sorted = [...mockReels].sort((a, b) => b.engagementScore - a.engagementScore);

  const totalCount = sorted.length;
  const totalPages = Math.ceil(totalCount / pageSize);
  const start = (page - 1) * pageSize;
  const data = sorted.slice(start, start + pageSize);

  return NextResponse.json({
    data,
    success: true,
    pagination: {
      page,
      pageSize,
      totalCount,
      totalPages,
      hasNext: page < totalPages,
    },
  });
}
