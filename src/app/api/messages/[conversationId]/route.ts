import { NextRequest, NextResponse } from "next/server";
import { getMessagesByConversation, mockConversations } from "@/data/messages";
import { currentMockUser } from "@/data/users";
import { generateId } from "@/lib/utils";
import type { Message } from "@/types";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ conversationId: string }> },
) {
  await new Promise((r) => setTimeout(r, 150));

  const { conversationId } = await params;
  const conversation = mockConversations.find((c) => c.id === conversationId);

  if (!conversation) {
    return NextResponse.json(
      { data: null, success: false, message: "Conversation not found" },
      { status: 404 },
    );
  }

  const messages = getMessagesByConversation(conversationId);

  return NextResponse.json({ data: messages, success: true });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ conversationId: string }> },
) {
  await new Promise((r) => setTimeout(r, 150));

  try {
    const { conversationId } = await params;
    const body = await request.json();
    const { content, type } = body as { content: string; type?: Message["type"] };

    const newMessage: Message = {
      id: generateId(),
      conversationId,
      senderId: currentMockUser.id,
      content,
      type: type ?? "text",
      isRead: false,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json(
      { data: newMessage, success: true, message: "Message sent" },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      { data: null, success: false, message: "Invalid request body" },
      { status: 400 },
    );
  }
}
