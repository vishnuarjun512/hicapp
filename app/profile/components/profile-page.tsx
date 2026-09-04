"use client";

import PostCard from "@/app/app/components/post-card";
import { AppShell } from "@/components/app-shell";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserList from "@/components/user-list";
import { Post } from "@/lib/social-data";
import ProfileHeader from "./profile-header";
import { useAuthStore, User } from "@/lib/stores/auth-store";
import { useEffect, useState } from "react";
import { useDataStore } from "@/lib/stores/data-store";

export default function ProfilePage({ user }: { user: User }) {
  const { user: authUser } = useAuthStore();

  const { followers, following, posts, setPosts } = useDataStore();

  const [pageFollowers, setPageFollowers] = useState<User[]>([]);
  const [pageFollowing, setPageFollowing] = useState<User[]>([]);
  const [pagePosts, setPagePosts] = useState<Post[]>([]);
  const [own, setOwn] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    const getProfileData = async () => {
      try {
        const url = `${process.env.NEXT_PUBLIC_BASE_URL}/profile/${user.id}`;

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

        setPagePosts(data.posts);
        setPageFollowers(data.followers);
        setPageFollowing(data.following);
      } catch (error) {
        console.log("Profile Fetch Request Failed -> ", error);
      }
    };

    if (authUser?.id != user.id) {
      setOwn(false);
      getProfileData();
    } else {
      setOwn(true);
      setPagePosts(posts);
      setPageFollowers(followers);
      setPageFollowing(following);
    }
  }, []);

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl">
        <ProfileHeader
          user={user}
          postCount={pagePosts?.length ?? 0}
          followersCount={pageFollowers?.length ?? 0}
          followingCount={pageFollowing?.length ?? 0}
          own={own}
        />

        <Tabs defaultValue="posts" className="mt-6">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="followers">Followers</TabsTrigger>
            <TabsTrigger value="following">Following</TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="mt-4 flex flex-col gap-4">
            {pagePosts && pagePosts.length > 0 ? (
              pagePosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onChange={(updatedPost: Post) => {
                    setPosts(
                      posts.map((item: Post) =>
                        item.id === updatedPost.id ? updatedPost : item,
                      ),
                    );
                  }}
                  onDelete={(deletedPost) => {
                    setPosts(
                      posts.filter((item) => item.id !== deletedPost.id),
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
            <UserList users={pageFollowers} />
          </TabsContent>

          <TabsContent value="following" className="mt-4">
            <UserList users={pageFollowing} />
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}
