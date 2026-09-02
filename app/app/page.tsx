"use client";

import { AppShell } from "@/components/app-shell";
import CreatePost from "@/app/app/components/create-post";

import { Badge } from "@/components/ui/badge";
import { Post, posts } from "@/lib/social-data";
import { useState } from "react";
import PostCard from "./components/post-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Page() {
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
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="for-you">For you</SelectItem>
              <SelectItem value="following">Following</SelectItem>
              <SelectItem value="latest">Latest</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-4">
          <CreatePost
            onCreate={(newPost) => {
              setFeed((currentFeed) => [newPost, ...currentFeed]);
            }}
          />
          {feed.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onChange={(updatedPost) => {
                setFeed((currentFeed) =>
                  currentFeed.map((item) =>
                    item.id === updatedPost.id ? updatedPost : item,
                  ),
                );
              }}
              onDelete={(deletedPost) => {
                setFeed((currentFeed) =>
                  currentFeed.filter((item) => item.id !== deletedPost.id),
                );
              }}
              onEdit={(updatedPost) => {
                setFeed((currentFeed) =>
                  currentFeed.map((item) =>
                    item.id === updatedPost.id ? updatedPost : item,
                  ),
                );
              }}
            />
          ))}
        </div>
      </div>
    </AppShell>
  );
}
