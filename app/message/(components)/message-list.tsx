"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

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
import { Message } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

type MessageListProps = {
  loadingMessages?: boolean;
  conversationId: string | null;
  messages: Record<string, Message[]>;
  currentUserId: string;

  onDeleteMessage?: (message: Message, deleteForEveryone: boolean) => void;

  onEditMessage?: (message: Message) => void;

  onReplyMessage?: (message: Message) => void;
};

function formatMessageTime(dateString: string) {
  const date = new Date(dateString);

  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

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

function isSameDay(first: string, second: string) {
  return new Date(first).toDateString() === new Date(second).toDateString();
}

export default function MessageList({
  loadingMessages,
  messages,
  currentUserId,
  conversationId,
  onDeleteMessage,
  onEditMessage,
  onReplyMessage,
}: MessageListProps) {
  const [deleteMessage, setDeleteMessage] = useState<Message | null>(null);

  const [openMessageId, setOpenMessageId] = useState<string | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);

  const conversationMessages = conversationId
    ? (messages[conversationId] ?? [])
    : [];

  const sortedMessages = useMemo(() => {
    return [...conversationMessages].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
  }, [conversationMessages]);

  /*
   * Automatically scroll to the newest message.
   *
   * The ref is placed at the very bottom of the scroll container,
   * so scrollIntoView() moves only the message area.
   */
  const previousConversationId = useRef<string | null>(null);

  useEffect(() => {
    const isConversationChange =
      previousConversationId.current !== conversationId;

    if (isConversationChange) {
      bottomRef.current?.scrollIntoView({
        behavior: "instant",
        block: "end",
      });

      previousConversationId.current = conversationId;
      return;
    }

    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [sortedMessages, conversationId]);

  const handleCopy = async (message: Message) => {
    try {
      await navigator.clipboard.writeText(message.content);

      toast.success("Message copied");
    } catch {
      toast.error("Couldn't copy message");
    }
  };

  const confirmDelete = (deleteForEveryone: boolean) => {
    if (!deleteMessage) return;

    onDeleteMessage?.(deleteMessage, deleteForEveryone);

    setDeleteMessage(null);
  };

  /*
   * Empty state
   *
   * All hooks are above this return.
   * This is important because React requires hooks
   * to execute in the same order on every render.
   */
  if (loadingMessages) {
    return <MessageSkeleton />;
  }

  if (!sortedMessages.length) {
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

  return (
    <>
      {/* Message scroll area */}
      <div className="hide-scrollbar flex min-h-0 flex-1 flex-col overflow-y-auto px-3 py-2 sm:px-6 sm:py-3">
        {sortedMessages.map((message, index) => {
          const isMine = message.sender.id === currentUserId;

          const previousMessage = sortedMessages[index - 1];

          const showDate =
            !previousMessage ||
            !isSameDay(previousMessage.createdAt, message.createdAt);

          return (
            <div key={message.id} className="mt-2">
              {/* Date separator */}
              {showDate && (
                <div className="my-2 flex items-center gap-3">
                  <div className="h-px flex-1 bg-border" />

                  <span className="shrink-0 text-[11px] font-medium text-muted-foreground">
                    {formatDateLabel(message.createdAt)}
                  </span>

                  <div className="h-px flex-1 bg-border" />
                </div>
              )}

              {/* Message row */}
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
                  {/* Message bubble */}
                  <div className="flex flex-row justify-center items-end gap-2">
                    {/* My message actions */}
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
                    <div
                      className={`relative z-10 wrap-break-word whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-6 shadow-sm sm:px-4 ${
                        isMine
                          ? "rounded-br-md bg-primary text-primary-foreground"
                          : "rounded-bl-md bg-muted"
                      }`}
                    >
                      {message.content}
                    </div>
                    {/* My message actions */}
                    {!isMine && (
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
                  </div>

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
                        {formatMessageTime(message.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        <div ref={bottomRef} />
      </div>

      {/* Delete confirmation */}
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
