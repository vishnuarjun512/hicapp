"use client";

import PostCard from "@/app/app/components/post-card";
import { AppShell } from "@/components/app-shell";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserList from "@/components/user-list";
import { Post, users } from "@/lib/social-data";
import ProfileHeader from "./profile-header";
import { useAuthStore, User } from "@/lib/stores/auth-store";
import { useEffect, useState } from "react";
import { useDataStore } from "@/lib/stores/data-store";

export default function ProfilePage({ user }: { user: User }) {
  const { user: authUser } = useAuthStore();

  const { followers, following } = useDataStore();

  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    if (!user?.id) return;

    const getPosts = async () => {
      const url = `${process.env.NEXT_PUBLIC_BASE_URL}/post/${user.id}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch posts");
      }

      setPosts(data);
    };

    if (user.verified) {
      getPosts();
    }
  }, [user]);

  if (!user) {
    return null;
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl">
        <ProfileHeader user={user} own={true} />

        <Tabs defaultValue="posts" className="mt-6">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="followers">Followers</TabsTrigger>
            <TabsTrigger value="following">Following</TabsTrigger>
            <TabsTrigger value="friends">Friends</TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="mt-4 flex flex-col gap-4">
            {posts.length > 0 ? (
              posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onChange={(updatedPost) => {
                    setPosts((currentPosts) =>
                      currentPosts.map((item) =>
                        item.id === updatedPost.id ? updatedPost : item,
                      ),
                    );
                  }}
                  onDelete={(deletedPost) => {
                    setPosts((currentPosts) =>
                      currentPosts.filter((item) => item.id !== deletedPost.id),
                    );
                  }}
                />
              ))
            ) : (
              <p className="text-center text-muted-foreground">
                No posts to display.
              </p>
            )}
          </TabsContent>

          <TabsContent value="followers" className="mt-4">
            <UserList users={followers} />
          </TabsContent>

          <TabsContent value="following" className="mt-4">
            <UserList users={following} />
          </TabsContent>

          <TabsContent value="friends" className="mt-4">
            <UserList users={users.slice(0, 3)} />
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}
