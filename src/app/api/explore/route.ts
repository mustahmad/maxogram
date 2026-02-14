import { NextRequest, NextResponse } from "next/server";
import { mockPosts } from "@/data/posts";
import { mockCategories } from "@/data/categories";

export async function GET(request: NextRequest) {
  await new Promise((r) => setTimeout(r, 150));

  const { searchParams } = request.nextUrl;
  const category = searchParams.get("category");
  const query = searchParams.get("q")?.toLowerCase();
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const pageSize = Math.max(1, parseInt(searchParams.get("pageSize") || "20", 10));

  let filtered = [...mockPosts];

  // Filter by category: match posts whose tags overlap with the category's trending tags
  if (category) {
    const cat = mockCategories.find(
      (c) => c.slug === category || c.name.toLowerCase() === category.toLowerCase(),
    );
    if (cat) {
      const catTags = new Set(cat.trendingTags.map((t) => t.toLowerCase()));
      filtered = filtered.filter((post) =>
        post.tags.some((tag) => catTags.has(tag.toLowerCase())),
      );
    }
  }

  // Filter by search query: match caption, tags, or author username
  if (query) {
    filtered = filtered.filter(
      (post) =>
        post.caption.toLowerCase().includes(query) ||
        post.tags.some((tag) => tag.toLowerCase().includes(query)) ||
        post.author.username.toLowerCase().includes(query),
    );
  }

  // Sort by engagement score desc
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
    categories: mockCategories,
  });
}
