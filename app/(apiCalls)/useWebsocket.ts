"use client";

import { useEffect, useRef, useState } from "react";

export const useWebSocket = () => {
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

  return {
    connected,
    sendMessageWs,
    lastMessage,
  };
};
