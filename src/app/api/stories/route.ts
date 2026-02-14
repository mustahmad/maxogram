import { NextRequest, NextResponse } from "next/server";
import { mockStoryGroups } from "@/data/stories";
import { generateId } from "@/lib/utils";
import { currentMockUser } from "@/data/users";
import type { Story, StoryGroup } from "@/types";

export async function GET() {
  await new Promise((r) => setTimeout(r, 150));

  return NextResponse.json({
    data: mockStoryGroups,
    success: true,
  });
}

export async function POST(request: NextRequest) {
  await new Promise((r) => setTimeout(r, 150));

  try {
    const body = await request.json();
    const { mediaUrl, mediaType, duration } = body as {
      mediaUrl: string;
      mediaType: "image" | "video";
      duration?: number;
    };

    const now = new Date();
    const expires = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const newStory: Story = {
      id: generateId(),
      authorId: currentMockUser.id,
      mediaUrl,
      mediaType: mediaType ?? "image",
      duration: duration ?? 5,
      viewersCount: 0,
      isViewed: false,
      createdAt: now.toISOString(),
      expiresAt: expires.toISOString(),
    };

    const storyGroup: StoryGroup = {
      user: {
        id: currentMockUser.id,
        username: currentMockUser.username,
        displayName: currentMockUser.displayName,
        avatarUrl: currentMockUser.avatarUrl,
      },
      stories: [newStory],
      hasUnviewed: true,
    };

    return NextResponse.json(
      { data: storyGroup, success: true, message: "Story created" },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      { data: null, success: false, message: "Invalid request body" },
      { status: 400 },
    );
  }
}
