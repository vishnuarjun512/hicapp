"use client";
import { posts } from "@/lib/social-data";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Bookmark, ChevronDown } from "lucide-react";
import PostCard from "@/app/(app)/home/components/post-card";

export function SavedPage() {
  const saved = posts.filter((post) => post.saved);
  return (
    <AppShell>
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <p className="text-sm font-medium text-primary">Your collection</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Saved posts
          </h1>
          <p className="mt-1 text-muted-foreground">
            {saved.length} posts saved for later.
          </p>
        </div>
        <div className="mb-4 flex gap-2">
          <Input placeholder="Filter saved posts" />
          <Button variant="outline">
            Newest <ChevronDown data-icon="inline-end" />
          </Button>
        </div>
        <div className="flex flex-col gap-4">
          {saved.length ? (
            saved.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onChange={() => toast.success("Removed from saved")}
              />
            ))
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center gap-3 p-12 text-center">
                <Bookmark className="size-8 text-muted-foreground" />
                <h2 className="font-semibold">Nothing saved yet</h2>
                <p className="text-sm text-muted-foreground">
                  When you find something worth keeping, it will appear here.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AppShell>
  );
}
