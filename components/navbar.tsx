"use client";

import { users } from "@/lib/social-data";

import { Button } from "./ui/button";
import Link from "next/link";
import { Loader2, MessageCircle, Search, X } from "lucide-react";
import { Input } from "./ui/input";
import UserAvatar from "./user-avatar";
import { Badge } from "./ui/badge";
import Brand from "./brand";

import { useMessageStore } from "@/lib/stores/message-store";
import NotificationBox from "./notification-box";
import { useDataStore } from "@/lib/stores/data-store";
import { useEffect, useRef, useState } from "react";
import { useAuthStore, User } from "@/lib/stores/auth-store";
import { useRouter } from "next/navigation";
import { searchCall } from "@/lib/(apiCalls)/search/searchCall";

export default function Navbar() {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState<User[]>([]);

  const [loading, setLoading] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const query = search.trim();

    if (query.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    let isActive = true;
    const timer = setTimeout(async () => {
      try {
        setLoading(true);

        const data = await searchCall(query, "users");

        if (!isActive) return;

        setResults(Array.isArray(data.users) ? data.users.slice(0, 5) : []);
      } catch (error) {
        console.error("NAVBAR SEARCH ERROR:", error);

        if (isActive) {
          setResults([]);
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }, 400);

    return () => {
      isActive = false;
      clearTimeout(timer);
    };
  }, [search]);

  // Close tray when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event: PointerEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", handleOutsideClick);

    return () => {
      document.removeEventListener("pointerdown", handleOutsideClick);
    };
  }, []);

  const handleClearSearch = () => {
    setSearch("");
    setResults([]);
    setOpen(false);
  };

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

  const router = useRouter();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setOpen(false);
      return;
    }

    if (e.key === "Enter") {
      const query = search.trim();

      if (!query) return;

      setOpen(false);
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 lg:px-8">
        <Brand />

        {/* Search */}
        <div
          ref={searchRef}
          className="relative ml-auto hidden w-full max-w-sm md:block"
        >
          <Search className="absolute left-3 top-1/2 z-10 size-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            value={search}
            onFocus={() => setOpen(true)}
            onChange={(e) => {
              setSearch(e.target.value);
              setOpen(true);
            }}
            autoComplete="off"
            onKeyDown={handleKeyDown}
            placeholder="Search people and posts"
            className="pl-9 pr-9"
          />

          {search && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          )}

          {/* Search Suggestions Tray */}
          {open && (
            <div className="absolute top-12 z-50 w-full overflow-hidden rounded-xl border bg-popover shadow-lg">
              {/* Initial State */}

              {/* Loading */}
              {search.trim().length >= 2 && loading && (
                <div className="flex items-center justify-center gap-2 p-5 text-sm text-muted-foreground">
                  <Loader2 className="size-4 animate-spin" />
                  Searching...
                </div>
              )}

              {/* Results */}
              {!loading && search.trim().length >= 2 && (
                <>
                  {results.length > 0 ? (
                    <div className="p-2">
                      <p className="px-2 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        People
                      </p>

                      {results.map((result) => (
                        <Link
                          key={result.id}
                          href={`/account/${result.handle}`}
                          onClick={() => setOpen(false)}
                          className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-muted"
                        >
                          <UserAvatar user={result} size="size-9" />

                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium">
                              {result.name}
                            </p>

                            <p className="truncate text-xs text-muted-foreground">
                              @{result.handle}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="p-4 text-sm text-muted-foreground">
                      No people found.
                    </p>
                  )}

                  {/* View All */}
                  <button
                    type="button"
                    onClick={() => {
                      const query = search.trim();

                      setOpen(false);

                      router.push(`/search?q=${encodeURIComponent(query)}`);
                    }}
                    className="w-full border-t p-3 text-center text-sm font-medium hover:bg-muted"
                  >
                    See all results for "{search}"
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Navbar Actions */}
        <div className="ml-auto flex items-center gap-1">
          <Link href="/message">
            <Button variant="ghost" size="icon" aria-label="Messages">
              <MessageCircle />

              <Badge className="-ml-3 -mt-5 size-4 justify-center rounded-full p-0 text-[10px]">
                {unreadMessageCount}
              </Badge>
            </Button>
          </Link>

          <NotificationBox unreadNotificationCount={unreadNotificationCount} />

          <Link className="ml-2" href="/profile">
            {user && <UserAvatar user={user} />}
          </Link>
        </div>
      </div>
    </header>
  );
}
