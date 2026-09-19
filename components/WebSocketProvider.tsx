"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { useMessageStore } from "@/lib/stores/message-store";
import { useApi } from "@/lib/(apiCalls)/useApi";
import { getConversations } from "@/lib/(apiCalls)/message/message-api";

type WebSocketProviderProps = {
  children: ReactNode;
};

type WebSocketContextType = {
  connected: boolean;
  sendMessageWs: (message: any) => void;
};

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export const WebSocketProvider = ({ children }: WebSocketProviderProps) => {
  const socketRef = useRef<WebSocket | null>(null);

  const [connected, setConnected] = useState(false);

  const { receivedMessage, updateParticipantReadState, setConversations } =
    useMessageStore();
  const { execute } = useApi();

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:4000");

    socketRef.current = socket;

    socket.onopen = async () => {
      // console.log("🟢 WebSocket connected");
      setConnected(true);
      const data: any = await execute(() => getConversations());
      setConversations(data);
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        console.log("📨 WebSocket event:", data);

        // =========================================
        // NEW MESSAGE
        // =========================================

        if (data.type === "message:backend->frontend") {
          const activeConversationId =
            useMessageStore.getState().activeConversationId;
          const message = data.message;

          receivedMessage(message.conversation_id, message);
          // If I'm currently viewing this conversation,
          // the newly received message is immediately read.
          if (activeConversationId === message.conversation_id) {
            sendMessageWs({
              type: "conversation:read(frontend->backend)",
              conversationId: message.conversation_id,
            });
          }
          return;
        }

        // =========================================
        // CONVERSATION READ
        // =========================================
        if (data.type === "conversation:read(backend->frontend)") {
          useMessageStore
            .getState()
            .updateParticipantReadState(
              data.conversationId,
              data.userId,
              data.lastReadAt,
            );

          return;
        }
      } catch (error) {
        console.error("❌ Failed to process WebSocket message:", error);
      }
    };

    socket.onerror = (error) => {
      console.log("⚠️ WebSocket error:", error);
      // console.log("WebSocket URL:", socket.url);
      // console.log("WebSocket state:", socket.readyState);
    };

    socket.onclose = (event) => {
      // console.log("🔴 WebSocket closed");

      // console.log({
      //   code: event.code,
      //   reason: event.reason,
      //   wasClean: event.wasClean,
      // });

      setConnected(false);
    };

    return () => {
      socket.close();

      socketRef.current = null;
    };
  }, [receivedMessage, updateParticipantReadState]);

  const sendMessageWs = (message: any) => {
    try {
      const socket = socketRef.current;

      if (!socket) {
        throw new Error("WebSocket is not connected");
      }

      if (socket.readyState !== WebSocket.OPEN) {
        throw new Error("WebSocket is not open");
      }

      socket.send(JSON.stringify(message));
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <WebSocketContext.Provider
      value={{
        connected,
        sendMessageWs,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);

  if (!context) {
    throw new Error("useWebSocket must be used inside WebSocketProvider");
  }

  return context;
};
