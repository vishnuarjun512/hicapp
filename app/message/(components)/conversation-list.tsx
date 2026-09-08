import { Input } from "@/components/ui/input";
import ConversationItem from "./conversation-item";
import { Conversation } from "@/lib/types";

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
    <div className="flex min-h-0 flex-col border-r h-full">
      <div className="border-b p-4">
        <Input placeholder="Search conversations" />
      </div>

      <div className="flex flex-1 flex-col overflow-y-auto">
        {conversations &&
          conversations.length > 0 &&
          conversations.map((conversation) => (
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
