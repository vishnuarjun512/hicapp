"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import Link from "next/link";
import UserAvatar from "./user-avatar";

import { toast } from "sonner";
import { Button } from "./ui/button";
import { useDataStore } from "@/lib/stores/data-store";

export default function RightRail() {
  const { suggestions } = useDataStore();
  return (
    <aside className="sticky top-24 hidden h-fit w-64 shrink-0 xl:block">
      <Card className="border-0 bg-muted/50 shadow-none">
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">People to follow</h2>
            <Link href="/friends" className="text-xs text-primary">
              See all
            </Link>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {suggestions &&
            suggestions.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between gap-3"
              >
                <div
                  key={user.handle}
                  className="flex items-center justify-between gap-3"
                >
                  <Link href={`/account/${user.id}`}>
                    <UserAvatar user={user} size="size-9" />
                  </Link>
                  <Link href={`/account/${user.id}`}>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {user.name}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        @{user.handle}
                      </p>
                    </div>
                  </Link>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toast.success(`Following @${user.handle}`)}
                >
                  Follow
                </Button>
              </div>
            ))}
        </CardContent>
      </Card>
      <Card className="mt-4 border-0 bg-primary text-primary-foreground shadow-none">
        <CardContent className="p-5">
          <p className="text-xs font-medium uppercase tracking-widest opacity-70">
            Trending today
          </p>
          <p className="mt-3 text-xl font-semibold">#slowinternet</p>
          <p className="mt-1 text-sm opacity-80">
            A little less noise. A little more signal.
          </p>
        </CardContent>
      </Card>
    </aside>
  );
}
