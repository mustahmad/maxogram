import { NextRequest, NextResponse } from "next/server";
import { currentMockUser } from "@/data/users";

export async function GET(request: NextRequest) {
  await new Promise((r) => setTimeout(r, 150));

  const authHeader = request.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");

  if (!token) {
    return NextResponse.json(
      { data: null, success: false, message: "Unauthorized" },
      { status: 401 },
    );
  }

  return NextResponse.json(
    {
      data: { user: currentMockUser },
      success: true,
    },
    { status: 200 },
  );
}
