import { Message } from "@/lib/message/message";

type MessageListProps = {
  messages: Message[];
  currentUserId: string;
};

export default function MessageList({
  messages,
  currentUserId,
}: MessageListProps) {
  return (
    <div className="flex flex-1 flex-col justify-end gap-3 overflow-y-auto p-6">
      {messages.map((message) => {
        const isMine = message.sender.id === currentUserId;

        return (
          <div
            key={message.id}
            className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
              isMine
                ? "self-end rounded-br-sm bg-primary text-primary-foreground"
                : "self-start rounded-bl-sm bg-muted"
            }`}
          >
            {message.content}
          </div>
        );
      })}
    </div>
  );
}
