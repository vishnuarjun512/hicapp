import UserAvatar from "@/components/user-avatar";
import { useAuthStore } from "@/lib/stores/auth-store";
import { Conversation } from "@/lib/types";

type ChatHeaderProps = {
  conversation: Conversation;
};

export default function ChatHeader({ conversation }: ChatHeaderProps) {
  const { user } = useAuthStore();
  const participant = conversation.participants.filter(
    (p) => p.id != user?.id,
  )[0];

  return (
    <div className="flex items-center gap-3 border-b p-4">
      <UserAvatar user={participant} />

      <div className="min-w-0 flex-1">
        <p className="font-medium">{participant.name}</p>

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
