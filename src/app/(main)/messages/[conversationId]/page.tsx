import ConversationPageClient from "./ConversationPageClient";

export function generateStaticParams() {
  return [
    { conversationId: "conv-1" },
    { conversationId: "conv-2" },
    { conversationId: "conv-3" },
    { conversationId: "conv-4" },
    { conversationId: "conv-5" },
  ];
}

export default function ConversationPage() {
  return <ConversationPageClient />;
}
