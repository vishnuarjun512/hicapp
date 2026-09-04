import { Message } from "./message";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function getConversationMessages(
  conversationId: string,
): Promise<Message[]> {
  // TODO:
  // GET /conversations/:conversationId/messages

  console.log("TODO: Fetch messages for conversation:", conversationId);

  return [];
}

export async function sendMessage(
  conversationId: string,
  content: string,
): Promise<Message> {
  // TODO:
  // POST /conversations/:conversationId/messages

  console.log("TODO: Send message:", {
    conversationId,
    content,
  });

  throw new Error("sendMessage is not implemented yet");
}
