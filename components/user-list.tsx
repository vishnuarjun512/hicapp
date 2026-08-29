import { MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import UserAvatar from "./user-avatar";
import { User } from "@/lib/social-data";
import { toast } from "sonner";

export default function UserList({ users: list }: { users: User[] }) {
  return (
    <div className="flex flex-col gap-3">
      {list.map((user) => (
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
              onClick={() => toast.success(`Following @${user.handle}`)}
            >
              Follow
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
      ))}
    </div>
  );
}
