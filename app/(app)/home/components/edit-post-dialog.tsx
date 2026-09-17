import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Post } from "@/lib/social-data";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

type EditPostDialogProps = {
  post: Post;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  loading?: boolean;
};

export const EditPostDialog = ({
  post,
  open,
  onOpenChange,
  onConfirm,
  loading = false,
}: EditPostDialogProps) => {
  const [editBody, setEditBody] = useState("");
  const [visibility, setVisibility] = useState("");

  useEffect(() => {
    if (post != null && open) {
      setEditBody(post.body);
      setVisibility(post.visibility);
    }
  }, [post]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>

          <Button onClick={onConfirm}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
