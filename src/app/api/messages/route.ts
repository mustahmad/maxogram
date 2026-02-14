import { NextResponse } from "next/server";
import { mockConversations } from "@/data/messages";

export async function GET() {
  await new Promise((r) => setTimeout(r, 150));

  return NextResponse.json({
    data: mockConversations,
    success: true,
  });
}
