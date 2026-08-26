import { formatNumber, Post } from "@/lib/social-data";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Link from "next/link";
import UserAvatar from "./user-avatar";
import { Button } from "./ui/button";
import {
  Bookmark,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Share2,
} from "lucide-react";
import { toast } from "sonner";

export default function PostCard({
  post,
  onChange,
}: {
  post: Post;
  onChange: (post: Post) => void;
}) {
  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between space-y-0 pb-3">
        <div className="flex items-center gap-3">
          <Link href={`/account/${post.author.handle}`}>
            <UserAvatar user={post.author} />
          </Link>
          <div>
            <Link
              href={`/account/${post.author.handle}`}
              className="text-sm font-semibold hover:underline"
            >
              {post.author.name}
            </Link>
            <p className="text-xs text-muted-foreground">
              @{post.author.handle} · {post.time}
            </p>
          </div>
        </div>
        <Button variant="ghost" size="icon" aria-label="More post actions">
          <MoreHorizontal />
        </Button>
      </CardHeader>
      <CardContent className="pb-3">
        <p className="text-[15px] leading-7">{post.body}</p>
        {post.image && (
          <img
            src={post.image}
            alt="City skyline shared in a post"
            className="mt-4 max-h-96 w-full rounded-xl object-cover"
          />
        )}
      </CardContent>
      <CardFooter className="gap-1 border-t pt-3">
        <Button
          variant="ghost"
          size="sm"
          className={post.liked ? "text-destructive" : ""}
          onClick={() =>
            onChange({
              ...post,
              liked: !post.liked,
              likes: post.likes + (post.liked ? -1 : 1),
            })
          }
        >
          <Heart
            fill={post.liked ? "currentColor" : "none"}
            data-icon="inline-start"
          />
          {formatNumber(post.likes)}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => toast.info("Comments are ready to explore")}
        >
          <MessageCircle data-icon="inline-start" />
          {post.comments}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => toast.success("Share link copied")}
        >
          <Share2 data-icon="inline-start" />
          {post.shares}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto"
          aria-label="Save post"
          onClick={() => onChange({ ...post, saved: !post.saved })}
        >
          <Bookmark fill={post.saved ? "currentColor" : "none"} />
        </Button>
      </CardFooter>
    </Card>
  );
}
