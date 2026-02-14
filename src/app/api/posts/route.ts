import { NextRequest, NextResponse } from "next/server";
import { mockPosts } from "@/data/posts";
import { currentMockUser } from "@/data/users";
import { generateId } from "@/lib/utils";
import type { Post } from "@/types";

export async function GET(request: NextRequest) {
  await new Promise((r) => setTimeout(r, 150));

  try {
    const { searchParams } = request.nextUrl;
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const pageSize = Math.max(1, parseInt(searchParams.get("pageSize") || "10", 10));
    const userId = searchParams.get("userId");

    let filtered = [...mockPosts];

    if (userId) {
      filtered = filtered.filter((p) => p.authorId === userId);
    }

    // Sort by engagementScore descending
    filtered.sort((a, b) => b.engagementScore - a.engagementScore);

    const totalCount = filtered.length;
    const totalPages = Math.ceil(totalCount / pageSize);
    const start = (page - 1) * pageSize;
    const data = filtered.slice(start, start + pageSize);

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
  } catch {
    return NextResponse.json(
      { data: [], success: false, message: "Failed to fetch posts" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  await new Promise((r) => setTimeout(r, 150));

  try {
    const body = await request.json();
    const { caption, tags, location, media } = body as {
      caption: string;
      tags?: string[];
      location?: string;
      media?: Post["media"];
    };

    const newPost: Post = {
      id: generateId(),
      authorId: currentMockUser.id,
      author: {
        id: currentMockUser.id,
        username: currentMockUser.username,
        displayName: currentMockUser.displayName,
        avatarUrl: currentMockUser.avatarUrl,
        isVerified: currentMockUser.isVerified,
      },
      type: (media && media.length > 1) ? "carousel" : (media && media.length === 1) ? "photo" : "text",
      media: media ?? [],
      caption: caption ?? "",
      tags: tags ?? [],
      location,
      likesCount: 0,
      commentsCount: 0,
      savesCount: 0,
      sharesCount: 0,
      isLiked: false,
      isSaved: false,
      createdAt: new Date().toISOString(),
      engagementScore: 0,
      viewCount: 0,
    };

    return NextResponse.json(
      { data: newPost, success: true, message: "Post created" },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      { data: null, success: false, message: "Invalid request body" },
      { status: 400 },
    );
  }
}
