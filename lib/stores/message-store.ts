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

  updateParticipantReadState: (
    conversationId: string,
    userId: string,
    lastReadAt: string,
  ) => void;

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

      receivedMessage: (conversationId, message) =>
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
