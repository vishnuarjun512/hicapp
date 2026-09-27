"use client";

import { navItems, users } from "@/lib/social-data";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Button } from "./ui/button";
import Link from "next/link";
import {
  Bookmark,
  Home,
  MessageCircle,
  Search,
  Settings,
  UserRound,
  Users,
} from "lucide-react";
import { Input } from "./ui/input";
import UserAvatar from "./user-avatar";
import { Badge } from "./ui/badge";
import Brand from "./brand";

import { useMessageStore } from "@/lib/stores/message-store";
import NotificationBox from "./notification-box";
import { useDataStore } from "@/lib/stores/data-store";
import { useMemo, useState } from "react";
import { useAuthStore } from "@/lib/stores/auth-store";

export default function Navbar() {
  const iconMap = {
    home: Home,
    users: Users,
    message: MessageCircle,
    user: UserRound,
    bookmark: Bookmark,
    settings: Settings,
  };
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const results = useMemo(
    () =>
      users.filter(
        (user) =>
          user.name.toLowerCase().includes(search.toLowerCase()) ||
          user.handle.includes(search),
      ),
    [search],
  );

  const { user } = useAuthStore();
  const { conversations } = useMessageStore();
  const { notifications } = useDataStore();

  const unreadMessageCount =
    conversations?.reduce(
      (total, conversation) => total + conversation.unread,
      0,
    ) ?? 0;

  const unreadNotificationCount = notifications.reduce(
    (total, notification) => total + (notification.is_read ? 0 : 1),
    0,
  );

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 lg:px-8">
        <Sheet>
          <SheetTrigger
            className="inline-flex size-8 items-center justify-center rounded-lg hover:bg-muted lg:hidden"
            aria-label="Open menu"
          ></SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>
                <Brand />
              </SheetTitle>
            </SheetHeader>
            <nav className="mt-8 flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm hover:bg-muted"
                >
                  <span>
                    {iconMap[item.icon as keyof typeof iconMap] &&
                      (() => {
                        const Icon = iconMap[item.icon as keyof typeof iconMap];
                        return <Icon className="size-4" />;
                      })()}
                  </span>
                  {item.label}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
        <Brand />
        <div className="relative ml-auto hidden w-full max-w-sm md:block">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onFocus={() => setOpen(true)}
            onChange={(e) => {
              setSearch(e.target.value);
              setOpen(true);
            }}
            placeholder="Search people and posts"
            className="pl-9"
          />
          {open && (
            <div className="absolute top-12 w-full rounded-xl border bg-popover p-2 shadow-lg">
              {search ? (
                results.map((user) => (
                  <Link
                    onClick={() => setOpen(false)}
                    href={`/account/${user.handle}`}
                    key={user.handle}
                    className="flex items-center gap-3 rounded-lg p-2 hover:bg-muted"
                  >
                    <UserAvatar user={user} size="size-8" />
                    <div>
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">
                        @{user.handle}
                      </p>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="p-3 text-sm text-muted-foreground">
                  Try searching for a name or topic.
                </p>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Link href="/message">
            <Button variant="ghost" size="icon" aria-label="Messages">
              <MessageCircle />
              <Badge className="-ml-3 -mt-5 size-4 justify-center rounded-full p-0 text-[10px]">
                {unreadMessageCount}
              </Badge>
            </Button>
          </Link>
          <NotificationBox unreadNotificationCount={unreadNotificationCount} />
          <Link href="/profile">{user && <UserAvatar user={user} />}</Link>
        </div>
      </div>
    </header>
  );
}
