import { Conversation, Message } from "./message";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function getConversations(userId: string) {
  const response = await fetch(`${BASE_URL}/conversation`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  const data = await response.json();

  return data.conversations;
}

export async function getConversationMessages(
  conversationId: string,
): Promise<Message[]> {
  const url = `${BASE_URL}/conversations/${conversationId}/messages`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  const data = await response.json();
  return data.messages;
}

export async function createConversation(user_id: string) {
  const response = await fetch(`${BASE_URL}/conversation`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
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
  const response = await fetch(
    `${BASE_URL}/conversations/${conversationId}/messages`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content,
      }),
      credentials: "include",
    },
  );

  const data = await response.json();

  return data.message;
}

export async function markMessageAsRead(messageId: string) {
  const response = await fetch(`${BASE_URL}/messages/${messageId}/read`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return await response.json();
}
