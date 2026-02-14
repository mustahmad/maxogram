import { NextRequest, NextResponse } from "next/server";
import { mockPosts } from "@/data/posts";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ postId: string }> },
) {
  await new Promise((r) => setTimeout(r, 150));

  const { postId } = await params;
  const post = mockPosts.find((p) => p.id === postId);

  if (!post) {
    return NextResponse.json(
      { data: null, success: false, message: "Post not found" },
      { status: 404 },
    );
  }

  // Toggle save
  post.isSaved = !post.isSaved;

  return NextResponse.json({
    data: { isSaved: post.isSaved },
    success: true,
  });
}
