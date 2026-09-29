"use client";

import { useEffect, useState } from "react";
import { Edit3, Info, MoreHorizontal, Send, Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import UserAvatar from "@/components/user-avatar";

import { Comment } from "@/lib/social-data";
import { useAuthStore } from "@/lib/stores/auth-store";
import {
  createComment,
  deleteComment,
  getComments,
  updateComment,
} from "@/lib/(apiCalls)/post/comment";
import { useApi } from "@/lib/(apiCalls)/useApi";
import { useDataStore } from "@/lib/stores/data-store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatPostTime } from "@/lib/utils";

type PostCommentsSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  postId: string;
  ownPost?: boolean;
  commentCount?: number;
};

export default function PostCommentsSheet({
  open,
  onOpenChange,
  postId,
  ownPost,
  commentCount = 0,
}: PostCommentsSheetProps) {
  const authUser = useAuthStore((state) => state.user);
  const { setPosts, posts } = useDataStore();

  const [comments, setComments] = useState<Comment[]>([]);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { execute } = useApi();

  useEffect(() => {
    if (!open || !postId) return;

    const loadComments = async () => {
      try {
        setLoading(true);

        const data = await execute(() => getComments(postId));
        setComments(data.comments);
      } catch (error) {
        console.error("Failed to load comments:", error);
        toast.error("Failed to load comments");
      } finally {
        setLoading(false);
      }
    };

    loadComments();
  }, [open, postId]);

  const handleSubmitComment = async () => {
    const trimmedComment = comment.trim();

    if (!trimmedComment) return;

    if (!authUser) {
      toast.error("You must be logged in to comment");
      return;
    }

    try {
      setSubmitting(true);

      const data = await execute(() => createComment(postId, trimmedComment));

      if (data?.error) {
        throw new Error(data.message);
      }

      const { newComment } = data;

      setComments((current) => [...current, newComment]);
      setPosts(
        posts.map((post) =>
          post.id === postId
            ? {
                ...post,
                comments: (post.comments ?? 0) + 1,
              }
            : post,
        ),
      );
      setComment("");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to add comment.",
      );
      console.error("Failed to add comment:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const [editingComment, setEditingComment] = useState<Comment | null>(null);
  const [editCommentText, setEditCommentText] = useState("");

  const handleEditComment = (comment: Comment) => {
    setEditingComment(comment);
    setEditCommentText(comment.comment);
  };

  const handleUpdateComment = async () => {
    if (!editingComment) return;

    try {
      const data = await execute(() =>
        updateComment(editingComment.id, editCommentText),
      );

      const { updatedComment } = data;

      setComments(
        comments.map((comment) =>
          comment.id == editingComment?.id ? updatedComment : comment,
        ),
      );
    } catch (error) {
      console.error("Failed to delete comment:", error);
    } finally {
      setEditingComment(null);
      setEditCommentText("");
    }
  };

  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(
    null,
  );

  const handleDeleteComment = (commentId: string) => {
    setDeletingCommentId(commentId);
  };

  const handleConfirmDeleteComment = async () => {
    if (!deletingCommentId) return;
    try {
      const data = await execute(() => deleteComment(deletingCommentId));

      const { deletedCommentID } = data;

      setComments(comments.filter((comment) => comment.id != deletedCommentID));
      setPosts(
        posts.map((post) =>
          post.id === postId
            ? {
                ...post,
                comments: (post.comments ?? 0) - 1,
              }
            : post,
        ),
      );
      setComment("");
    } catch (error) {
      console.error("Failed to delete comment:", error);
    } finally {
      setDeletingCommentId(null);
    }
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="right"
          className="flex w-full flex-col p-0 sm:max-w-lg"
        >
          <SheetHeader className="border-b px-5 py-4">
            <SheetTitle>Comments</SheetTitle>

            <SheetDescription>
              {commentCount} {commentCount === 1 ? "comment" : "comments"}
            </SheetDescription>
          </SheetHeader>

          {/* Comments */}
          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-5 py-4">
            {loading ? (
              <div className="flex flex-1 items-center justify-center">
                <p className="text-sm text-muted-foreground">
                  Loading comments...
                </p>
              </div>
            ) : comments.length === 0 ? (
              <div className="flex flex-1 items-center justify-center">
                <div className="text-center">
                  <p className="font-medium">No comments yet</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Be the first to comment.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                {comments.map((item) => {
                  const isMine = ownPost || item.author.id === authUser?.id;

                  return (
                    <div key={item.id} className="group flex gap-3">
                      {/* Avatar */}
                      <UserAvatar user={item.author} size="size-9" />

                      {/* Comment content */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start gap-2">
                          <div className="min-w-0 flex-1">
                            {/* Author + time */}
                            <div className="flex items-baseline gap-2">
                              <span className="text-sm font-semibold">
                                {item.author.name}
                              </span>

                              <span className="text-[11px] text-muted-foreground">
                                {new Date(item.updated_at).getTime() !==
                                new Date(item.created_at).getTime()
                                  ? `Edited · ${formatPostTime(item.updated_at)}`
                                  : formatPostTime(item.created_at)}
                              </span>
                            </div>

                            {/* Comment */}
                            <p className="mt-1 whitespace-pre-wrap wrap-break-word text-sm leading-6 text-foreground">
                              {item.comment}
                            </p>
                          </div>

                          {/* Own comment actions */}
                          {isMine && (
                            <DropdownMenu>
                              <DropdownMenuTrigger
                                render={
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="size-7 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                                    aria-label="Comment actions"
                                  />
                                }
                              >
                                <MoreHorizontal className="size-4" />
                              </DropdownMenuTrigger>

                              <DropdownMenuContent align="end" className="w-32">
                                {item.author.id == authUser?.id && (
                                  <DropdownMenuItem
                                    onClick={() => handleEditComment(item)}
                                  >
                                    <Edit3 />
                                    Edit
                                  </DropdownMenuItem>
                                )}

                                <DropdownMenuItem
                                  className="text-destructive focus:text-destructive"
                                  onClick={() => handleDeleteComment(item.id)}
                                >
                                  <Trash2 />
                                  Delete
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-destructive focus:text-destructive"
                                  onClick={() => handleDeleteComment(item.id)}
                                >
                                  <Info />
                                  Report
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Comment input */}
          <div className="border-t p-4">
            <div className="flex items-end gap-2">
              <Textarea
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                placeholder="Write a comment..."
                className="min-h-10 resize-none"
                rows={1}
                disabled={submitting}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    handleSubmitComment();
                  }
                }}
              />

              <Button
                size="icon"
                disabled={!comment.trim() || submitting}
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
        </SheetContent>
      </Sheet>
      <Dialog
        open={!!editingComment}
        onOpenChange={(open) => {
          if (!open) {
            setEditingComment(null);
            setEditCommentText("");
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit comment</DialogTitle>
            <DialogDescription>Make changes to your comment.</DialogDescription>
          </DialogHeader>

          <Textarea
            value={editCommentText}
            onChange={(event) => setEditCommentText(event.target.value)}
            className="min-h-24 resize-none"
            autoFocus
          />

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingComment(null)}>
              Cancel
            </Button>

            <Button onClick={handleUpdateComment}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog
        open={!!deletingCommentId}
        onOpenChange={(open) => {
          if (!open) {
            setDeletingCommentId(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete comment?</DialogTitle>

            <DialogDescription>
              This comment will be permanently deleted.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeletingCommentId(null)}
            >
              Cancel
            </Button>

            <Button variant="destructive" onClick={handleConfirmDeleteComment}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
