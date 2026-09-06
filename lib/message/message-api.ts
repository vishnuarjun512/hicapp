import { Conversation, Message } from "./message";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

async function parseResponse(response: Response) {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

export async function getConversations(
  userId: string,
): Promise<Conversation[]> {
  const response = await fetch(`${BASE_URL}/conversation`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  const data = await parseResponse(response);

  return data.conversations;
}

export async function getConversationMessages(
  conversationId: string,
): Promise<Message[]> {
  const response = await fetch(
    `${BASE_URL}/conversations/${conversationId}/messages`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  const data = await parseResponse(response);

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

  const data = await parseResponse(response);

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
    },
  );

  const data = await parseResponse(response);

  return data.message;
}

export async function markMessageAsRead(messageId: string) {
  const response = await fetch(`${BASE_URL}/messages/${messageId}/read`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return parseResponse(response);
}
