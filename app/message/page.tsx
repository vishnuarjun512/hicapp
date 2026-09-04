"use client";

import { useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";

import { useAuthStore } from "@/lib/stores/auth-store";
import { conversations } from "@/lib/social-data";

import { Conversation, Message } from "@/lib/message/message";
import ConversationList from "./(components)/conversation-list";
import ChatWindow from "./(components)/chat-window";

const typedConversations = conversations as Conversation[];

const mockMessages: Record<string, Message[]> = {
  [typedConversations[0]?.id ?? "default"]: [
    {
      id: "message-1",
      conversationId: typedConversations[0]?.id ?? "default",
      senderId: typedConversations[0]?.user.id ?? "user-1",
      receiverId: "current-user",
      content: typedConversations[0]?.preview ?? "",
      createdAt: new Date().toISOString(),
    },
    {
      id: "message-2",
      conversationId: typedConversations[0]?.id ?? "default",
      senderId: "current-user",
      receiverId: typedConversations[0]?.user.id ?? "user-1",
      content: "I have been thinking about that too. Let's catch up soon.",
      createdAt: new Date().toISOString(),
    },
  ],
};

export default function MessagesPage() {
  const { user } = useAuthStore();

  /*
   * IMPORTANT:
   *
   * null = no conversation selected
   * object = conversation currently being viewed
   */
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);

  const [messages, setMessages] =
    useState<Record<string, Message[]>>(mockMessages);

  const selectedMessages = useMemo(() => {
    if (!selectedConversation) {
      return [];
    }

    return messages[selectedConversation.id] ?? [];
  }, [messages, selectedConversation]);

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);

    /*
     * TODO:
     *
     * Later:
     *
     * 1. Fetch conversation history
     * 2. Mark messages as read
     * 3. Subscribe to WebSocket events
     */
  };

  const handleBackToConversations = () => {
    setSelectedConversation(null);
  };

  const handleSendMessage = (content: string) => {
    if (!selectedConversation || !user) {
      return;
    }

    const newMessage: Message = {
      id: crypto.randomUUID(),
      conversationId: selectedConversation.id,
      senderId: user.id,
      receiverId: selectedConversation.user.id,
      content,
      createdAt: new Date().toISOString(),
    };

    /*
     * For now we're just updating local state.
     *
     * TODO:
     * Replace this with your HTTP/WebSocket message service.
     */
    setMessages((currentMessages) => ({
      ...currentMessages,

      [selectedConversation.id]: [
        ...(currentMessages[selectedConversation.id] ?? []),
        newMessage,
      ],
    }));
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight">Messages</h1>

          <p className="mt-1 text-muted-foreground">
            Private conversations with your people.
          </p>
        </div>

        <Card className="overflow-hidden">
          <div className="grid h-140 md:grid-cols-[240px_1fr]">
            {/*
             * CONVERSATIONS
             *
             * Mobile:
             *   visible only when no conversation is selected
             *
             * Desktop:
             *   always visible
             */}
            <div className={selectedConversation ? "hidden md:block" : "block"}>
              <ConversationList
                conversations={typedConversations}
                selectedConversation={selectedConversation}
                onSelectConversation={handleSelectConversation}
              />
            </div>

            {/*
             * CHAT
             *
             * Mobile:
             *   visible only when conversation is selected
             *
             * Desktop:
             *   always visible
             */}
            <div className={selectedConversation ? "flex" : "hidden md:flex"}>
              {selectedConversation ? (
                <ChatWindow
                  conversation={selectedConversation}
                  messages={selectedMessages}
                  currentUserId={user?.id ?? "current-user"}
                  onSendMessage={handleSendMessage}
                  onBack={handleBackToConversations}
                />
              ) : (
                <div className="relative w-full">
                  <p className="absolute bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-gray-200 font-semibold">
                    Select a Conversation to start texting!
                  </p>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
