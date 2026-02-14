import { NextResponse } from "next/server";
import { mockNotifications } from "@/data/notifications";

export async function POST() {
  await new Promise((r) => setTimeout(r, 150));

  // Mark all notifications as read
  for (const notification of mockNotifications) {
    notification.isRead = true;
  }

  return NextResponse.json({
    data: { success: true },
    success: true,
    message: "All notifications marked as read",
  });
}
