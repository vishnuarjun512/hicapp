"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Bookmark,
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  Edit3,
  Heart,
  MapPin,
  MessageCircle,
  MoreHorizontal,
  Pin,
  Flag,
  Send,
  Share2,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { Comment, formatNumber, Post } from "@/lib/social-data";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

import { Textarea } from "@/components/ui/textarea";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import UserAvatar from "@/components/user-avatar";
import { useAuthStore } from "@/lib/stores/auth-store";
import { formatPostTime } from "@/lib/utils";

type PostCardProps = {
  post: Post;

  onChange: (post: Post) => void;

  onDelete?: (post: Post) => void;
  onEdit?: (post: Post) => void;
  onComment?: (post: Post, comment: string) => void;
};

export default function PostCard({
  post,
  onChange,
  onDelete,
  onEdit,
  onComment,
}: PostCardProps) {
  const [showComments, setShowComments] = useState(false);

  const [comment, setComment] = useState("");

  const [imageIndex, setImageIndex] = useState(0);

  const [showImagePreview, setShowImagePreview] = useState(false);

  const [editing, setEditing] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [editBody, setEditBody] = useState(post.body ?? "");

  const [visibility, setVisibility] = useState(
    // Supports posts that already have visibility.
    // Falls back to public for older Post objects.
    (post as Post & { visibility?: string }).visibility ?? "public",
  );

  const [pinned, setPinned] = useState(
    (post as Post & { pinned?: boolean }).pinned ?? false,
  );

  /**
   * Temporary local comments.
   *
   * Eventually these should come from your backend.
   */
  const [comments, setComments] = useState<Comment[]>([]);

  const images = post.images ?? [];

  const hasImages = images.length > 0;

  const currentImage = images[imageIndex];

  const handleLike = () => {
    onChange({
      ...post,
      liked: !post.liked,
      likes: post.likes ? post.likes + (post.liked ? -1 : 1) : 0,
    });
  };

  const handleSave = () => {
    onChange({
      ...post,
      saved: !post.saved,
    });

    toast.success(post.saved ? "Removed from saved" : "Post saved");
  };

  const authUser = useAuthStore((state) => state.user);

  const handleSubmitComment = () => {
    const trimmedComment = comment.trim();

    if (!trimmedComment) return;

    if (!authUser) {
      toast.error("You must be logged in to comment");
      return;
    }

    const newComment: Comment = {
      id: crypto.randomUUID(),
      author: authUser,
      body: trimmedComment,
      time: "now",
    };

    setComments((current) => [...current, newComment]);

    onChange({
      ...post,
      comments: post?.comments ? post.comments + 1 : 0,
    });

    onComment?.(post, trimmedComment);

    setComment("");

    toast.success("Comment added");
  };

  const handleEdit = () => {
    const trimmedBody = editBody.trim();

    if (!trimmedBody) {
      toast.error("Post cannot be empty");
      return;
    }

    const updatedPost = {
      ...post,
      body: trimmedBody,
      ...(visibility
        ? {
            visibility,
          }
        : {}),
    } as Post;

    onChange(updatedPost);

    onEdit?.(updatedPost);

    setEditing(false);

    toast.success("Post updated");
  };

  const handleDelete = async () => {
    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/post/${post.id}`;
    const res = await fetch(url, {
      method: "DELETE",
    });
    const { message } = await res.json();

    if (!res.ok) {
      toast.error("Something went wrong!");
    }

    onDelete?.(post);

    setDeleteDialogOpen(false);

    toast.success(message);
  };

  const handleCopyLink = async () => {
    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}/post/${post.id}`
        : "";

    try {
      await navigator.clipboard.writeText(url);
      toast.success("Post link copied");
    } catch {
      toast.error("Unable to copy link");
    }
  };

  const handleShare = async () => {
    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}/post/${post.id}`
        : "";

    try {
      if (navigator.share) {
        await navigator.share({
          title: `${post.author.name}'s post`,
          text: post.body,
          url,
        });

        return;
      }

      await navigator.clipboard.writeText(url);

      toast.success("Share link copied");
    } catch {
      // User cancelled native share.
    }
  };

  const handlePin = () => {
    const nextPinned = !pinned;

    setPinned(nextPinned);

    onChange({
      ...post,
      ...(nextPinned ? { pinned: true } : { pinned: false }),
    } as Post);

    toast.success(nextPinned ? "Post pinned" : "Post unpinned");
  };

  const nextImage = () => {
    if (!images.length) return;

    setImageIndex((current) =>
      current === images.length - 1 ? 0 : current + 1,
    );
  };

  const previousImage = () => {
    if (!images.length) return;

    setImageIndex((current) =>
      current === 0 ? images.length - 1 : current - 1,
    );
  };

  return (
    <>
      <Card className="overflow-hidden">
        {/* -------------------------------------------------- */}
        {/* HEADER                                             */}
        {/* -------------------------------------------------- */}

        <CardHeader className="pb-3">
          <div className="flex items-start gap-3">
            <Link href={`/account/${post.author.handle}`} className="shrink-0">
              <UserAvatar user={post.author} />
            </Link>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <Link
                  href={`/account/${post.author.handle}`}
                  className="truncate text-sm font-semibold hover:underline"
                >
                  {post.author.name}
                </Link>

                {post.author.verified && (
                  <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Check className="size-2.5" />
                  </span>
                )}

                {pinned && (
                  <Pin className="ml-1 size-3.5 fill-current text-muted-foreground" />
                )}
              </div>

              <div className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
                <span>@{post.author.handle}</span>

                <span>·</span>

                <span>{formatPostTime(post.created_at)}</span>

                {visibility && (
                  <>
                    <span>·</span>
                    <span className="capitalize">{visibility}</span>
                  </>
                )}
              </div>

              {(post as Post & { location?: string }).location && (
                <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="size-3" />

                  <span>{(post as Post & { location?: string }).location}</span>
                </div>
              )}
            </div>

            {/* ------------------------------------------------ */}
            {/* POST ACTIONS                                     */}
            {/* ------------------------------------------------ */}

            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0"
                    aria-label="More post actions"
                  />
                }
              >
                <MoreHorizontal />
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={handlePin}>
                  <Pin />

                  {pinned ? "Unpin post" : "Pin post"}
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => setEditing(true)}>
                  <Edit3 />
                  Edit post
                </DropdownMenuItem>

                <DropdownMenuItem onClick={handleCopyLink}>
                  <Copy />
                  Copy link
                </DropdownMenuItem>

                <DropdownMenuItem onClick={handleShare}>
                  <Share2 />
                  Share
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={() => toast.info("Report flow coming soon")}
                >
                  <Flag />
                  Report post
                </DropdownMenuItem>

                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => setDeleteDialogOpen(true)}
                >
                  <Trash2 />
                  Delete post
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        {/* -------------------------------------------------- */}
        {/* CONTENT                                            */}
        {/* -------------------------------------------------- */}

        <CardContent className="pb-3">
          <p className="whitespace-pre-wrap text-[15px] leading-7">
            {post.body}
          </p>

          {/* ------------------------------------------------ */}
          {/* IMAGES                                           */}
          {/* ------------------------------------------------ */}
          {images.length > 0 && (
            <Carousel className="mt-4 w-full">
              <CarouselContent>
                {post.images.map((image, index) => (
                  <CarouselItem key={`${image}-${index}`}>
                    <div className="flex h-150 w-full items-center justify-center overflow-hidden rounded-xl bg-muted">
                      <img
                        src={image}
                        alt={`Post image ${index + 1}`}
                        className="max-h-full max-w-full object-center"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>

              {post.images.length > 1 && (
                <>
                  <CarouselPrevious className="left-3" />
                  <CarouselNext className="right-3" />
                </>
              )}
            </Carousel>
          )}
        </CardContent>

        {/* -------------------------------------------------- */}
        {/* ACTION BAR                                         */}
        {/* -------------------------------------------------- */}

        <CardFooter className="flex-col border-t p-2">
          <div className="flex w-full items-center gap-1">
            {/* LIKE */}

            <Button
              variant="ghost"
              size="sm"
              className={post.liked ? "text-destructive" : ""}
              onClick={handleLike}
            >
              <Heart
                fill={post.liked ? "currentColor" : "none"}
                data-icon="inline-start"
              />

              <span>{formatNumber(post?.likes ? post.likes : 0)}</span>
            </Button>

            {/* COMMENT */}

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowComments((current) => !current)}
            >
              <MessageCircle data-icon="inline-start" />

              <span>{formatNumber(post?.comments ? post.comments : 0)}</span>
            </Button>

            {/* SHARE */}

            <Button variant="ghost" size="sm" onClick={handleShare}>
              <Share2 data-icon="inline-start" />

              <span>{formatNumber(post?.shares ? post.shares : 0)}</span>
            </Button>

            {/* SAVE */}

            <Button
              variant="ghost"
              size="icon"
              className="ml-auto"
              aria-label={post.saved ? "Unsave post" : "Save post"}
              onClick={handleSave}
            >
              <Bookmark fill={post.saved ? "currentColor" : "none"} />
            </Button>
          </div>

          {/* ------------------------------------------------ */}
          {/* COMMENTS                                         */}
          {/* ------------------------------------------------ */}

          {showComments && (
            <div className="w-full border-t pt-3">
              {/* Existing comments */}

              {comments.length > 0 && (
                <div className="mb-4 space-y-3">
                  {comments.map((item) => (
                    <div key={item.id} className="flex gap-2">
                      <UserAvatar user={item.author} size="size-8" />

                      <div className="min-w-0 flex-1 rounded-xl bg-muted px-3 py-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold">
                            {item.author.name}
                          </span>

                          <span className="text-[10px] text-muted-foreground">
                            {item.time}
                          </span>
                        </div>

                        <p className="mt-0.5 text-sm">{item.body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Comment input */}

              <div className="flex items-end gap-2">
                <Textarea
                  value={comment}
                  onChange={(event) => setComment(event.target.value)}
                  placeholder="Write a comment..."
                  className="min-h-10 resize-none"
                  rows={1}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      handleSubmitComment();
                    }
                  }}
                />

                <Button
                  size="icon"
                  disabled={!comment.trim()}
                  onClick={handleSubmitComment}
                  aria-label="Send comment"
                >
                  <Send />
                </Button>
              </div>

              <p className="mt-1 text-[11px] text-muted-foreground">
                Press Enter to comment · Shift + Enter for a new line
              </p>
            </div>
          )}
        </CardFooter>
      </Card>

      {/* ================================================== */}
      {/* IMAGE PREVIEW                                      */}
      {/* ================================================== */}

      <Dialog open={showImagePreview} onOpenChange={setShowImagePreview}>
        <DialogContent className="max-w-5xl border-none bg-black/95 p-2">
          <DialogHeader className="sr-only">
            <DialogTitle>Image preview</DialogTitle>

            <DialogDescription>
              Preview images from this post.
            </DialogDescription>
          </DialogHeader>

          <div className="relative flex min-h-[60vh] items-center justify-center">
            <img
              src={currentImage}
              alt={`Post image ${imageIndex + 1}`}
              className="max-h-[85vh] max-w-full object-contain"
            />

            {images.length > 1 && (
              <>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full"
                  onClick={previousImage}
                  aria-label="Previous image"
                >
                  <ChevronLeft />
                </Button>

                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full"
                  onClick={nextImage}
                  aria-label="Next image"
                >
                  <ChevronRight />
                </Button>

                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/70 px-3 py-1 text-xs text-white">
                  {imageIndex + 1} / {images.length}
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* ================================================== */}
      {/* EDIT POST                                          */}
      {/* ================================================== */}

      <Dialog open={editing} onOpenChange={setEditing}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit post</DialogTitle>

            <DialogDescription>
              Update your post content and visibility.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-2">
            <Textarea
              value={editBody}
              onChange={(event) => setEditBody(event.target.value)}
              placeholder="What's on your mind?"
              className="min-h-32 resize-none"
              maxLength={5000}
            />

            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {editBody.length}/5000
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Visibility</label>

              <Select
                value={visibility}
                onValueChange={(value) => {
                  if (value) {
                    setVisibility(value);
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select visibility" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="public">Public</SelectItem>

                  <SelectItem value="friends">Friends</SelectItem>

                  <SelectItem value="only-me">Only me</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(false)}>
              Cancel
            </Button>

            <Button onClick={handleEdit}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ================================================== */}
      {/* DELETE CONFIRMATION                                */}
      {/* ================================================== */}

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete post?</DialogTitle>

            <DialogDescription>
              This action cannot be undone. Your post will be permanently
              removed.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>

            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 data-icon="inline-start" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
