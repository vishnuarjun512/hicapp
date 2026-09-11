"use client";
import { Copy, MoreHorizontal, Pencil, Reply, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Message } from "@/lib/types";
import { toast } from "sonner";
type MessageActionsProps = {
  message: Message;
  isMine: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCopy: (message: Message) => void;
  onReply?: (message: Message) => void;
  onEdit?: (message: Message) => void;
  onDelete?: () => void;
};
export function MessageActions({
  message,
  isMine,
  open,
  onOpenChange,
  onCopy,
  onReply,
  onEdit,
  onDelete,
}: MessageActionsProps) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      toast.success("Message copied");
      onCopy(message);
    } catch {
      toast.error("Couldn't copy message");
    }
  };
  return (
    <DropdownMenu open={open} onOpenChange={onOpenChange}>
      {" "}
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="size-8 shrink-0 text-muted-foreground opacity-100 transition-opacity hover:text-foreground sm:opacity-0 sm:group-hover:opacity-100"
            aria-label="Message options"
          />
        }
      >
        {" "}
        <MoreHorizontal className="size-4" />{" "}
      </DropdownMenuTrigger>{" "}
      <DropdownMenuContent align={isMine ? "end" : "start"} className="w-44">
        {" "}
        <DropdownMenuItem onClick={handleCopy}>
          {" "}
          <Copy /> Copy{" "}
        </DropdownMenuItem>{" "}
        <DropdownMenuItem onClick={() => onReply?.(message)}>
          {" "}
          <Reply /> Reply{" "}
        </DropdownMenuItem>{" "}
        {isMine && (
          <>
            {" "}
            <DropdownMenuSeparator />{" "}
            <DropdownMenuItem onClick={() => onEdit?.(message)}>
              {" "}
              <Pencil /> Edit{" "}
            </DropdownMenuItem>{" "}
            <DropdownMenuItem variant="destructive" onClick={onDelete}>
              {" "}
              <Trash2 /> Delete{" "}
            </DropdownMenuItem>{" "}
          </>
        )}{" "}
      </DropdownMenuContent>{" "}
    </DropdownMenu>
  );
}
