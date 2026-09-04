import { Input } from "@/components/ui/input";
import { Conversation } from "@/lib/message/message";
import ConversationItem from "./conversation-item";

type ConversationListProps = {
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  onSelectConversation: (conversation: Conversation) => void;
};

export default function ConversationList({
  conversations,
  selectedConversation,
  onSelectConversation,
}: ConversationListProps) {
  return (
    <div className="flex min-h-0 flex-col border-r">
      <div className="border-b p-4">
        <Input placeholder="Search conversations" />
      </div>

      <div className="flex flex-1 flex-col overflow-y-auto">
        {conversations.map((conversation) => (
          <ConversationItem
            key={conversation.id}
            conversation={conversation}
            selected={selectedConversation?.id === conversation.id}
            onSelect={onSelectConversation}
          />
        ))}
      </div>
    </div>
  );
}
