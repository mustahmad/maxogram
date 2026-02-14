import { NextResponse } from "next/server";
import { mockNotifications } from "@/data/notifications";

export async function GET() {
  await new Promise((r) => setTimeout(r, 150));

  return NextResponse.json({
    data: mockNotifications,
    success: true,
  });
}
