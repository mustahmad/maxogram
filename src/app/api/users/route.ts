import { NextRequest, NextResponse } from "next/server";
import { allUsers } from "@/data/users";

export async function GET(request: NextRequest) {
  await new Promise((r) => setTimeout(r, 150));

  const { searchParams } = request.nextUrl;
  const query = searchParams.get("q")?.toLowerCase() ?? "";

  if (!query) {
    return NextResponse.json({ data: allUsers, success: true });
  }

  const filtered = allUsers.filter(
    (u) =>
      u.username.toLowerCase().includes(query) ||
      u.displayName.toLowerCase().includes(query),
  );

  return NextResponse.json({ data: filtered, success: true });
}
