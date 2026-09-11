// lib/stores/message-store.ts

import { create } from "zustand";
import { Conversation, Message } from "../types";
import { persist } from "zustand/middleware";
import { conversations } from "../social-data";

type MessageState = {
  conversations: Conversation[];

  messagesByConversation: Record<string, Message[]>;

  activeConversationId: string | null;

  setActiveConversation: (conversationId: string | null) => void;

  setConversations: (conversations: Conversation[]) => void;

  setMessages: (conversationId: string, messages: Message[]) => void;

  receivedMessage: (conversationId: string, message: Message) => void;

<<<<<<< HEAD
  updateParticipantReadState: (
    conversationId: string,
    userId: string,
    lastReadAt: string,
  ) => void;
=======
  receivedMessage: (conversationId: string, message: Message) => void;

  updateMessage: (conversationId: string, message: Message) => void;

  removeMessage: (conversationId: string, messageId: string) => void;

  clearConversation: (conversationId: string) => void;
>>>>>>> 736e7c20534841ad730a3ba91ffb9168c42b59f0

  markConversationAsRead: (conversationId: string) => void;

  resetMessages: () => void;
};

export const useMessageStore = create<MessageState>()(
  persist(
    (set) => ({
      conversations: [],

      messagesByConversation: {},

      activeConversationId: null,

      // ============================================
      // ACTIVE CONVERSATION
      // ============================================

      setActiveConversation: (conversationId) =>
        set({
          activeConversationId: conversationId,
        }),

      // ============================================
      // CONVERSATIONS
      // ============================================

      setConversations: (conversations) =>
        set({
          conversations,
        }),

      // ============================================
      // LOAD MESSAGES
      // ============================================

      setMessages: (conversationId, messages) =>
        set((state) => ({
          messagesByConversation: {
            ...state.messagesByConversation,

            [conversationId]: messages,
          },
        })),

      // ============================================
      // RECEIVE MESSAGE
      // ============================================

<<<<<<< HEAD
      receivedMessage: (conversationId, message) =>
=======
            [conversationId]: [
              ...(state.messagesByConversation[conversationId] ?? []),
              message,
            ],
          },
        })),

      receivedMessage: (conversationId, message) =>
        set((state) => ({
          messagesByConversation: {
            ...state.messagesByConversation,

            [conversationId]: [
              ...(state.messagesByConversation[conversationId] ?? []),
              message,
            ],
          },

          conversations: state.conversations.map((conversation) =>
            conversation.id === conversationId
              ? {
                  ...conversation,
                  preview: message.content,
                  unread: conversation.unread + 1,
                  lastMessageAt: message.createdAt,
                }
              : conversation,
          ),
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
>>>>>>> 736e7c20534841ad730a3ba91ffb9168c42b59f0
        set((state) => {
          const existingMessages =
            state.messagesByConversation[conversationId] ?? [];

          // Prevent duplicate messages
          if (existingMessages.some((item) => item.id === message.id)) {
            return state;
          }

          const isActive = state.activeConversationId === conversationId;

          return {
            messagesByConversation: {
              ...state.messagesByConversation,

              [conversationId]: [...existingMessages, message],
            },

            conversations: state.conversations.map((conversation) =>
              conversation.id === conversationId
                ? {
                    ...conversation,

                    preview: message.content,

                    lastMessageAt: message.createdAt,

                    unread: isActive
                      ? conversation.unread
                      : conversation.unread + 1,
                  }
                : conversation,
            ),
          };
        }),

      // ============================================
      // MARK CONVERSATION AS READ
      // ============================================

      markConversationAsRead: (conversationId) =>
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

      // ============================================
      // UPDATE PARTICIPANT READ STATE
      // ============================================
      updateParticipantReadState: (conversationId, userId, lastReadAt) =>
        set((state) => {
          console.log("🧠 Updating read state:", {
            conversationId,
            userId,
            lastReadAt,
          });

          const conversation = state.conversations.find(
            (conversation) => conversation.id === conversationId,
          );

          console.log("💬 Conversation before update:", conversation);

          return {
            conversations: state.conversations.map((conversation) => {
              if (conversation.id !== conversationId) {
                return conversation;
              }

              return {
                ...conversation,
                participants: conversation.participants.map((participant) => {
                  if (participant.id !== userId) {
                    return participant;
                  }

                  return {
                    ...participant,
                    lastReadAt,
                  };
                }),
              };
            }),
          };
        }),
      // ============================================
      // RESET
      // ============================================

      resetMessages: () =>
        set({
          messagesByConversation: {},
          conversations: [],
          activeConversationId: null,
        }),
    }),

    {
      name: "hike-messages-data",
    },
  ),
);
