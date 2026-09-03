"use client";
import PostCard from "@/app/app/components/post-card";
import { AppShell } from "@/components/app-shell";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserList from "@/components/user-list";
import {
  Post,
  posts as fakePosts,
  suggestions,
  users,
} from "@/lib/social-data";
import { toast } from "sonner";
import ProfileHeader from "./profile-header";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const [own, setOwn] = useState(false);
  const { user } = useAuthStore();

  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const getPosts = async () => {
      const url = `${process.env.NEXT_PUBLIC_BASE_URL}/post/${user?.id}`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      return data.posts;
    };

    if (user && user.id) {
      getPosts().then((data) => {
        setPosts(data);
      });
    }
  }, [user]);

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl">
        {user && <ProfileHeader user={user} own={own} />}
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
                  onChange={() => toast.success("Post updated")}
                />
              ))
            ) : (
              <p className="text-center text-muted-foreground">
                No posts to display.
              </p>
            )}
          </TabsContent>
          <TabsContent value="followers" className="mt-4">
            <UserList users={users} />
          </TabsContent>
          <TabsContent value="following" className="mt-4">
            <UserList users={suggestions} />
          </TabsContent>
          <TabsContent value="friends" className="mt-4">
            <UserList users={users.slice(0, 3)} />
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}
