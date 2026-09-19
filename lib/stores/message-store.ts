// lib/stores/message-store.ts

import { create } from "zustand";
import { persist } from "zustand/middleware";

import { Conversation, Message } from "../types";
import { useAuthStore } from "./auth-store";

type MessageState = {
  conversations: Conversation[];
  messagesByConversation: Record<string, Message[]>;

  activeConversationId: string | null;

  setActiveConversation: (conversationId: string | null) => void;

  setConversations: (conversations: Conversation[]) => void;

  setMessages: (conversationId: string, messages: Message[]) => void;

  receivedMessage: (conversationId: string, message: Message) => void;

  updateMessage: (conversationId: string, message: Message) => void;

  removeMessage: (conversationId: string, messageId: string) => void;

  clearConversation: (conversationId: string) => void;

  markConversationAsRead: (conversationId: string) => void;

  updateParticipantReadState: (
    conversationId: string,
    userId: string,
    lastReadAt: string,
  ) => void;

  resetMessages: () => void;
};

export const useMessageStore = create<MessageState>()(
  persist(
    (set) => ({
      conversations: [],

      messagesByConversation: {},

      activeConversationId: null,

      // ==========================================
      // ACTIVE CONVERSATION
      // ==========================================

      setActiveConversation: (conversationId) =>
        set({
          activeConversationId: conversationId,
        }),

      // ==========================================
      // CONVERSATIONS
      // ==========================================

      setConversations: (conversations) =>
        set({
          conversations,
        }),

      // ==========================================
      // LOAD MESSAGES
      // ==========================================

      setMessages: (conversationId, messages) =>
        set((state) => ({
          messagesByConversation: {
            ...state.messagesByConversation,

            [conversationId]: messages,
          },
        })),

      // ==========================================
      // RECEIVE MESSAGE
      // ==========================================

      receivedMessage: (conversationId, message) =>
        set((state) => {
          const existingMessages =
            state.messagesByConversation[conversationId] ?? [];

          if (existingMessages.some((item) => item.id === message.id)) {
            return state;
          }

          const currentUserId = useAuthStore.getState().user?.id;

          const isOwnMessage = message.sender.id === currentUserId;

          const isActive = state.activeConversationId === conversationId;

          const shouldIncreaseUnread = !isOwnMessage && !isActive;

          console.log({
            isOwnMessage,
            isActive,
            shouldIncreaseUnread,
          });

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
                    unread: shouldIncreaseUnread
                      ? conversation.unread + 1
                      : conversation.unread,
                  }
                : conversation,
            ),
          };
        }),
      // ==========================================
      // UPDATE MESSAGE
      // ==========================================

      updateMessage: (conversationId, message) =>
        set((state) => ({
          messagesByConversation: {
            ...state.messagesByConversation,

            [conversationId]: (
              state.messagesByConversation[conversationId] ?? []
            ).map((item) => (item.id === message.id ? message : item)),
          },
        })),

      // ==========================================
      // REMOVE MESSAGE
      // ==========================================

      removeMessage: (conversationId, messageId) =>
        set((state) => ({
          messagesByConversation: {
            ...state.messagesByConversation,

            [conversationId]: (
              state.messagesByConversation[conversationId] ?? []
            ).filter((message) => message.id !== messageId),
          },
        })),

      // ==========================================
      // CLEAR CONVERSATION
      // ==========================================

      clearConversation: (conversationId) =>
        set((state) => {
          const { [conversationId]: _removedMessages, ...remainingMessages } =
            state.messagesByConversation;

          return {
            messagesByConversation: remainingMessages,
          };
        }),

      // ==========================================
      // MARK CONVERSATION AS READ
      // ==========================================

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

      // ==========================================
      // UPDATE PARTICIPANT READ STATE
      // ==========================================

      updateParticipantReadState: (conversationId, userId, lastReadAt) =>
        set((state) => ({
          conversations: state.conversations.map((conversation) => {
            if (conversation.id !== conversationId) {
              return conversation;
            }

            return {
              ...conversation,

              participants: conversation.participants.map((participant) =>
                participant.id === userId
                  ? {
                      ...participant,
                      lastReadAt,
                    }
                  : participant,
              ),
            };
          }),
        })),

      // ==========================================
      // RESET
      // ==========================================

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
