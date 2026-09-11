"use client";
import { MessageActions } from "./message-actions";
type MessageBubbleProps = {
  message: Message;
  currentUserId: string;
  dateLabel?: string;
  showSeen: boolean;
  otherParticipant?: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCopy: (message: Message) => void;
  onReply?: (message: Message) => void;
  onEdit?: (message: Message) => void;
  onDelete?: () => void;
};
export default function MessageBubble({
  message,
  currentUserId,
  dateLabel,
  showSeen,
  otherParticipant,
  open,
  onOpenChange,
  onCopy,
  onReply,
  onEdit,
  onDelete,
}: MessageBubbleProps) {
  const isMine = message.sender.id === currentUserId;
  return (
    <div className="mt-2">
      {" "}
      {dateLabel && (
        <div className="my-2 flex items-center gap-3">
          {" "}
          <div className="h-px flex-1 bg-border" />{" "}
          <span className="shrink-0 text-[11px] font-medium text-muted-foreground">
            {" "}
            {dateLabel}{" "}
          </span>{" "}
          <div className="h-px flex-1 bg-border" />{" "}
        </div>
      )}{" "}
      <div
        className={`group flex w-full ${isMine ? "justify-end" : "justify-start"}`}
      >
        {" "}
        <div
          className={`grid max-w-[82%] transition-all duration-200 ease-out sm:max-w-[70%] ${isMine ? "justify-items-end" : "justify-items-start"}`}
        >
          {" "}
          <div className="flex flex-row items-end justify-center gap-2">
            {" "}
            {isMine && (
              <MessageActions
                message={message}
                isMine
                open={open}
                onOpenChange={onOpenChange}
                onCopy={onCopy}
                onReply={onReply}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            )}{" "}
            <div
              className={`relative z-10 wrap-break-word whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-6 shadow-sm sm:px-4 ${isMine ? "rounded-br-md bg-primary text-primary-foreground" : "rounded-bl-md bg-muted"}`}
            >
              {" "}
              {message.content}{" "}
            </div>{" "}
            {!isMine && (
              <MessageActions
                message={message}
                isMine={false}
                open={open}
                onOpenChange={onOpenChange}
                onCopy={onCopy}
                onReply={onReply}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            )}{" "}
          </div>{" "}
          <div className="flex flex-col items-end">
            {" "}
            {showSeen && otherParticipant?.lastReadAt && (
              <span className="text-[10px] text-muted-foreground">
                {" "}
                {formatSeenTime(otherParticipant.lastReadAt)}{" "}
              </span>
            )}{" "}
            <div className=" grid grid-rows-[0fr] opacity-0 transition-all duration-200 ease-out group-hover:grid-rows-[1fr] group-hover:opacity-100 group-hover:delay-800 ">
              {" "}
              <div className="min-h-0 overflow-hidden">
                {" "}
                <span className=" block -translate-y-1 pt-0.5 text-[10px] text-muted-foreground transition-transform duration-200 ease-out group-hover:translate-y-0 ">
                  {" "}
                  {formatMessageTime(message.createdAt)}{" "}
                </span>{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
}
