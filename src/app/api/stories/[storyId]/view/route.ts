import { NextRequest, NextResponse } from "next/server";
import { mockStoryGroups } from "@/data/stories";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ storyId: string }> },
) {
  await new Promise((r) => setTimeout(r, 150));

  const { storyId } = await params;

  // Find and mark story as viewed
  for (const group of mockStoryGroups) {
    for (const story of group.stories) {
      if (story.id === storyId) {
        story.isViewed = true;
        story.viewersCount += 1;

        // Update group's hasUnviewed
        group.hasUnviewed = group.stories.some((s) => !s.isViewed);

        return NextResponse.json({
          data: { success: true },
          success: true,
        });
      }
    }
  }

  return NextResponse.json(
    { data: null, success: false, message: "Story not found" },
    { status: 404 },
  );
}
