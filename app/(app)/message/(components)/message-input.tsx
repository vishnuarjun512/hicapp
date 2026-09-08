"use client";

import { FormEvent, useState } from "react";
import { Send } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type MessageInputProps = {
  conversationId: string;
  onSend: (content: string) => void;
};

export default function MessageInput({
  conversationId,
  onSend,
}: MessageInputProps) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const content = message.trim();

    if (!content) return;

    /*
     * TODO: Later this can call:
     *
     * websocket.send(
     *   JSON.stringify({
     *     type: "SEND_MESSAGE",
     *     conversationId,
     *     content,
     *   })
     * );
     */

    onSend(content);

    toast.success("Message sent");

    setMessage("");
  };

  return (
    <form className="flex gap-2 border-t p-4" onSubmit={handleSubmit}>
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Write a message..."
      />

      <Button type="submit" size="icon" aria-label="Send message">
        <Send />
      </Button>
    </form>
  );
}
