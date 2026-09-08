// lib/stores/message-store.ts

import { create } from "zustand";
import { Conversation, Message } from "../types";
import { persist } from "zustand/middleware";
import { conversations } from "../social-data";

type MessageState = {
  conversations: Conversation[];

  messagesByConversation: Record<string, Message[]>;

  setConversations: (conversation: Conversation[]) => void;

  setMessages: (conversationId: string, messages: Message[]) => void;

  addMessage: (conversationId: string, message: Message) => void;

  updateMessage: (conversationId: string, message: Message) => void;

  removeMessage: (conversationId: string, messageId: string) => void;

  clearConversation: (conversationId: string) => void;

  markConversationAsRead: (conversationId: string) => void;

  resetMessages: () => void;
};

export const useMessageStore = create<MessageState>()(
  persist(
    (set) => ({
      conversations: [],
      messagesByConversation: {},

      setConversations: (conversation) => set({ conversations: conversation }),

      setMessages: (conversationId, messages) =>
        set((state) => ({
          messagesByConversation: {
            ...state.messagesByConversation,
            [conversationId]: messages,
          },
        })),

      addMessage: (conversationId, message) =>
        set((state) => ({
          messagesByConversation: {
            ...state.messagesByConversation,

            [conversationId]: [
              ...(state.messagesByConversation[conversationId] ?? []),
              message,
            ],
          },
        })),

      updateMessage: (conversationId, message) =>
        set((state) => ({
          messagesByConversation: {
            ...state.messagesByConversation,

            [conversationId]: (
              state.messagesByConversation[conversationId] ?? []
            ).map((item) => (item.id === message.id ? message : item)),
          },
        })),

      removeMessage: (conversationId, messageId) =>
        set((state) => ({
          messagesByConversation: {
            ...state.messagesByConversation,

            [conversationId]: (
              state.messagesByConversation[conversationId] ?? []
            ).filter((message) => message.id !== messageId),
          },
        })),

      clearConversation: (conversationId) =>
        set((state) => {
          const messages = {
            ...state.messagesByConversation,
          };

          delete messages[conversationId];

          return {
            messagesByConversation: messages,
          };
        }),

      markConversationAsRead: (conversationId: string) =>
        set((state) => ({
          conversations: state.conversations.map((conversation) =>
            conversation.id === conversationId
              ? {
                  ...conversation,
                  unread: 0,
                }
              : conversation,
          ),
        })),

      resetMessages: () =>
        set({ messagesByConversation: {}, conversations: [] }),
    }),

    {
      name: "hike-messages-data",
    },
  ),
);
