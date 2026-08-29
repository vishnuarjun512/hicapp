import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import UserAvatar from "@/components/user-avatar";
import { formatNumber, User } from "@/lib/social-data";
import { Check, Share2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import EditProfile from "./edit-profile";

export default function ProfileHeader({
  user,
  own = false,
}: {
  user: User;
  own?: boolean;
}) {
  const [following, setFollowing] = useState(false);
  return (
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
              <Button
                onClick={() => {
                  setFollowing(!following);
                  toast.success(
                    following
                      ? `Unfollowed @${user.handle}`
                      : `Following @${user.handle}`,
                  );
                }}
              >
                {following ? "Following" : "Follow"}
              </Button>
            )}
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold">{user.name}</h1>
            {user.verified && (
              <Badge variant="secondary">
                <Check />
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">@{user.handle}</p>
          <p className="mt-3 max-w-xl leading-7">{user.bio}</p>
          <div className="mt-5 flex flex-wrap gap-5 text-sm">
            <span>
              <strong>{formatNumber(user.posts)}</strong> posts
            </span>
            <span>
              <strong>{formatNumber(user.followers)}</strong> followers
            </span>
            <span>
              <strong>{formatNumber(user.following)}</strong> following
            </span>
            <span>
              <strong>{formatNumber(user.friends)}</strong> friends
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
