"use client";

import PostCard from "@/app/(app)/home/components/post-card";
import { AppShell } from "@/components/app-shell";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserList from "@/components/user-list";
import { Post } from "@/lib/social-data";
import ProfileHeader from "./profile-header";
import ProfileSkeleton from "./profile-skeleton";
import { useAuthStore, User } from "@/lib/stores/auth-store";
import { useEffect, useState } from "react";
import { useDataStore } from "@/lib/stores/data-store";
import { useApi } from "@/lib/(apiCalls)/useApi";
import { getProfileData } from "@/lib/(apiCalls)/user/user";

export default function ProfilePage({ userID }: { userID: string }) {
  const { user: authUser } = useAuthStore();

  const { followers, following, posts, setPosts } = useDataStore();

  const [pageFollowers, setPageFollowers] = useState<User[]>([]);
  const [pageFollowing, setPageFollowing] = useState<User[]>([]);
  const [pagePosts, setPagePosts] = useState<Post[]>([]);
  const [pageUser, setPageUser] = useState<User | null>(null);
  const [own, setOwn] = useState(false);
  const [canViewContent, setCanViewContent] = useState(false);

  const { execute } = useApi();

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!userID) return;
      try {
        const data = await execute(() => getProfileData(userID));

        setPageUser(data.user);
        setPagePosts(data.posts ?? []);
        setPageFollowers(data.followers ?? []);
        setPageFollowing(data.following ?? []);
        const isFollower =
          !!authUser && data.followers.some((f: User) => f.id === authUser.id);

        setCanViewContent(own || !data.user?.is_private || isFollower);
      } catch (error) {
        console.log("Profile Fetch Request Failed -> ", error);
      }
    };

    const isOwnProfile = authUser?.id === userID;

    setOwn(isOwnProfile);

    if (isOwnProfile) {
      setCanViewContent(true);
      setPageUser(authUser);
      setPagePosts(posts.filter((post) => post.author.id == authUser.id));
      setPageFollowers(followers);
      setPageFollowing(following);
    } else {
      fetchProfileData();
    }
  }, []);

  if (!pageUser) {
    return (
      <AppShell>
        <ProfileSkeleton />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl">
        <ProfileHeader
          user={pageUser}
          postCount={pagePosts.length}
          followersCount={pageFollowers.length}
          followingCount={pageFollowing.length}
          own={own}
        />

        {!canViewContent ? (
          <div className="mt-10 flex flex-col items-center justify-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border">
              🔒
            </div>

            <h2 className="text-lg font-semibold">This account is private</h2>

            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Follow this account to see their posts, followers, and following.
            </p>
          </div>
        ) : (
          <Tabs defaultValue="posts" className="mt-6">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="posts">Posts</TabsTrigger>

              <TabsTrigger value="followers">Followers</TabsTrigger>

              <TabsTrigger value="following">Following</TabsTrigger>
            </TabsList>

            <TabsContent value="posts" className="mt-4 flex flex-col gap-4">
              {pagePosts.length > 0 ? (
                pagePosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onChange={(updatedPost: Post) => {
                      setPagePosts((currentPosts) =>
                        currentPosts.map((item) =>
                          item.id === updatedPost.id ? updatedPost : item,
                        ),
                      );

                      // If this is our own profile,
                      // keep the global store synchronized.
                      if (own) {
                        setPosts(
                          posts.map((item) =>
                            item.id === updatedPost.id ? updatedPost : item,
                          ),
                        );
                      }
                    }}
                    onDelete={(deletedPost) => {
                      setPagePosts((currentPosts) =>
                        currentPosts.filter(
                          (item) => item.id !== deletedPost.id,
                        ),
                      );

                      if (own) {
                        setPosts(
                          posts.filter((item) => item.id !== deletedPost.id),
                        );
                      }
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
              <UserList
                users={pageFollowing}
                onRemove={(removedUser) => {
                  setPageFollowing((currentUsers) =>
                    currentUsers.filter((user) => user.id !== removedUser.id),
                  );
                }}
              />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </AppShell>
  );
}
