import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { Bell } from "lucide-react";
import UserAvatar from "./user-avatar";

import type { Notification } from "@/lib/types";
import { useDataStore } from "@/lib/stores/data-store";
import { Badge } from "./ui/badge";

interface NotificationBoxProps {
  unreadNotificationCount: number;
}

const NotificationBox: React.FC<NotificationBoxProps> = ({
  unreadNotificationCount,
}) => {
  const { notifications } = useDataStore();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label="Notifications"
            className="relative"
          />
        }
      >
        <Bell />
        {unreadNotificationCount > 0 && (
          <Badge className="absolute -right-1 -top-1 size-4 justify-center rounded-full p-0 text-[10px]">
            {unreadNotificationCount}
          </Badge>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 mt-5 p-2" align="end">
        {notifications.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-sm text-muted-foreground">No notifications</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              className={`flex items-center gap-3 cursor-pointer ${
                !notification.is_read ? "bg-muted/50" : ""
              }`}
            >
              <UserAvatar user={notification.actor} size="size-8" />

              <div className="min-w-0 flex-1">
                <p className="text-sm">
                  <span className="font-semibold">
                    {notification.actor.name}
                  </span>{" "}
                  {getNotificationText(notification)}
                </p>

                <p className="text-[10px] text-muted-foreground">
                  {formatNotificationTime(notification.created_at)}
                </p>
              </div>

              {!notification.is_read && (
                <span className="size-2 shrink-0 rounded-full bg-primary" />
              )}
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const formatNotificationTime = (date: string) => {
  const createdAt = new Date(date);
  const now = new Date();

  const diff = now.getTime() - createdAt.getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) {
    return "just now";
  }

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  if (hours < 24) {
    return `${hours}h ago`;
  }

  if (days < 7) {
    return `${days}d ago`;
  }

  return createdAt.toLocaleDateString();
};

const getNotificationText = (notification: Notification) => {
  switch (notification.type) {
    case "friend_request":
      return "sent you a friend request.";

    case "friend_request_accepted":
      return "accepted your friend request.";

    case "post_like":
      return "liked your post.";

    case "post_comment":
      return "commented on your post.";

    default:
      return "sent you a notification.";
  }
};

export default NotificationBox;
