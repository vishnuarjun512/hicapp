import { apiFetch } from "../api";
import { Conversation, Message } from "../../types";

export async function getConversations(userId: string) {
  const url = "/conversation";
  const response = await apiFetch(url, {
    method: "GET",
  });

  const data = await response.json();

  return data.conversations;
}

export async function getConversationMessages(conversationId: string) {
  const url = `/conversations/${conversationId}/messages`;

  const response = await apiFetch(url, {
    method: "GET",
  });

  const data = await response.json();
  return data.messages;
}

export async function createConversation(
  user_id: string,
): Promise<Conversation[]> {
  const response = await apiFetch(`/conversation`, {
    method: "POST",
    body: JSON.stringify({
      otherUserId: user_id,
    }),
  });

  const data = await response.json();

  return data.conversation;
}

export async function sendMessage(
  conversationId: string,
  content: string,
): Promise<Message> {
  const response = await apiFetch(`/conversations/${conversationId}/messages`, {
    method: "POST",
    body: JSON.stringify({
      content,
    }),
  });

  const data = await response.json();

  return data.message;
}

export async function markMessageAsRead(messageId: string) {
  const response = await apiFetch(`/messages/${messageId}/read`, {
    method: "PATCH",
  });

  return await response.json();
}
