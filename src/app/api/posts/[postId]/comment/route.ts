import { NextRequest, NextResponse } from "next/server";
import { getCommentsByPost } from "@/data/comments";
import { currentMockUser } from "@/data/users";
import { generateId } from "@/lib/utils";
import type { Comment } from "@/types";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ postId: string }> },
) {
  await new Promise((r) => setTimeout(r, 150));

  const { postId } = await params;
  const comments = getCommentsByPost(postId);

  return NextResponse.json({ data: comments, success: true });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> },
) {
  await new Promise((r) => setTimeout(r, 150));

  try {
    const { postId } = await params;
    const body = await request.json();
    const { content, parentId } = body as { content: string; parentId?: string };

    const newComment: Comment = {
      id: generateId(),
      postId,
      authorId: currentMockUser.id,
      author: {
        id: currentMockUser.id,
        username: currentMockUser.username,
        displayName: currentMockUser.displayName,
        avatarUrl: currentMockUser.avatarUrl,
      },
      content,
      likesCount: 0,
      isLiked: false,
      parentId,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json(
      { data: newComment, success: true, message: "Comment created" },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      { data: null, success: false, message: "Invalid request body" },
      { status: 400 },
    );
  }
}
