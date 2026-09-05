import { User } from "../stores/auth-store";

export type Conversation = {
  id: string;
  user: User;
  preview: string;
  unread: number;
  isOnline?: boolean;
  lastMessageAt?: string;
};

export type Message = {
  id: string;
  conversationId: string;

  sender: {
    id: string;
    name: string;
    handle: string;
    profilePic?: string;
  };

  content: string;
  createdAt: string;
  readAt?: string | null;
};
