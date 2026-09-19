import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

import ChatHeader from "./chat-header";

import { Conversation, Message } from "@/lib/types";
import MessageListRefactored from "./(message)/message-list-refactored";
import MessageInput from "./(message)/message-input";

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
    <div className="flex min-h-0 flex-1 flex-col justify-between gap-3 overflow-y-auto p-1 ">
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
        <MessageListRefactored
          conversation={conversation}
          messages={messages}
          loadingMessages={loadingMessages}
        />
      )}

      {/* Fixed input */}
      <div className="shrink-0 border-t pt-1">
        <MessageInput conversationId={conversation.id} onSend={onSendMessage} />
      </div>
    </div>
  );
}
