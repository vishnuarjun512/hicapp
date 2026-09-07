"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { useAuthStore } from "@/lib/stores/auth-store";

import {
  getConversationMessages,
  getConversations,
  sendMessage,
} from "@/app/(apiCalls)/message/message-api";

import { Conversation, Message } from "@/lib/types";

import ChatWindow from "./chat-window";
import ConversationList from "./conversation-list";
import { useApi } from "@/app/(apiCalls)/useApi";
import { useDataStore } from "@/lib/stores/data-store";

type MessagesPageProps = {
  conversationId: string | null;
};

export default function MessagesPage({ conversationId }: MessagesPageProps) {
  const { user } = useAuthStore();
  const { execute } = useApi();
  const router = useRouter();
  const { conversations, setConversations, messages, setMessages } =
    useDataStore();

  const selectedConversation =
    conversationId && conversations && conversations.length > 0
      ? (conversations.find(
          (conversation) => conversation.id === conversationId,
        ) ?? null)
      : null;

  const [loadingConversations, setLoadingConversations] = useState(true);

  const [loadingMessages, setLoadingMessages] = useState(false);

  /*
   * --------------------------------
   * GET CONVERSATIONS
   * --------------------------------
   */

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
  }, [user?.id]);

  /*
   * --------------------------------
   * SELECT CONVERSATION FROM URL
   * --------------------------------
   *
   * The URL is the source of truth.
   *
   * /message
   *      -> conversationId = null
   *
   * /message/123
   *      -> conversationId = "123"
   */

  /*
   * --------------------------------
   * GET MESSAGES
   * --------------------------------
   *
   * Fetch messages ONLY from conversationId.
   */

  useEffect(() => {
    if (!conversationId) {
      setMessages([]);
      return;
    }

    const loadMessages = async () => {
      try {
        setLoadingMessages(true);

        const data = await getConversationMessages(conversationId);

        setMessages(data);
      } catch (error) {
        console.error("Failed to load messages:", error);

        setMessages([]);
      } finally {
        setLoadingMessages(false);
      }
    };

    loadMessages();
  }, [conversationId]);

  /*
   * --------------------------------
   * SELECT CONVERSATION
   * --------------------------------
   */

  const handleSelectConversation = (conversation: Conversation) => {
    router.push(`/message/${conversation.id}`);
  };

  /*
   * --------------------------------
   * SEND MESSAGE
   * --------------------------------
   */

  const handleSendMessage = async (content: string) => {
    if (!conversationId) return;

    try {
      const newMessage = await sendMessage(conversationId, content);

      setMessages([...messages, newMessage]);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  /*
   * --------------------------------
   * MOBILE BACK
   * --------------------------------
   */

  const handleBack = () => {
    router.push("/message");
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl">
        <div className="mb-4">
          <h1 className="text-3xl font-semibold tracking-tight">Messages</h1>

          <p className="mt-1 text-muted-foreground">
            Private conversations with your people.
          </p>
        </div>

        <Card className="overflow-hidden p-1">
          <div className="grid h-160 min-h-0 md:grid-cols-[240px_1fr]">
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
                  conversation={selectedConversation}
                  messages={messages}
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
