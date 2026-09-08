"use client";

import { useEffect } from "react";

export default function WebSocketTest() {
  useEffect(() => {
    const socket = new WebSocket("ws://localhost:4000");

    socket.onopen = () => {
      console.log("🟢 WebSocket connected");
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      console.log("📨 Message from server:", data);
    };

    socket.onclose = () => {
      console.log("🔴 WebSocket disconnected");
    };

    socket.onerror = (error) => {
      console.log("⚠️ WebSocket error:", error);
    };

    return () => {
      socket.close();
    };
  }, []);

  return null;
}
