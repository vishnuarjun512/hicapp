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

// types/notification.ts

export type NotificationType =
  | "friend_request"
  | "friend_request_accepted"
  | "post_like"
  | "post_comment";

export interface Notification {
  id: string;
  created_at: string;
  is_read: boolean;
  post_id: string | null;
  type: NotificationType;
  actor: User;
}
