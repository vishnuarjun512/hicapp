import { Badge } from "@/components/ui/badge";
import UserAvatar from "@/components/user-avatar";
import { useAuthStore } from "@/lib/stores/auth-store";
import { Conversation } from "@/lib/types";
import { Button } from "@base-ui/react";

type ConversationItemProps = {
  conversation: Conversation;
  selected: boolean;
  onSelect: (conversation: Conversation) => void;
};

export default function ConversationItem({
  conversation,
  selected,
  onSelect,
}: ConversationItemProps) {
  const { user } = useAuthStore();
  const participants = conversation.participants.filter(
    (p) => p.id != user?.id,
  );
  return (
    <button
      type="button"
      onClick={() => onSelect(conversation)}
      className={`flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-muted cursor-pointer ${
        selected ? "bg-muted" : ""
      }`}
    >
      <UserAvatar user={participants[0]} size="size-9" />

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{participants[0].name}</p>

        <p className="truncate text-xs text-muted-foreground">
          {conversation.preview}
        </p>
      </div>

      {conversation.unread > 0 && <Badge>{conversation.unread}</Badge>}
    </button>
  );
}
