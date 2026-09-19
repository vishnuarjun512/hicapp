"use client";

import {
  Message as ShadcnMessage,
  MessageContent,
} from "@/components/ui/message";

import { Bubble, BubbleContent } from "@/components/ui/bubble";

import { Message } from "@/lib/types";

import MessageActions from "./message-actions";
import { formatMessageTime, formatSeenTime } from "./message-utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type MessageItemProps = {
  message: Message;

  isMine: boolean;

  showSeen: boolean;
  showAvatar: boolean;

  otherParticipant: any;

  openActions: boolean;

  onActionsOpenChange: (open: boolean) => void;

  onCopy: (message: Message) => void;

  onReply?: (message: Message) => void;

  onEdit?: (message: Message) => void;

  onDelete?: () => void;
};

export default function MessageItem({
  message,
  isMine,
  showSeen,
  showAvatar,
  openActions,
  otherParticipant,
  onActionsOpenChange,
  onCopy,
  onReply,
  onEdit,
  onDelete,
}: MessageItemProps) {
  return (
    <div className="group w-full ">
      <ShadcnMessage align={isMine ? "end" : "start"} className="w-full ">
        <MessageContent className="w-full ">
          {/* =====================================================
              MESSAGE CONTAINER
              ===================================================== */}

          <div
            className={`flex w-full ${
              isMine ? "justify-end pr-10" : "justify-start pl-10"
            }`}
          >
            <div
              className={`flex max-w-[82%] flex-col sm:max-w-[70%] ${
                isMine ? "items-end" : "items-start"
              }`}
            >
              {/* =================================================
        BUBBLE + ACTIONS + AVATAR
        ================================================= */}

              <div className="relative flex items-center gap-1">
                {/* My actions */}
                {isMine && (
                  <MessageActions
                    message={message}
                    isMine={true}
                    open={openActions}
                    onOpenChange={onActionsOpenChange}
                    onCopy={onCopy}
                    onReply={onReply}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                )}

                {/* Bubble */}
                <Bubble
                  variant={isMine ? "default" : "muted"}
                  className={` z-10 wrap-break-word whitespace-pre-wrap rounded-2xl text-sm leading-6 shadow-sm ${isMine ? "rounded-br-md" : "rounded-bl-md"}`}
                >
                  <BubbleContent>{message.content}</BubbleContent>
                </Bubble>

                {/* Other person's actions */}
                {!isMine && (
                  <MessageActions
                    message={message}
                    isMine={false}
                    open={openActions}
                    onOpenChange={onActionsOpenChange}
                    onCopy={onCopy}
                    onReply={onReply}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                )}

                {/* =================================================
          AVATAR

          Anchored to the BUBBLE ROW, NOT the whole
          message container.
          ================================================= */}

                {showAvatar && (
                  <Avatar
                    className={` absolute bottom-0 size-8 shrink-0 ${isMine ? "-right-10" : "-left-10"} `}
                  >
                    <AvatarImage
                      src={message.sender?.profile_pic_url ?? ""}
                      alt={message.sender?.name ?? "User"}
                    />

                    <AvatarFallback>
                      {message.sender?.name?.charAt(0).toUpperCase() ?? "U"}
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>

              {/* =================================================
        SEEN + TIME

        This can grow vertically without affecting the
        avatar because the avatar is anchored to the
        bubble row above.
        ================================================= */}

              <div
                className={`flex flex-col ${
                  isMine ? "items-end" : "items-start"
                }`}
              >
                {showSeen && otherParticipant?.lastReadAt && (
                  <span className="text-[10px] text-muted-foreground">
                    {formatSeenTime(otherParticipant.lastReadAt)}
                  </span>
                )}

                {/* Message time */}
                <div className="grid grid-rows-[0fr] opacity-0 transition-all duration-200 ease-out group-hover:grid-rows-[1fr] group-hover:opacity-100 group-hover:delay-800">
                  <div className="min-h-0 overflow-hidden">
                    <span className="block -translate-y-1 pt-0.5 text-[10px] text-muted-foreground transition-transform duration-200 ease-out group-hover:translate-y-0">
                      {formatMessageTime(message.created_at)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </MessageContent>
      </ShadcnMessage>
    </div>
  );
}
