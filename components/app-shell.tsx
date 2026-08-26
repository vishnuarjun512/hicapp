import { navItems } from "@/lib/social-data";
import Navbar from "./navbar";
import RightRail from "./right-rail";
import Sidebar from "./side-bar";

import {
  Bookmark,
  Home,
  MessageCircle,
  Settings,
  UserRound,
  Users,
} from "lucide-react";
import Link from "next/link";

export function AppShell({ children }: { children: React.ReactNode }) {
  const iconMap = {
    home: Home,
    users: Users,
    message: MessageCircle,
    user: UserRound,
    bookmark: Bookmark,
    settings: Settings,
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto flex max-w-7xl gap-8 px-4 py-8 lg:px-8">
        <Sidebar />
        <main className="min-w-0 flex-1">{children}</main>
        <RightRail />
      </div>
      <nav className="fixed inset-x-0 bottom-0 z-30 flex justify-around border-t bg-background/95 p-2 backdrop-blur lg:hidden">
        {navItems.slice(0, 5).map((item) => {
          const Icon = iconMap[item.icon as keyof typeof iconMap];
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-1 p-2 text-[10px] text-muted-foreground"
            >
              <Icon className="size-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
