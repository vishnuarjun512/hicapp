"use client";

import { AppShell } from "@/components/app-shell";
import CreatePost from "@/app/(app)/home/components/create-post";

import { Badge } from "@/components/ui/badge";
import { Post, posts as fakePosts } from "@/lib/social-data";
import { useEffect, useState } from "react";
import PostCard from "./components/post-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useDataStore } from "@/lib/stores/data-store";
import { useMessageStore } from "@/lib/stores/message-store";
import { useApi } from "@/lib/(apiCalls)/useApi";
import { getProfileData } from "@/lib/(apiCalls)/user/user";

export default function Page() {
  const { user } = useAuthStore();

  const { posts, setPosts, setFollowers, setFollowing, setSuggestions } =
    useDataStore();
  const { setConversations } = useMessageStore();
  const { execute } = useApi();

  useEffect(() => {
    if (!user?.id) return;

    const getUserData = async () => {
      try {
        const data = await execute(() => getProfileData(user.id));
        setPosts(data.posts);
        setSuggestions(data.suggested);
        setFollowers(data.followers);
        setFollowing(data.following);
        setConversations(data.conversations);
      } catch (error) {
        console.log("Profile Fetch Request Failed -> ", error);
      }
    };

    getUserData();
  }, [user?.id]);

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
              setPosts([newPost, ...posts]);
            }}
          />
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onChange={(updatedPost) => {
                setPosts(
                  posts.map((item: Post) =>
                    item.id === updatedPost.id ? updatedPost : item,
                  ),
                );
              }}
              onDelete={(deletedPost) => {
                setPosts(posts.filter((item) => item.id !== deletedPost.id));
              }}
              onEdit={(updatedPost) => {
                setPosts(
                  posts.map((item) =>
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
