"use client";
import { navItems } from "@/lib/social-data";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";

import {
  Bookmark,
  Home,
  MessageCircle,
  Settings,
  UserRound,
  Users,
} from "lucide-react";

import { useMessageStore } from "@/lib/stores/message-store";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/stores/auth-store";

export default function Sidebar() {
  const iconMap = {
    home: Home,
    users: Users,
    message: MessageCircle,
    user: UserRound,
    bookmark: Bookmark,
    settings: Settings,
  };

  const { conversations } = useMessageStore();
  const { user } = useAuthStore();

  const [messageCount, setMessageCount] = useState(0);
  useEffect(() => {
    if (!user) {
      return;
    }

    const value =
      conversations && conversations?.length > 0
        ? conversations?.reduce(
            (total, conversation) => total + conversation.unread,
            0,
          )
        : 0;
    setMessageCount(value);
  }, [user]);

  const pathname = usePathname();
  return (
    <aside className="sticky top-24 hidden h-fit w-52 shrink-0 lg:block">
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => {
          const Icon = iconMap[item.icon as keyof typeof iconMap];
          const active =
            pathname === item.href ||
            (item.href !== "/app" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-colors ${active ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
            >
              <Icon className="size-4" />
              {item.label}
              {item.label === "Messages" && messageCount > 0 && (
                <Badge
                  variant={active ? "secondary" : "default"}
                  className="ml-auto size-5 justify-center rounded-full p-0 text-[10px]"
                >
                  {messageCount}
                </Badge>
              )}
            </Link>
          );
        })}
      </nav>
      <Separator className="my-6" />
      <div className="rounded-2xl bg-muted/60 p-4">
        <p className="text-sm font-medium">
          Make your corner of the internet kinder.
        </p>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
          Follow people who make you think, laugh, and look closer.
        </p>
        <Link href="/friends">
          <Button size="sm" className="mt-4 w-full">
            Find people
          </Button>
        </Link>
      </div>
    </aside>
  );
}
