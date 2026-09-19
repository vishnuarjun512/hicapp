"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { Copy, MoreHorizontal, Pencil, Reply, Trash2 } from "lucide-react";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { Conversation, Message } from "@/lib/types";

import { Skeleton } from "@/components/ui/skeleton";
import { useMessageStore } from "@/lib/stores/message-store";
import { useAuthStore } from "@/lib/stores/auth-store";

type MessageListProps = {
  conversation: Conversation;

  loadingMessages?: boolean;

  messages: Record<string, Message[]>;

  onDeleteMessage?: (message: Message, deleteForEveryone: boolean) => void;

  onEditMessage?: (message: Message) => void;

  onReplyMessage?: (message: Message) => void;
};

// ============================================================
// MESSAGE TIME
// ============================================================

function formatMessageTime(dateString: string) {
  const date = new Date(dateString);

  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

// ============================================================
// SEEN TIME
// ============================================================

function formatSeenTime(dateString: string) {
  const diff = Date.now() - new Date(dateString).getTime();

  const seconds = Math.floor(diff / 1000);

  const minutes = Math.floor(seconds / 60);

  const hours = Math.floor(minutes / 60);

  const days = Math.floor(hours / 24);

  if (seconds < 60) {
    return "Seen now";
  }

  if (minutes < 60) {
    return `Seen ${minutes}m ago`;
  }

  if (hours < 24) {
    return `Seen ${hours}h ago`;
  }

  return `Seen ${days}d ago`;
}

// ============================================================
// DATE LABEL
// ============================================================

function formatDateLabel(dateString: string) {
  const date = new Date(dateString);

  const today = new Date();

  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return "Today";
  }

  if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  }

  return date.toLocaleDateString([], {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
  });
}

// ============================================================
// SAME DAY
// ============================================================

function isSameDay(first: string, second: string) {
  return new Date(first).toDateString() === new Date(second).toDateString();
}

// ============================================================
// MESSAGE LIST
// ============================================================

