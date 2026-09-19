import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

import ChatHeader from "./chat-header";
import MessageInput from "./message-input";
import MessageList from "./message-list";
import { Conversation, Message } from "@/lib/types";

type ChatWindowProps = {
  loadingMessages?: boolean;
  conversation: Conversation;
  messages: Record<string, Message[]>;
  onSendMessage: (content: string) => void;
  onBack: () => void;
};

export default function ChatWindow({
  conversation,
  messages,
  loadingMessages,
  onSendMessage,
  onBack,
}: ChatWindowProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col justify-between gap-3 overflow-y-auto p-2 ">
      {/* Header */}
      <div className="flex shrink-0 items-center border-b">
        <Button
          variant="ghost"
          size="icon"
          className="ml-2 md:hidden"
          onClick={onBack}
          aria-label="Back to conversations"
        >
          <ArrowLeft />
        </Button>

        <div className="flex-1">
          <ChatHeader conversation={conversation} />
        </div>
      </div>

      {conversation && (
        <MessageList
          conversation={conversation}
          conversationId={conversation.id}
          messages={messages}
          loadingMessages={loadingMessages}
        />
      )}

      {/* Fixed input */}
      <div className="shrink-0 border-t">
        <MessageInput conversationId={conversation.id} onSend={onSendMessage} />
      </div>
    </div>
  );
}
