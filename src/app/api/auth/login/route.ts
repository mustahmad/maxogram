import { NextRequest, NextResponse } from "next/server";
import { mockUsers, currentMockUser } from "@/data/users";

export async function POST(request: NextRequest) {
  await new Promise((r) => setTimeout(r, 150));

  try {
    const body = await request.json();
    const { email } = body as { email: string; password: string };

    const foundUser = mockUsers.find((u) => u.email === email);
    const user = foundUser ?? currentMockUser;

    return NextResponse.json(
      {
        data: { user, token: `mock-token-${user.id}` },
        success: true,
        message: "Login successful",
      },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      { data: null, success: false, message: "Invalid request body" },
      { status: 400 },
    );
  }
}
