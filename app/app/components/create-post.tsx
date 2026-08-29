import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";
import { Card, CardContent } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { ImagePlus } from "lucide-react";
import { Textarea } from "../../../components/ui/textarea";
import UserAvatar from "../../../components/user-avatar";
import { currentUser } from "@/lib/social-data";
import { toast } from "sonner";

export default function CreatePost({
  onCreate,
}: {
  onCreate: (body: string) => void;
}) {
  const [body, setBody] = useState("");
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <button
            type="button"
            className="w-full cursor-pointer rounded-xl text-left transition-shadow hover:shadow-md"
          />
        }
      >
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <UserAvatar user={currentUser} />

            <div className="flex-1 rounded-full bg-muted px-4 py-2.5 text-sm text-muted-foreground">
              Share something with your circle...
            </div>

            <span
              className="grid size-8 place-items-center rounded-md"
              aria-hidden="true"
            >
              <ImagePlus className="size-4" />
            </span>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a post</DialogTitle>
          <DialogDescription>
            Share a thought, link, or moment with your circle.
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-3">
          <UserAvatar user={currentUser} />
          <Textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="What is on your mind?"
            className="min-h-32"
            maxLength={500}
          />
        </div>
        <p className="text-right text-xs text-muted-foreground">
          {body.length}/500
        </p>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            disabled={!body.trim()}
            onClick={() => {
              onCreate(body);
              setBody("");
              setOpen(false);
              toast.success("Post published");
            }}
          >
            Publish post
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
