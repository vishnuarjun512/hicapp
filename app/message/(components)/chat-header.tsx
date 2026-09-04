import UserAvatar from "@/components/user-avatar";
import { Conversation } from "@/lib/message/message";

type ChatHeaderProps = {
  conversation: Conversation;
};

export default function ChatHeader({ conversation }: ChatHeaderProps) {
  return (
    <div className="flex items-center gap-3 border-b p-4">
      <UserAvatar user={conversation.user} />

      <div className="min-w-0 flex-1">
        <p className="font-medium">{conversation.user.name}</p>

        <div className="flex items-center gap-2">
          <div
            className={`h-2 w-2 rounded-full ${
              conversation.isOnline ? "bg-green-500" : "bg-muted-foreground"
            }`}
          />

          <p className="text-xs text-muted-foreground">
            {conversation.isOnline ? "Active now" : "Offline"}
          </p>
        </div>
      </div>
    </div>
  );
}
