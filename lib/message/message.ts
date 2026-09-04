import { User } from "../stores/auth-store";

export type Message = {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
  readAt?: string | null;
};

export type Conversation = {
  id: string;
  user: User;
  preview: string;
  unread: number;

  // Later this can come from your backend/WebSocket presence system.
  isOnline?: boolean;
  lastMessageAt?: string;
};
