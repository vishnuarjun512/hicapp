import { MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import UserAvatar from "./user-avatar";

import { toast } from "sonner";
import { useAuthStore, User } from "@/lib/stores/auth-store";
import { useDataStore } from "@/lib/stores/data-store";
import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

export default function UserList({ users: list }: { users: User[] }) {
  const { user } = useAuthStore();
  const { following } = useDataStore();

  const [userToUnfollow, setUserToUnfollow] = useState<User | null>(null);

  const handleFollow = async (userToFollow: User) => {
    if (!user) {
      toast.error("You must be logged in to follow users.");
      return;
    }

    try {
      // Implement the follow logic here, e.g., make an API call to follow the user
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/users/${userToFollow.id}/follow`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sender_id: user.id }),
        },
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error("Failed to follow user");
      }

      toast.success("Success: " + data.message);
    } catch (error) {
      toast.error("Failed to follow user. Please try again.");
      console.log(error);
    }
  };

  const handleUnfollow = async (userToUnfollow: User) => {
    if (!user) {
      toast.error("You must be logged in to unfollow users.");
      return;
    }
    try {
      // Implement the unfollow logic here, e.g., make an API call to unfollow the user
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/users/${userToUnfollow.id}/unfollow`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ follower_id: user.id }),
        },
      );

      if (!res.ok) {
        throw new Error("Failed to unfollow user");
      }
      toast.success("Success: Unfollowed " + userToUnfollow.name);
    } catch (error) {
      toast.error("Failed to unfollow user. Please try again.");
      console.log(error);
    }
  };

  useEffect(() => {}, [user]);

  return (
    <>
      <div className="flex flex-col gap-3">
        {list.map((user) => {
          const isFollowing = following.some(
            (followedUser) => followedUser.id === user.id,
          );
          return (
            <Card key={user.handle}>
              <CardContent className="flex items-center gap-3 p-4">
                <UserAvatar user={user} />
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-muted-foreground">
                    @{user.handle} · {user.bio}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (isFollowing) {
                      setUserToUnfollow(user);
                    } else {
                      handleFollow(user);
                    }
                  }}
                >
                  {isFollowing ? "Unfollow" : "Follow"}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`More actions for ${user.name}`}
                >
                  <MoreHorizontal />
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <AlertDialog
        open={!!userToUnfollow}
        onOpenChange={(open) => {
          if (!open) {
            setUserToUnfollow(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Seriously? 😭</AlertDialogTitle>

            <AlertDialogDescription>
              Do you really want to unfollow{" "}
              <span className="font-medium text-foreground">
                @{userToUnfollow?.handle}
              </span>
              ?
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Nah, keep following</AlertDialogCancel>

            <AlertDialogAction
              onClick={() => {
                if (userToUnfollow) {
                  handleUnfollow(userToUnfollow);
                }

                setUserToUnfollow(null);
              }}
            >
              Yes, unfollow
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
