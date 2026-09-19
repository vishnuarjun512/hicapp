"use client";

import { FormEvent, KeyboardEvent, useRef, useState } from "react";

import { ImageIcon, PaperclipIcon, PlusIcon, Send } from "lucide-react";

import { toast } from "sonner";

import { Textarea } from "@/components/ui/textarea";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";

type MessageInputProps = {
  conversationId: string;
  onSend: (content: string) => void;
};

export default function MessageInput({
  conversationId,
  onSend,
}: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (e?: FormEvent<HTMLFormElement>) => {
    e?.preventDefault();

    const content = message.trim();

    if (!content || isSending) {
      return;
    }

    try {
      setIsSending(true);

      /*
       * TODO:
       *
       * websocket.send(
       *   JSON.stringify({
       *     type: "SEND_MESSAGE",
       *     conversationId,
       *     content,
       *   }),
       * );
       */

      onSend(content);

      setMessage("");

      // Reset textarea height after sending.
      if (textareaRef.current) {
        textareaRef.current.style.height = "20px";
      }

      requestAnimationFrame(() => {
        textareaRef.current?.focus();
      });
    } catch {
      toast.error("Couldn't send message");
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    /*
     * Enter
     * → Send
     *
     * Shift + Enter
     * → New line
     */

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      void handleSubmit();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;

    setMessage(textarea.value);

    /*
     * Automatically grow only when necessary.
     *
     * Normal:
     * 20px
     *
     * Multiple lines:
     * grows up to 120px
     */

    textarea.style.height = "20px";

    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
  };

  const hasMessage = message.trim().length > 0;

  return (
    <form onSubmit={handleSubmit} className="border-t bg-background p-2">
      <div
        className="
          flex
          min-h-11
          items-center
          gap-1
          rounded-2xl
          border
          bg-background
          px-1.5
          py-1.5
          shadow-sm
        "
      >
        {/* =====================================================
            ATTACHMENTS
            ===================================================== */}

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled={isSending}
                aria-label="Add attachment"
                className="
                size-8
                shrink-0
                rounded-full
                text-muted-foreground
                hover:text-foreground
              "
              />
            }
          >
            <PlusIcon className="size-4" />
          </DropdownMenuTrigger>

          <DropdownMenuContent align="start" side="top" className="w-48">
            <DropdownMenuItem>
              <PaperclipIcon />
              Attach files
            </DropdownMenuItem>

            <DropdownMenuItem>
              <ImageIcon />
              Add photos
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem>
              <ImageIcon />
              Create image
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* =====================================================
            MESSAGE TEXT
            ===================================================== */}

        <Textarea
          ref={textareaRef}
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={isSending}
          placeholder="Write a message..."
          rows={1}
          aria-label="Message"
          className="
            min-h-5
            h-5
            max-h-30
            flex-1
            resize-none
            overflow-y-auto
            border-0
            bg-transparent
            px-1
            py-0
            text-sm
            leading-5
            shadow-none
            outline-none
            focus-visible:ring-0
            focus-visible:ring-offset-0
          "
        />

        {/* =====================================================
            SEND
            ===================================================== */}

        <Button
          type="submit"
          size="icon"
          disabled={!hasMessage || isSending}
          aria-label="Send message"
          className="
            size-8
            shrink-0
            rounded-full
          "
        >
          <Send className="size-4" />
        </Button>
      </div>
    </form>
  );
}
