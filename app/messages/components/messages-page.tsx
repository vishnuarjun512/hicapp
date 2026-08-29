"use client";
import { AppShell } from "@/components/app-shell";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "../../../components/ui/input";
import { conversations } from "@/lib/social-data";
import UserAvatar from "../../../components/user-avatar";
import { Badge } from "../../../components/ui/badge";
import { toast } from "sonner";
import { Button } from "../../../components/ui/button";
import { Send } from "lucide-react";

export function MessagesPage() {
  const [selected, setSelected] = useState(conversations[0]);
  const [message, setMessage] = useState("");
  return (
    <AppShell>
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight">Messages</h1>
          <p className="mt-1 text-muted-foreground">
            Private conversations with your people.
          </p>
        </div>
        <Card className="grid min-h-560px overflow-hidden md:grid-cols-[240px_1fr]">
          <div className="border-r">
            <div className="border-b p-4">
              <Input placeholder="Search conversations" />
            </div>
            <div className="flex flex-col">
              {conversations.map((conversation) => (
                <button
                  key={conversation.user.handle}
                  onClick={() => setSelected(conversation)}
                  className={`flex items-center gap-3 p-4 text-left hover:bg-muted ${selected.user.handle === conversation.user.handle ? "bg-muted" : ""}`}
                >
                  <UserAvatar user={conversation.user} size="size-9" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">
                      {conversation.user.name}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {conversation.preview}
                    </p>
                  </div>
                  {conversation.unread > 0 && (
                    <Badge>{conversation.unread}</Badge>
                  )}
                </button>
              ))}
            </div>
          </div>
          <div className="flex min-w-0 flex-col">
            <div className="flex items-center gap-3 border-b p-4">
              <UserAvatar user={selected.user} />
              <div className="min-w-0 flex-1">
                <p className="font-medium">{selected.user.name}</p>
                <div className="flex items-center gap-2">
                  <div className="bg-green-400 h-2 w-2 rounded-full" />
                  <p className="text-xs text-muted-foreground">Active now</p>
                </div>
              </div>
            </div>
            <div className="flex flex-1 flex-col justify-end gap-3 p-6">
              <div className="max-w-[80%] self-start rounded-2xl rounded-bl-sm bg-muted px-4 py-3 text-sm">
                {selected.preview}
              </div>
              <div className="max-w-[80%] self-end rounded-2xl rounded-br-sm bg-primary px-4 py-3 text-sm text-primary-foreground">
                I have been thinking about that too. Let&apos;s catch up soon.
              </div>
            </div>
            <form
              className="flex gap-2 border-t p-4"
              onSubmit={(e) => {
                e.preventDefault();
                if (message.trim()) {
                  toast.success("Message sent");
                  setMessage("");
                }
              }}
            >
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write a message..."
              />
              <Button type="submit" size="icon" aria-label="Send message">
                <Send />
              </Button>
            </form>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
