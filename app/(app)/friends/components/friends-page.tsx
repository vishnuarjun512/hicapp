"use client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import UserAvatar from "@/components/user-avatar";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect } from "react";
import { AppShell } from "@/components/app-shell";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

import UserList from "@/components/user-list";
import { useAuthStore, User } from "@/lib/stores/auth-store";
import { useDataStore } from "@/lib/stores/data-store";
import { useApi } from "@/lib/(apiCalls)/useApi";
import { getFriendsApiCall } from "@/lib/(apiCalls)/friends/friends";
import { acceptRequest, rejectRequest } from "@/lib/(apiCalls)/follow/follow";

export default function FriendsPage() {
  const { user } = useAuthStore();
  const { execute } = useApi();
  const {
    suggestions,
    setSuggestions,
    followers,
    followRequests,
    setFollowers,
    following,
    setFollowing,
    setFollowRequests,
    setSentFollowRequests,
    sentFollowRequests,
  } = useDataStore();

  useEffect(() => {
    const getFriends = async () => {
      if (!user) return;
      try {
        const data = await execute(() => getFriendsApiCall(user.id));

        setSuggestions(data?.suggested);
        setFollowRequests(data?.followRequests);
        setFollowers(data?.followers);
        setFollowing(data?.following);
        setSentFollowRequests(data?.sentFollowRequests);
      } catch (error) {
        console.log("Get Friends Page Error = > ", error);
      }
    };
    if (user) {
      getFriends();
    }
  }, [user]);

  const handleAcceptRequest = async (sender: User) => {
    if (!user) return;
    try {
      const data = await execute(() => acceptRequest(sender.id, user.id));
      // Remove from Follow Requests
      setFollowRequests(
        followRequests.filter((item) => item.handle !== sender.handle),
      );

      // Add to Followers
      setFollowers([...followers, sender]);
      toast.success("Success: " + data.message);
    } catch (error) {
      toast.error("Failed to accept request. Please try again.");
      console.log("Accept Follow Request Error = > ", error);
    }
  };

  const handleRejectRequest = async (sender: User) => {
    if (!user) return;
    try {
      const data = await execute(() => rejectRequest(sender.id, user.id));

      setFollowRequests(
        followRequests.filter((item) => item.handle !== sender.handle),
      );

      toast.success("Success: " + data.message);
      console.log("Response Data -> ", data);
    } catch (error) {
      toast.error("Failed to reject request. Please try again.");
      console.log("Reject Follow Request Error = > ", error);
    }
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight">Your people</h1>
          <p className="mt-1 text-muted-foreground">
            Keep up with friends and find new kindred spirits.
          </p>
        </div>
        <Tabs defaultValue="requests">
          <TabsList>
            <TabsTrigger value="requests">
              Requests{" "}
              <Badge className="ml-2">
                {followRequests?.length ? followRequests.length : 0}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="following">Following</TabsTrigger>
            <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
            <TabsTrigger value="sentFollowRequests">Pending</TabsTrigger>
          </TabsList>
          <TabsContent value="requests" className="mt-6 flex flex-col gap-3">
            {followRequests &&
              followRequests.length > 0 &&
              followRequests?.map((user) => (
                <Card key={user.handle}>
                  <CardContent className="flex items-center gap-3 p-4">
                    <UserAvatar user={user} />
                    <div className="flex-1">
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">
                        @{user.handle} · 8 mutual friends
                      </p>
                    </div>
                    <Button size="sm" onClick={() => handleAcceptRequest(user)}>
                      Accept
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRejectRequest(user)}
                    >
                      Reject
                    </Button>
                  </CardContent>
                </Card>
              ))}
          </TabsContent>
          <TabsContent value="following" className="mt-6">
            <UserList users={following} />
          </TabsContent>
          <TabsContent value="suggestions" className="mt-6">
            {suggestions && <UserList users={suggestions} />}
          </TabsContent>
          <TabsContent value="sentFollowRequests" className="mt-6">
            {sentFollowRequests && <UserList users={sentFollowRequests} />}
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}
