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
import Link from "next/link";
import { followUser, unfollowUser } from "@/app/(apiCalls)/followApis";

type UserListProps = {
  users: User[];
  onRemove?: (user: User) => void;
};

export default function UserList({ users: list, onRemove }: UserListProps) {
  const { user: LoggedUser } = useAuthStore();
  const {
    following,
    setFollowing,
    sentFollowRequests,
    setSentFollowRequests,
    suggestions,
    setSuggestions,
  } = useDataStore();

  const [userToUnfollow, setUserToUnfollow] = useState<User | null>(null);

  const handleFollow = async (userToFollow: User) => {
    if (!LoggedUser) {
      toast.error("You must be logged in to follow users.");
      return;
    }

    try {
      const data = await followUser(LoggedUser.id, userToFollow.id);

      toast.success("Success: " + data.message);

      // Remove from Suggestions
      setSuggestions(
        suggestions.filter((singleUser) => singleUser.id != userToFollow.id),
      );

      if (data.request) {
        setSentFollowRequests([...sentFollowRequests, userToFollow]);
      } else {
        setFollowing([...following, userToFollow]);
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to follow user.",
      );

      console.log(error);
    }
  };

  const handleUnfollow = async (userToUnfollow: User) => {
    if (!LoggedUser) {
      toast.error("You must be logged in to unfollow users.");
      return;
    }

    try {
      const data = await unfollowUser(LoggedUser.id, userToUnfollow.id);

      toast.success("Success: " + data.message);

      // Tell the parent that this user was removed
      onRemove?.(userToUnfollow);

      setFollowing(
        following.filter((follow) => follow.id != userToUnfollow.id),
      );

      setSuggestions([...suggestions, userToUnfollow]);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to unfollow user.",
      );

      console.log(error);
    }
  };

  const handleCancelRequest = async (cancelRequested: User) => {
    if (!LoggedUser) return;
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      const url = `${baseUrl}/followrequest/${LoggedUser.id}/reject`;

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ receiver_id: cancelRequested.id }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error("Failed to Reject Request");
      }

      // Remove from sent requests
      setSentFollowRequests(
        sentFollowRequests.filter(
          (request) => request.id !== cancelRequested.id,
        ),
      );

      // Add back to suggestions
      setSuggestions([...suggestions, cancelRequested]);
      toast.success("Success: " + data.message);
      console.log("Response Data -> ", data);
    } catch (error) {
      toast.error("Failed to reject request. Please try again.");
      console.log("Reject Follow Request Error = > ", error);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-3">
        {list &&
          list.length > 0 &&
          list.map((user) => {
            const isFollowing = following.some(
              (followedUser) => followedUser.id === user.id,
            );

            const isRequestSent = sentFollowRequests.some(
              (requestedUser) => requestedUser.id === user.id,
            );
            return (
              <Card key={user.handle}>
                <CardContent className="flex items-center gap-3 p-4">
                  <Link href={`/account/${user.id}`}>
                    <UserAvatar user={user} />
                  </Link>

                  <div className="min-w-0 flex-1">
                    <Link href={`/account/${user.id}`}>
                      <p className="font-medium">{user.name}</p>
                    </Link>

                    <p className="text-sm text-muted-foreground">
                      <Link href={`/account/${user.id}`}>
                        <span>@{user.handle}</span>
                      </Link>
                      <span> {` ·  ${user.bio}`}</span>
                    </p>
                  </div>
                  {LoggedUser && user.id != LoggedUser.id && (
                    <Button
                      variant={isRequestSent ? "destructive" : "outline"}
                      size="sm"
                      onClick={() => {
                        if (isFollowing) {
                          setUserToUnfollow(user);
                        } else if (!isRequestSent) {
                          handleFollow(user);
                        } else if (isRequestSent) {
                          handleCancelRequest(user);
                        }
                      }}
                    >
                      {isFollowing
                        ? "Unfollow"
                        : isRequestSent
                          ? "Cancel Request"
                          : "Follow"}
                    </Button>
                  )}

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
