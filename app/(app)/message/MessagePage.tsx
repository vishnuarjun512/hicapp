"use client";

import { useEffect, useState } from "react";

import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";

import { getConversationMessages } from "@/lib/(apiCalls)/message/message-api";

import { Conversation } from "@/lib/types";

import { useApi } from "@/lib/(apiCalls)/useApi";
import { useMessageStore } from "@/lib/stores/message-store";
import { useWebSocket } from "@/components/WebSocketProvider";
import ConversationList from "./(components)/(conversation)/conversation-list";
import ChatWindow from "./(components)/chat-window";

export default function MessagesPage() {
  const { execute } = useApi();
  const {
    messagesByConversation,
    setMessages,
    setActiveConversation,
    conversations,
    markConversationAsRead,
    setHasMoreMessages,
  } = useMessageStore();

  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);

  const [loadingMessages, setLoadingMessages] = useState(false);

  useEffect(() => {
    if (!selectedConversation) return;

    const conversationId = selectedConversation.id;

    const existingMessages =
      useMessageStore.getState().messagesByConversation[conversationId];

    // Already loaded → don't call API again
    if (Array.isArray(existingMessages)) {
      return;
    }

    const loadMessages = async () => {
      setLoadingMessages(true);

      try {
        const data = await execute(() =>
          getConversationMessages(conversationId, 10),
        );

        console.log("Data ->", data);

        setMessages(conversationId, data.messages);
        setHasMoreMessages(conversationId, data.hasMore);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingMessages(false);
      }
    };

    loadMessages();
  }, [selectedConversation]);

  // SELECT CONVERSATION
  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setActiveConversation(conversation.id);

    markConversationAsRead(conversation.id);

    sendMessageWs({
      type: "conversation:read(frontend->backend)",
      conversationId: conversation.id,
    });
  };

  //  SEND MESSAGE
  const handleSendMessage = async (content: string) => {
    if (!selectedConversation) return;

    sendMessageWs({
      type: "message:frontend->backend",
      conversationId: selectedConversation.id,
      content,
    });
  };

  //  MOBILE BACK
  const handleBack = () => {
    setSelectedConversation(null);
    setActiveConversation(null);
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
