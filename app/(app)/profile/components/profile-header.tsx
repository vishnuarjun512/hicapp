import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import UserAvatar from "@/components/user-avatar";
import { formatNumber } from "@/lib/social-data";
import { Check, MessageCircle, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import EditProfile from "./edit-profile";

import ProfileVerificationStatus from "./profile-verification";
import { useAuthStore, User } from "@/lib/stores/auth-store";
import { useDataStore } from "@/lib/stores/data-store";
import { followUser, unfollowUser } from "@/app/(apiCalls)/follow/follow";

import { useRouter } from "next/navigation";
import { createConversation } from "@/app/(apiCalls)/message/message-api";

export default function ProfileHeader({
  user,
  postCount = 0,
  followersCount = 0,
  followingCount = 0,
  own = false,
}: {
  user: User;
  postCount: number;
  followersCount: number;
  followingCount: number;
  own?: boolean;
}) {
  const router = useRouter();
  const [following, setFollowing] = useState(false);
  const { user: LoggedUser } = useAuthStore();
  const { following: authFollowing } = useDataStore();
  useEffect(() => {
    if (authFollowing.some((follow) => follow.id == user.id)) {
      setFollowing(true);
    }
  }, [authFollowing]);

  const handleFollow = async () => {
    if (!LoggedUser) {
      toast.error("You must be logged in to follow users.");
      return;
    }

    try {
      const data = await followUser(LoggedUser.id, user.id);

      toast.success("Success: " + data.message);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to follow user.",
      );

      console.log(error);
    }
  };

  const handleUnfollow = async () => {
    if (!LoggedUser) {
      toast.error("You must be logged in to unfollow users.");
      return;
    }

    try {
      const data = await unfollowUser(LoggedUser.id, user.id);

      toast.success("Success: " + data.message);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to unfollow user.",
      );

      console.log(error);
    }
  };

  const handleMessage = async () => {
    if (!LoggedUser) {
      toast.error("You must be logged in to text users");
      return;
    }

    try {
      const data = await createConversation(user.id);
      toast.success("Created Conversation");
      router.push("/message");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to unfollow user.",
      );

      console.log(error);
    }
  };

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden">
        <div className="h-32 bg-primary/90 sm:h-44" />

        <CardContent className="relative p-5 pt-0 sm:p-8 sm:pt-0">
          <div className="-mt-12 flex flex-col gap-4 sm:-mt-16 sm:flex-row sm:items-end sm:justify-between">
            <UserAvatar user={user} size="size-24" />

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => toast.success("Profile link copied")}
              >
                <Share2 data-icon="inline-start" />
                Share
              </Button>

              {own ? (
                <EditProfile />
              ) : (
                <div className="flex gap-2">
                  <Button
                    onClick={() =>
                      following ? handleUnfollow() : handleFollow()
                    }
                  >
                    {following ? "Unfollow" : "Follow"}
                  </Button>
                  <Button onClick={handleMessage}>
                    <MessageCircle data-icon="inline-start" />
                    Message
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-semibold">
                {user?.name || "Unnamed user"}
              </h1>

              {user.verified && (
                <Badge variant="secondary">
                  <Check />
                </Badge>
              )}
            </div>

            <p className="text-sm text-muted-foreground">
              {user?.handle ? `@${user.handle}` : "No username"}
            </p>

            {user?.bio && <p className="mt-3 max-w-xl leading-7">{user.bio}</p>}

            <div className="mt-5 flex flex-wrap gap-5 text-sm">
              <span>
                <strong>{formatNumber(postCount)}</strong> posts
              </span>

              <span>
                <strong>{formatNumber(followersCount)}</strong> followers
              </span>

              <span>
                <strong>{formatNumber(followingCount)}</strong> following
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {own && (
        <ProfileVerificationStatus
          name={user?.name}
          handle={user?.handle}
          bio={user?.bio}
        />
      )}
    </div>
  );
}
