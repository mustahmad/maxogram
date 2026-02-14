import { NextRequest, NextResponse } from "next/server";
import { generateId } from "@/lib/utils";

export async function POST(request: NextRequest) {
  await new Promise((r) => setTimeout(r, 150));

  try {
    const body = await request.json();
    const { username, fullName, email } = body as {
      username: string;
      fullName: string;
      email: string;
      password: string;
    };

    const id = generateId();

    const newUser = {
      id,
      username,
      displayName: fullName,
      email,
      avatarUrl: `https://i.pravatar.cc/150?u=${username}`,
      bio: "",
      website: "",
      isPrivate: false,
      isVerified: false,
      followersCount: 0,
      followingCount: 0,
      postsCount: 0,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json(
      {
        data: { user: newUser, token: `mock-token-${id}` },
        success: true,
        message: "Registration successful",
      },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      { data: null, success: false, message: "Invalid request body" },
      { status: 400 },
    );
  }
}