export default function MessageList({
  conversation,
  loadingMessages,

  onDeleteMessage,
  onEditMessage,
  onReplyMessage,
}: MessageListProps) {
  const { user } = useAuthStore();
  const [deleteMessage, setDeleteMessage] = useState<Message | null>(null);

  const [openMessageId, setOpenMessageId] = useState<string | null>(null);
  const { messagesByConversation } = useMessageStore();

  const bottomRef = useRef<HTMLDivElement>(null);

  const messages = useMemo(() => {
    return messagesByConversation[conversation.id];
  }, [messagesByConversation]);

  const currentConversation = useMessageStore((state) =>
    state.conversations.find(
      (conversationItem) => conversationItem.id === conversation.id,
    ),
  );

  const otherParticipant: any = currentConversation?.participants.find(
    (participant) => participant.id !== user?.id,
  );

  const lastReadMessageId = useMemo(() => {
    const lastReadAt = otherParticipant?.lastReadAt;

    if (!lastReadAt) {
      return null;
    }

    const readTime = new Date(lastReadAt).getTime();

    for (let i = messages.length - 1; i >= 0; i--) {
      const message = messages[i];

      if (message.sender.id !== user?.id) {
        continue;
      }

      const messageTime = new Date(message.created_at).getTime();

      if (messageTime <= readTime) {
        return message.id;
      }
    }

    return null;
  }, [messages, user?.id, otherParticipant?.lastReadAt]);

  // ============================================================
  // AUTOMATICALLY SCROLL TO NEWEST MESSAGE
  // ============================================================

  const previousConversationId = useRef<string | null>(null);

  useEffect(() => {
    const isConversationChange =
      previousConversationId.current !== conversation.id;

    if (isConversationChange) {
      bottomRef.current?.scrollIntoView({
        behavior: "instant",
        block: "end",
      });

      previousConversationId.current = conversation.id;

      return;
    }

    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, conversation.id]);

  // ============================================================
  // COPY
  // ============================================================

  const handleCopy = async (message: Message) => {
    try {
      await navigator.clipboard.writeText(message.content);

      toast.success("Message copied");
    } catch {
      toast.error("Couldn't copy message");
    }
  };

  // ============================================================
  // DELETE
  // ============================================================

  const confirmDelete = (deleteForEveryone: boolean) => {
    if (!deleteMessage) {
      return;
    }

    onDeleteMessage?.(deleteMessage, deleteForEveryone);

    setDeleteMessage(null);
  };

  // ============================================================
  // LOADING
  // ============================================================

  if (loadingMessages) {
    return <MessageSkeleton />;
  }

  // ============================================================
  // EMPTY
  // ============================================================

  if (!messages.length) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center p-6">
        <div className="text-center">
          <p className="text-sm font-semibold">No messages yet</p>

          <p className="mt-1 text-xs text-muted-foreground">
            Start the conversation 👋
          </p>
        </div>
      </div>
    );
  }

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <>
      {/* ====================================================== 
          MESSAGE SCROLL AREA
      ====================================================== */}
      <div className="hide-scrollbar flex min-h-0 flex-1 flex-col overflow-y-auto px-3 py-2 sm:px-6 sm:py-3">
        {messages.map((message, index) => {
          const isMine = message.sender.id === user?.id;

          const previousMessage = messages[index - 1];

          const showDate =
            !previousMessage ||
            !isSameDay(previousMessage.created_at, message.created_at);

          // ==================================================
          // SHOULD SHOW SEEN?
          //
          // Show Seen only when:
          //
          // 1. This is my message
          // 2. The other participant has read this message
          // 3. They have NOT replied after my latest message
          // ==================================================

          const hasMessageFromOtherPersonAfter = messages
            .slice(index + 1)
            .some((nextMessage) => nextMessage.sender.id !== user?.id);

          const showSeen =
            isMine &&
            message.id === lastReadMessageId &&
            !hasMessageFromOtherPersonAfter;

          return (
            <div key={message.id} className="mt-2">
              {/* ================================================== */}
              {/* DATE SEPARATOR */}
              {/* ================================================== */}

              {showDate && (
                <div className="my-2 flex items-center gap-3">
                  <div className="h-px flex-1 bg-border" />

                  <span className="shrink-0 text-[11px] font-medium text-muted-foreground">
                    {formatDateLabel(message.created_at)}
                  </span>

                  <div className="h-px flex-1 bg-border" />
                </div>
              )}

              {/* ================================================== */}
              {/* MESSAGE ROW */}
              {/* ================================================== */}

              <div
                className={`group flex w-full ${
                  isMine ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`grid max-w-[82%] transition-all duration-200 ease-out sm:max-w-[70%] ${
                    isMine ? "justify-items-end" : "justify-items-start"
                  }`}
                >
                  {/* ================================================== */}
                  {/* MESSAGE BUBBLE */}
                  {/* ================================================== */}

                  <div className="flex flex-row items-end justify-center gap-2">
                    {/* ================================================== */}
                    {/* MY MESSAGE ACTIONS */}
                    {/* ================================================== */}

                    {isMine && (
                      <MessageActions
                        message={message}
                        isMine
                        open={openMessageId === message.id}
                        onOpenChange={(open) =>
                          setOpenMessageId(open ? message.id : null)
                        }
                        onCopy={handleCopy}
                        onReply={onReplyMessage}
                        onEdit={onEditMessage}
                        onDelete={() => setDeleteMessage(message)}
                      />
                    )}

                    {/* ================================================== */}
                    {/* BUBBLE */}
                    {/* ================================================== */}

                    <div
                      className={`relative z-10 wrap-break-word whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-6 shadow-sm sm:px-4 ${
                        isMine
                          ? "rounded-br-md bg-primary text-primary-foreground"
                          : "rounded-bl-md bg-muted"
                      }`}
                    >
                      {message.content}
                    </div>

                    {/* ================================================== */}
                    {/* OTHER MESSAGE ACTIONS */}
                    {/* ================================================== */}

                    {!isMine && (
                      <MessageActions
                        message={message}
                        isMine={false}
                        open={openMessageId === message.id}
                        onOpenChange={(open) =>
                          setOpenMessageId(open ? message.id : null)
                        }
                        onCopy={handleCopy}
                        onReply={onReplyMessage}
                        onEdit={onEditMessage}
                        onDelete={() => setDeleteMessage(message)}
                      />
                    )}
                  </div>

                  {/* ================================================== */}
                  {/* SEEN + MESSAGE TIME */}
                  {/* ================================================== */}

                  <div className="flex flex-col items-end">
                    {/* ================================================== */}
                    {/* SEEN */}
                    {/* ================================================== */}

                    {showSeen && otherParticipant?.lastReadAt && (
                      <span className="text-[10px] text-muted-foreground">
                        {formatSeenTime(otherParticipant.lastReadAt)}
                      </span>
                    )}

                    {/* ================================================== */}
                    {/* MESSAGE TIME */}
                    {/* ================================================== */}

                    <div
                      className="
                      grid
                      grid-rows-[0fr]
                      opacity-0
                      transition-all
                      duration-200
                      ease-out
                      group-hover:grid-rows-[1fr]
                      group-hover:opacity-100
                      group-hover:delay-800
                    "
                    >
                      <div className="min-h-0 overflow-hidden">
                        <span
                          className="
                          block
                          -translate-y-1
                          pt-0.5
                          text-[10px]
                          text-muted-foreground
                          transition-transform
                          duration-200
                          ease-out
                          group-hover:translate-y-0
                        "
                        >
                          {formatMessageTime(message.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        <div ref={bottomRef} />
      </div>
      {/* ====================================================== */}
      {/* DELETE CONFIRMATION */}
      {/* ====================================================== */}
      <AlertDialog
        open={!!deleteMessage}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteMessage(null);
          }
        }}
      >
        <AlertDialogContent className="max-w-[calc(100%-2rem)] rounded-xl sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete message?</AlertDialogTitle>

            <AlertDialogDescription>
              What would you like to do with this message?
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="flex-col gap-2 sm:flex-row">
            <AlertDialogCancel>Cancel</AlertDialogCancel>

            <Button onClick={() => confirmDelete(false)}>Delete for me</Button>

            <Button onClick={() => confirmDelete(true)}>
              Delete for everyone
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// ============================================================
// MESSAGE SKELETON
// ============================================================

function MessageSkeleton() {
  return (
    <div className="flex min-h-0 flex-1 flex-col justify-end gap-3 overflow-hidden px-3 py-3 sm:px-6">
      {/* Other person's messages */}

      <div className="flex justify-start">
        <div className="space-y-1">
          <Skeleton className="h-9 w-40 rounded-2xl rounded-bl-md" />

          <Skeleton className="h-2 w-10" />
        </div>
      </div>

      <div className="flex justify-start">
        <Skeleton className="h-9 w-56 rounded-2xl rounded-bl-md" />
      </div>

      {/* Your messages */}

      <div className="flex justify-end">
        <div className="space-y-1">
          <Skeleton className="h-9 w-48 rounded-2xl rounded-br-md" />

          <div className="flex justify-end">
            <Skeleton className="h-2 w-10" />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Skeleton className="h-9 w-32 rounded-2xl rounded-br-md" />
      </div>

      <div className="flex justify-start">
        <Skeleton className="h-12 w-64 rounded-2xl rounded-bl-md" />
      </div>
    </div>
  );
}

// ============================================================
// MESSAGE ACTIONS
// ============================================================

type MessageActionsProps = {
  message: Message;

  isMine: boolean;

  open: boolean;

  onOpenChange: (open: boolean) => void;

  onCopy: (message: Message) => void;

  onReply?: (message: Message) => void;

  onEdit?: (message: Message) => void;

  onDelete?: () => void;
};

function MessageActions({
  message,
  isMine,
  open,
  onOpenChange,
  onCopy,
  onReply,
  onEdit,
  onDelete,
}: MessageActionsProps) {
  return (
    <DropdownMenu open={open} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="size-8 shrink-0 text-muted-foreground opacity-100 transition-opacity hover:text-foreground sm:opacity-0 sm:group-hover:opacity-100"
            aria-label="Message options"
          />
        }
      >
        <MoreHorizontal className="size-4" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align={isMine ? "end" : "start"} className="w-44">
        <DropdownMenuItem onClick={() => onCopy(message)}>
          <Copy />
          Copy
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => onReply?.(message)}>
          <Reply />
          Reply
        </DropdownMenuItem>

        {isMine && (
          <>
            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={() => onEdit?.(message)}>
              <Pencil />
              Edit
            </DropdownMenuItem>

            <DropdownMenuItem variant="destructive" onClick={onDelete}>
              <Trash2 />
              Delete
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
