"use client";

import { useEffect, useState } from "react";

import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { useAuthStore } from "@/lib/stores/auth-store";

import {
  getConversationMessages,
  getConversations,
  sendMessage,
} from "@/lib/message/message-api";

import { Conversation, Message } from "@/lib/message/message";
import ChatWindow from "./(components)/chat-window";
import ConversationList from "./(components)/conversation-list";

export default function MessagesPage() {
  const { user } = useAuthStore();

  const [conversations, setConversations] = useState<Conversation[]>([]);

  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);

  const [messages, setMessages] = useState<Message[]>([]);

  const [loadingConversations, setLoadingConversations] = useState(true);

  const [loadingMessages, setLoadingMessages] = useState(false);

  /*
   * --------------------------------
   * GET CONVERSATIONS
   * --------------------------------
   */

  useEffect(() => {
    const loadConversations = async () => {
      if (!user) return null;
      try {
        setLoadingConversations(true);

        const data = await getConversations(user.id);

        setConversations(data);
      } catch (error) {
        console.error("Failed to load conversations:", error);
      } finally {
        setLoadingConversations(false);
      }
    };
    loadConversations();
  }, []);

  /*
   * --------------------------------
   * GET MESSAGES
   * --------------------------------
   */

  useEffect(() => {
    if (!selectedConversation) {
      setMessages([]);
      return;
    }

    const loadMessages = async () => {
      try {
        setLoadingMessages(true);

        const data = await getConversationMessages(selectedConversation.id);

        setMessages(data);
      } catch (error) {
        console.error("Failed to load messages:", error);
      } finally {
        setLoadingMessages(false);
      }
    };

    loadMessages();
  }, [selectedConversation?.id]);

  /*
   * --------------------------------
   * SELECT CONVERSATION
   * --------------------------------
   */

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
  };

  /*
   * --------------------------------
   * SEND MESSAGE
   * --------------------------------
   */

  const handleSendMessage = async (content: string) => {
    if (!selectedConversation) return;

    try {
      const newMessage = await sendMessage(selectedConversation.id, content);

      setMessages((currentMessages) => [...currentMessages, newMessage]);
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
    setSelectedConversation(null);
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
            {/* Conversations */}
            <div className={selectedConversation ? "hidden md:block" : "block"}>
              <ConversationList
                conversations={conversations}
                selectedConversation={selectedConversation}
                onSelectConversation={handleSelectConversation}
              />
            </div>

            {/* Chat */}
            <div className={selectedConversation ? "flex" : "hidden md:flex"}>
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
