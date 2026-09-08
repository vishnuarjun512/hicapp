"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

type WebSocketProviderProps = {
  children: ReactNode;
};

type WebSocketContextType = {
  connected: boolean;
  sendMessageWs: (message: unknown) => void;
  lastMessage: any;
};

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export const WebSocketProvider = ({ children }: WebSocketProviderProps) => {
  const socketRef = useRef<WebSocket | null>(null);

  const [connected, setConnected] = useState(false);

  const [lastMessage, setLastMessage] = useState<any>(null);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:4000");

    socketRef.current = socket;

    socket.onopen = () => {
      console.log("🟢 WebSocket connected");
      setConnected(true);
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("📨 WebSocket message:", data);
      setLastMessage(data);
    };

    socket.onclose = () => {
      console.log("🔴 WebSocket disconnected");
      setConnected(false);
    };

    socket.onerror = (error) => {
      console.log("⚠️ WebSocket error:", error);
    };

    return () => {
      socket.close();
      socketRef.current = null;
    };
  }, []);

  const sendMessageWs = (message: unknown) => {
    if (!socketRef.current) {
      console.log("WebSocket is not connected");
      return;
    }

    if (socketRef.current.readyState !== WebSocket.OPEN) {
      console.log("WebSocket is not open");
      return;
    }

    socketRef.current.send(JSON.stringify(message));
  };

  return (
    <WebSocketContext.Provider
      value={{
        connected,
        sendMessageWs,
        lastMessage,
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
