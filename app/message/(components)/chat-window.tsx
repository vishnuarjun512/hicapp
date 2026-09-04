import { Conversation, Message } from "@/lib/message/message";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

import ChatHeader from "./chat-header";
import MessageInput from "./message-input";
import MessageList from "./message-list";

type ChatWindowProps = {
  conversation: Conversation;
  messages: Message[];
  currentUserId: string;
  onSendMessage: (content: string) => void;
  onBack: () => void;
};

export default function ChatWindow({
  conversation,
  messages,
  currentUserId,
  onSendMessage,
  onBack,
}: ChatWindowProps) {
  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <div className="flex items-center border-b">
        {/* Mobile back button */}
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

      <MessageList messages={messages} currentUserId={currentUserId} />

      <MessageInput conversationId={conversation.id} onSend={onSendMessage} />
    </div>
  );
}
