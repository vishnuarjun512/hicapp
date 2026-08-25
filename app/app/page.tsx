import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Post } from "@/lib/social-data";
import { useState } from "react";

export function Page() {
  const [feed, setFeed] = useState<Post[]>(posts);
  const [sort, setSort] = useState("For you");
  return (
    <AppShell>
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <Badge variant="secondary" className="mb-3">
              Tuesday, August 25
            </Badge>
            <h1 className="text-3xl font-semibold tracking-tight">
              Good morning, Maya.
            </h1>
            <p className="mt-1 text-muted-foreground">
              Here is what is happening in your world.
            </p>
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="hidden rounded-lg border bg-background px-3 py-2 text-sm sm:block"
          >
            <option>For you</option>
            <option>Following</option>
            <option>Latest</option>
          </select>
        </div>
        <div className="flex flex-col gap-4">
          <CreatePost
            onCreate={(body) =>
              setFeed([
                {
                  id: Date.now(),
                  author: currentUser,
                  body,
                  likes: 0,
                  comments: 0,
                  shares: 0,
                  time: "now",
                },
                ...feed,
              ])
            }
          />
          {feed.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onChange={(next) =>
                setFeed(feed.map((item) => (item.id === next.id ? next : item)))
              }
            />
          ))}
        </div>
      </div>
    </AppShell>
  );
}
