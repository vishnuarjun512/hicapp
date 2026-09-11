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
<<<<<<< HEAD

=======
>>>>>>> 736e7c20534841ad730a3ba91ffb9168c42b59f0
  sender: User;
  content: string;
  createdAt: string;
  readAt?: string | null;
};
