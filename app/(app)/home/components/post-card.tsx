"use client";

import { useEffect, useState } from "react";
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
import { likePost, unlikePost } from "@/lib/(apiCalls)/post/like";

import PostCommentsSheet from "./post-comment-section";
import { DeletePostConfirmationDialog } from "./delete-post-dialog-confirmation";
import { EditPostDialog } from "./edit-post-dialog";
import { deletePost } from "@/lib/(apiCalls)/post/post";
import { useApi } from "@/lib/(apiCalls)/useApi";

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

  const [imageIndex, setImageIndex] = useState(0);

  const [showImagePreview, setShowImagePreview] = useState(false);

  const [editing, setEditing] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);

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

  const { execute } = useApi();

  /**
   * Temporary local comments.
   *
   * Eventually these should come from your backend.
   */

  const images = post.images ?? [];

  const hasImages = images.length > 0;

  const currentImage = images[imageIndex]?.url;

  const handleLike = async (postId: string) => {
    post.liked ? await unlikePost(postId) : await likePost(postId);

    onChange({
      ...post,
      liked: !post.liked,
      likes: post.liked ? post.likes - 1 : post.likes + 1,
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
    const { message } = await execute(() => deletePost(post.id));

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

        <CardHeader className="pb-1">
          <div className="flex items-start gap-3">
            <Link href={`/account/${post?.author?.id}`} className="shrink-0">
              <UserAvatar user={post?.author} />
            </Link>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <Link
                  href={`/account/${post?.author?.id}`}
                  className="truncate text-sm font-semibold hover:underline"
                >
                  {post?.author?.name}
                </Link>

                {post?.author?.verified && (
                  <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Check className="size-2.5" />
                  </span>
                )}

                {pinned && (
                  <Pin className="ml-1 size-3.5 fill-current text-muted-foreground" />
                )}
              </div>

              <div className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
                <span>@{post?.author?.handle}</span>

                <span>·</span>

                <span>{formatPostTime(post?.created_at)}</span>

                {visibility && (
                  <>
                    <span>·</span>
                    <span className="capitalize">{visibility}</span>
                  </>
                )}

                {(post as Post & { location?: string }).location && (
                  <div className="flex items-center gap-1 text-xs text-gray-300">
                    <span>·</span>
                    <MapPin className="size-3" />

                    <span>
                      {(post as Post & { location?: string }).location}
                    </span>
                  </div>
                )}
              </div>
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

                <DropdownMenuItem
                  onClick={() => {
                    setEditing(true);
                    setEditingPost(post);
                  }}
                >
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
                  <CarouselItem key={`${image.position}-${index}`}>
                    <div className="flex h-150 w-full items-center justify-center overflow-hidden rounded-xl bg-muted">
                      <img
                        src={image.url}
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
              className={post?.liked ? "text-destructive" : ""}
              onClick={() => handleLike(post.id)}
            >
              <Heart
                fill={post?.liked ? "currentColor" : "none"}
                data-icon="inline-start"
              />

              <span>{formatNumber(post?.likes ? post.likes : 0)}</span>
            </Button>

            {/* COMMENT */}

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowComments(true)}
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

      {editingPost && editing && (
        <EditPostDialog
          onConfirm={handleEdit}
          onOpenChange={setEditing}
          open={editing}
          post={editingPost}
        />
      )}

      {/* ================================================== */}
      {/* DELETE CONFIRMATION                                */}
      {/* ================================================== */}

      <DeletePostConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
      />

      <PostCommentsSheet
        open={showComments}
        onOpenChange={setShowComments}
        postId={post?.id}
        ownPost={post?.author?.id == authUser?.id}
        commentCount={post?.comments ?? 0}
      />
    </>
  );
}
