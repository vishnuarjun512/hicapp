"use client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { friendRequests, users } from "@/lib/social-data";
import UserAvatar from "@/components/user-avatar";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

import UserList from "@/components/user-list";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useDataStore } from "@/lib/stores/data-store";

export default function FriendsPage() {
  const { user } = useAuthStore();
  const { suggestions, setSuggestions } = useDataStore();
  const [requests, setRequests] = useState(friendRequests);

  useEffect(() => {
    const getSuggested = async () => {
      if (!user || suggestions.length > 0) return;
      try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
        const url = `${baseUrl}/friends/${user.id}`;

        const res = await fetch(url);
        const data = await res.json();
        console.log("Response Data -> ", data);
        setSuggestions(data.suggested);
      } catch (error) {
        console.log("Get Friends Page Error = > ", error);
      }
    };
    if (user) {
      getSuggested();
    }
  }, [user]);

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
              Requests <Badge className="ml-2">{requests.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="friends">Friends</TabsTrigger>
            <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
          </TabsList>
          <TabsContent value="requests" className="mt-6 flex flex-col gap-3">
            {requests.map((user) => (
              <Card key={user.handle}>
                <CardContent className="flex items-center gap-3 p-4">
                  <UserAvatar user={user} />
                  <div className="flex-1">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">
                      @{user.handle} · 8 mutual friends
                    </p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => {
                      setRequests(
                        requests.filter((item) => item.handle !== user.handle),
                      );
                      toast.success(`You and ${user.name} are now friends`);
                    }}
                  >
                    Accept
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      setRequests(
                        requests.filter((item) => item.handle !== user.handle),
                      )
                    }
                  >
                    Ignore
                  </Button>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
          <TabsContent value="friends" className="mt-6">
            <UserList users={users.slice(0, 3)} />
          </TabsContent>
          <TabsContent value="suggestions" className="mt-6">
            {suggestions && <UserList users={suggestions} />}
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}
