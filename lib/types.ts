import { User } from "@/lib/stores/auth-store";

export type Conversation = {
  id: string;
  participants: User[];
  preview: string;
  unread: number;
  isOnline?: boolean;
  lastMessageAt?: string;
};

export type Message = {
  id: string;
  conversationId: string;
  sender: User;
  content: string;
  created_at: string;
  readAt?: string | null;
};
