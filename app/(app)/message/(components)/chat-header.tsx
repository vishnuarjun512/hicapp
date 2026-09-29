"use client";

import {
  Archive,
  BellOff,
  CheckCheck,
  EllipsisVertical,
  Flag,
  Search,
  Trash,
  Trash2,
  UserRound,
} from "lucide-react";

import UserAvatar from "@/components/user-avatar";
import { useAuthStore } from "@/lib/stores/auth-store";
import { Conversation } from "@/lib/types";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type ChatHeaderProps = {
  conversation: Conversation;
};

export default function ChatHeader({ conversation }: ChatHeaderProps) {
  const { user } = useAuthStore();

  const participant = conversation.participants.find((p) => p.id !== user?.id);

  if (!participant) {
    return null;
  }

  const handleSearch = () => {
    // TODO: Open message search
    toast.info("Search messages");
  };

  const handleMute = () => {
    // TODO: Mute conversation
    toast.info("Conversation muted");
  };

  const handleMarkUnread = () => {
    // TODO: Mark conversation as unread
    toast.info("Marked as unread");
  };

  const handleProfile = () => {
    // TODO: Navigate to profile
    toast.info("Open profile");
  };

  const handleArchive = () => {
    // TODO: Archive conversation
    toast.info("Conversation archived");
  };

  const handleClearChat = () => {
    // TODO: Clear messages
    toast.info("Clear chat");
  };

  const handleDeleteConversation = () => {
    // TODO: Clear messages
    toast.success("Deleted Conversation");
  };

  const handleBlock = () => {
    // TODO: Block user
    toast.info("Block user");
  };

  const handleReport = () => {
    // TODO: Report conversation/user
    toast.info("Report");
  };

  return (
    <div className="flex items-center gap-3 border-b p-4">
      {/* User */}
      <UserAvatar user={participant} />

      {/* User information */}
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">{participant.name}</p>

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

      {/* Conversation menu */}
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0"
              aria-label="Conversation options"
            />
          }
        >
          <EllipsisVertical />
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem onClick={handleSearch}>
            <Search />
            Search messages
          </DropdownMenuItem>

          <DropdownMenuItem onClick={handleProfile}>
            <UserRound />
            View profile
          </DropdownMenuItem>

          <DropdownMenuItem onClick={handleMute}>
            <BellOff />
            Mute notifications
          </DropdownMenuItem>

          <DropdownMenuItem onClick={handleMarkUnread}>
            <CheckCheck />
            Mark as unread
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={handleArchive}>
            <Archive />
            Archive conversation
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={handleClearChat}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 />
            Clear chat
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={handleDeleteConversation}
            className="text-destructive focus:text-destructive"
          >
            <Trash />
            Delete Conversation
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={handleBlock}
            className="text-destructive focus:text-destructive"
          >
            <BellOff />
            Block user
          </DropdownMenuItem>

          <DropdownMenuItem onClick={handleReport}>
            <Flag />
            Report
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
