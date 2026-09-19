"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { Button } from "@/components/ui/button";

import { Message, Conversation } from "@/lib/types";

import { useMessageStore } from "@/lib/stores/message-store";
import { useAuthStore } from "@/lib/stores/auth-store";

import MessageItem from "./message-item";
import MessageSkeleton from "./message-skeleton";

import { formatDateLabel, isSameDay } from "./message-utils";

type MessageListProps = {
  conversation: Conversation;

  loadingMessages?: boolean;

  messages: Record<string, Message[]>;

  onDeleteMessage?: (message: Message, deleteForEveryone: boolean) => void;

  onEditMessage?: (message: Message) => void;

  onReplyMessage?: (message: Message) => void;
};

export default function MessageListRefactored({
  conversation,
  loadingMessages,
  messages,
  onDeleteMessage,
  onEditMessage,
  onReplyMessage,
}: MessageListProps) {
  const { user } = useAuthStore();

  const [deleteMessage, setDeleteMessage] = useState<Message | null>(null);

  const [openMessageId, setOpenMessageId] = useState<string | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);

  /*
   * ----------------------------------------------------------
   * MESSAGES
   * ----------------------------------------------------------
   */

  const conversationMessages = messages[conversation.id] ?? [];

  const sortedMessages = useMemo(() => {
    return [...conversationMessages].sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
    );
  }, [conversationMessages]);

  /*
   * ----------------------------------------------------------
   * OTHER PARTICIPANT
   * ----------------------------------------------------------
   */

  const currentConversation = useMessageStore((state) =>
    state.conversations.find((item) => item.id === conversation.id),
  );

  const otherParticipant: any = currentConversation?.participants.find(
    (participant) => participant.id !== user?.id,
  );

  /*
   * ----------------------------------------------------------
   * LAST READ MESSAGE
   * ----------------------------------------------------------
   */

  const lastReadMessageId = useMemo(() => {
    const lastReadAt = otherParticipant?.lastReadAt;

    if (!lastReadAt || !user?.id) {
      return null;
    }

    const readTime = new Date(lastReadAt).getTime();

    for (let index = sortedMessages.length - 1; index >= 0; index--) {
      const message = sortedMessages[index];

      if (message.sender.id !== user.id) {
        continue;
      }

      const messageTime = new Date(message.created_at).getTime();

      if (messageTime <= readTime) {
        return message.id;
      }
    }

    return null;
  }, [sortedMessages, user?.id, otherParticipant?.lastReadAt]);

  /*
   * ----------------------------------------------------------
   * HAS OTHER PERSON REPLIED
   * ----------------------------------------------------------
   */

  /*
   * ----------------------------------------------------------
   * AUTO SCROLL
   * ----------------------------------------------------------
   */

  const previousConversationId = useRef<string | null>(null);

  useEffect(() => {
    const conversationChanged =
      previousConversationId.current !== conversation.id;

    if (conversationChanged) {
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
  }, [sortedMessages, conversation.id]);

  /*
   * ----------------------------------------------------------
   * COPY
   * ----------------------------------------------------------
   */

  const handleCopy = async (message: Message) => {
    try {
      await navigator.clipboard.writeText(message.content);

      toast.success("Message copied");
    } catch {
      toast.error("Couldn't copy message");
    }
  };

  /*
   * ----------------------------------------------------------
   * DELETE
   * ----------------------------------------------------------
   */

  const confirmDelete = (deleteForEveryone: boolean) => {
    if (!deleteMessage) {
      return;
    }

    onDeleteMessage?.(deleteMessage, deleteForEveryone);

    setDeleteMessage(null);
  };

  /*
   * ----------------------------------------------------------
   * LOADING
   * ----------------------------------------------------------
   */

  if (loadingMessages) {
    return <MessageSkeleton />;
  }

  /*
   * ----------------------------------------------------------
   * EMPTY
   * ----------------------------------------------------------
   */

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

  /*
   * ----------------------------------------------------------
   * RENDER
   * ----------------------------------------------------------
   */

  return (
    <>
      <div className="hide-scrollbar flex min-h-0 flex-1 flex-col overflow-y-auto p-2">
        {sortedMessages.map((message, index) => {
          const isMine = message.sender.id === user?.id;

          const previousMessage = sortedMessages[index - 1];
          const nextMessage = sortedMessages[index + 1];

          const showAvatar =
            !nextMessage || nextMessage.sender.id !== message.sender.id;

          const showDate =
            !previousMessage ||
            !isSameDay(previousMessage.created_at, message.created_at);

          // Has the other person sent anything after THIS message?
          const hasOtherPersonRepliedAfter = sortedMessages
            .slice(index + 1)
            .some((nextMessage) => nextMessage.sender.id !== user?.id);

          const showSeen =
            isMine &&
            message.id === lastReadMessageId &&
            !hasOtherPersonRepliedAfter;

          return (
            <div key={message.id} className="mt-2">
              {/* Date separator */}

              {showDate && (
                <div className="my-2 flex items-center gap-3">
                  <div className="h-px flex-1 bg-border" />

                  <span className="shrink-0 text-[11px] font-medium text-muted-foreground">
                    {formatDateLabel(message.created_at)}
                  </span>

                  <div className="h-px flex-1 bg-border" />
                </div>
              )}

              {/* Message */}

              <MessageItem
                message={message}
                otherParticipant={otherParticipant}
                isMine={isMine}
                showAvatar={showAvatar}
                showSeen={showSeen}
                openActions={openMessageId === message.id}
                onActionsOpenChange={(open) =>
                  setOpenMessageId(open ? message.id : null)
                }
                onCopy={handleCopy}
                onReply={onReplyMessage}
                onEdit={onEditMessage}
                onDelete={() => setDeleteMessage(message)}
              />
            </div>
          );
        })}

        <div ref={bottomRef} />
      </div>

      {/* Delete dialog */}

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
