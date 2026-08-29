"use client";
import PostCard from "@/app/app/components/post-card";
import { AppShell } from "@/components/app-shell";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserList from "@/components/user-list";
import {
  currentUser,
  posts,
  suggestions,
  User,
  users,
} from "@/lib/social-data";
import { toast } from "sonner";
import ProfileHeader from "./profile-header";

export default function ProfilePage({
  user = currentUser,
  own = true,
}: {
  user?: User;
  own?: boolean;
}) {
  return (
    <AppShell>
      <div className="mx-auto max-w-3xl">
        <ProfileHeader user={user} own={own} />
        <Tabs defaultValue="posts" className="mt-6">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="followers">Followers</TabsTrigger>
            <TabsTrigger value="following">Following</TabsTrigger>
            <TabsTrigger value="friends">Friends</TabsTrigger>
          </TabsList>
          <TabsContent value="posts" className="mt-4 flex flex-col gap-4">
            {posts
              .filter((post) => post.author.handle === user.handle || own)
              .map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onChange={() => toast.success("Post updated")}
                />
              ))}
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
