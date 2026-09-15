"use client";

import { useEffect, useState } from "react";

import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { useAuthStore } from "@/lib/stores/auth-store";

import {
  getConversationMessages,
  getConversations,
} from "@/app/(apiCalls)/message/message-api";

import { Conversation } from "@/lib/types";

import { useApi } from "@/app/(apiCalls)/useApi";
import { useMessageStore } from "@/lib/stores/message-store";
import { useWebSocket } from "@/components/WebSocketProvider";
import ConversationList from "./(components)/conversation-list";
import ChatWindow from "./(components)/chat-window";

export default function MessagesPage() {
  const { user } = useAuthStore();
  const { execute } = useApi();
  const {
    messagesByConversation,
    setMessages,

    conversations,
    setConversations,
    markConversationAsRead,
    receivedMessage,
  } = useMessageStore();

  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);

  const [loadingConversations, setLoadingConversations] = useState(true);

  const [loadingMessages, setLoadingMessages] = useState(false);

  //  GET CONVERSATIONS

  useEffect(() => {
    if (!user?.id) return;

    const loadConversations = async () => {
      try {
        setLoadingConversations(true);

        const data = await execute(() => getConversations(user.id));
        setConversations(data);
      } catch (error) {
        console.error("Failed to load conversations:", error);
      } finally {
        setLoadingConversations(false);
      }
    };

    loadConversations();
  }, [user]);

  useEffect(() => {
    if (!selectedConversation) {
      return;
    }

    const loadMessages = async () => {
      const existingMessages =
        useMessageStore.getState().messagesByConversation[
          selectedConversation.id
        ];

      if (existingMessages) {
        return;
      }
      setLoadingMessages(true);
      try {
        const data = await execute(() =>
          getConversationMessages(selectedConversation.id),
        );

        setMessages(selectedConversation.id, data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingMessages(false);
      }
    };

    if (selectedConversation.unread > 0) {
      sendMessageWs({
        type: "conversation:read",
        conversationId: selectedConversation.id,
      });
    }

    loadMessages();
  }, [selectedConversation]);

  // SELECT CONVERSATION
  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);

    markConversationAsRead(conversation.id);

    if (conversation.unread > 0) {
      sendMessageWs({
        type: "conversation:read",
        conversationId: conversation.id,
      });
    }
  };

  //  SEND MESSAGE
  const handleSendMessage = async (content: string) => {
    if (!selectedConversation) return;

    try {
      // const newMessage = await sendMessage(selectedConversation.id, content);
      sendMessageWs({
        type: "message:send",
        conversationId: selectedConversation.id,
        content,
      });
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  //  MOBILE BACK
  const handleBack = () => {
    setSelectedConversation(null);
  };

  const { connected, sendMessageWs } = useWebSocket();

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl">
        <div className="mb-4">
          <h1 className="text-3xl font-semibold tracking-tight">Messages</h1>

          <p className="mt-1 text-muted-foreground">
            Private conversations with your people.
          </p>
          <p>WebSocket: {connected ? "Connected 🟢" : "Disconnected 🔴"}</p>
          <button>Test WebSocket</button>
        </div>

        <Card className="overflow-hidden p-1">
          <div className="grid h-145 min-h-0 md:grid-cols-[240px_1fr]">
            {/* -------------------------------- */}
            {/* CONVERSATIONS */}
            {/* -------------------------------- */}

            <div
              className={
                selectedConversation
                  ? "hidden min-h-0 md:block"
                  : "block min-h-0"
              }
            >
              <ConversationList
                conversations={conversations}
                selectedConversation={selectedConversation}
                onSelectConversation={handleSelectConversation}
              />
            </div>

            {/* -------------------------------- */}
            {/* CHAT */}
            {/* -------------------------------- */}

            <div
              className={
                selectedConversation
                  ? "flex min-h-0 min-w-0"
                  : "hidden min-h-0 min-w-0 md:flex"
              }
            >
              {selectedConversation && (
                <ChatWindow
                  loadingMessages={loadingMessages}
                  conversation={selectedConversation}
                  messages={messagesByConversation}
                  currentUserId={user?.id ?? ""}
                  onSendMessage={handleSendMessage}
                  onBack={handleBack}
                />
              )}
            </div>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
