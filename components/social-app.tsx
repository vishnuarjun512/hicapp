"use client";

import Link from "next/link";

import { useState } from "react";
import {
  Bookmark,
  Check,
  ChevronDown,
  Heart,
  Home,
  MessageCircle,
  MoreHorizontal,
  Send,
  Settings,
  Share2,
  Sparkles,
  UserRound,
  Users,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  currentUser,
  conversations,
  friendRequests,
  formatNumber,
  posts,
  suggestions,
  User,
  users,
} from "@/lib/social-data";
import UserAvatar from "./user-avatar";
import PostCard from "./post-card";
import { AppShell } from "./app-shell";
import Brand from "./brand";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-4 py-6 lg:px-8">
        <Brand />
        <div className="flex items-center gap-2">
          <Link href="/login">
            <Button variant="ghost">Sign in</Button>
          </Link>
          <Link href="/register">
            <Button>Get started</Button>
          </Link>
        </div>
      </header>
      <main>
        <section className="mx-auto grid max-w-7xl items-center gap-16 px-4 pb-20 pt-16 lg:grid-cols-2 lg:px-8 lg:pb-28 lg:pt-24">
          <div>
            <Badge className="mb-6" variant="secondary">
              <Sparkles data-icon="inline-start" /> A calmer social network
            </Badge>
            <h1 className="max-w-xl text-balance text-5xl font-semibold tracking-tight sm:text-6xl">
              Stay close to the people who make life richer.
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-8 text-muted-foreground">
              Kindred is a thoughtful place to share small moments, follow
              curious minds, and have conversations that stay human.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/register">
                <Button size="lg">Create your account</Button>
              </Link>
              <Link href="/app">
                <Button size="lg" variant="outline">
                  Explore the feed <ChevronDown data-icon="inline-end" />
                </Button>
              </Link>
            </div>
            <div className="mt-8 flex items-center gap-3 text-sm text-muted-foreground">
              <div className="flex -space-x-2">
                {users.slice(0, 3).map((user) => (
                  <UserAvatar key={user.handle} user={user} size="size-8" />
                ))}
              </div>
              <span>Join 12,000+ kindred spirits</span>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 rounded-[2rem] bg-primary/10 blur-2xl" />
            <Card className="relative overflow-hidden shadow-xl">
              <CardHeader className="flex-row items-center justify-between border-b">
                <div className="flex items-center gap-3">
                  <UserAvatar user={currentUser} />
                  <div>
                    <p className="text-sm font-semibold">Maya Chen</p>
                    <p className="text-xs text-muted-foreground">Just now</p>
                  </div>
                </div>
                <Badge variant="secondary">For you</Badge>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-lg leading-8">
                  The internet feels better when we leave a little more room for
                  curiosity.
                </p>
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-primary p-4 text-primary-foreground">
                    <MessageCircle className="mb-8" />
                    <p className="text-sm font-medium">Real conversations</p>
                  </div>
                  <div className="rounded-xl bg-muted p-4">
                    <Heart className="mb-8" />
                    <p className="text-sm font-medium">Gentle connection</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="justify-between border-t text-sm text-muted-foreground">
                <span>284 likes</span>
                <span>32 comments</span>
              </CardFooter>
            </Card>
          </div>
        </section>
        <section className="border-y bg-muted/40">
          <div className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
            <div className="max-w-xl">
              <p className="text-sm font-semibold uppercase tracking-widest text-primary">
                Everything in one place
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                Your people, your pace.
              </h2>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                [
                  "Share thoughts",
                  "Make a post that sounds like you, not an algorithm.",
                  Sparkles,
                ],
                [
                  "Find your people",
                  "Discover interesting humans beyond your usual circle.",
                  Users,
                ],
                [
                  "Stay in touch",
                  "Private messages for the conversations that matter.",
                  MessageCircle,
                ],
                [
                  "Keep the good stuff",
                  "Save the posts you want to come back to.",
                  Bookmark,
                ],
              ].map(([title, desc, Icon]) => (
                <Card key={title as string} className="border-0 shadow-none">
                  <CardContent className="p-6">
                    <div className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
                      <Icon />
                    </div>
                    <h3 className="mt-5 font-semibold">{title as string}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {desc as string}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <Brand />
        <div className="flex gap-5">
          <Link href="#">About</Link>
          <Link href="#">Privacy</Link>
          <Link href="#">Terms</Link>
          <Link href="#">Contact</Link>
        </div>
        <span>© 2026 Kindred</span>
      </footer>
    </div>
  );
}

function ProfileHeader({ user, own = false }: { user: User; own?: boolean }) {
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
function EditProfile() {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" />}>
        Edit profile
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit your profile</DialogTitle>
          <DialogDescription>
            Make changes to how people see you.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" defaultValue={currentUser.name} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="handle">Username</Label>
            <Input id="handle" defaultValue={currentUser.handle} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" defaultValue={currentUser.bio} maxLength={160} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              setOpen(false);
              toast.success("Profile updated");
            }}
          >
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
export function ProfilePage({
  user = currentUser,
  own = true,
}: {
  user?: User;
  own?: boolean;
}) {
  return (
    <AppShell>
      <div className="mx-auto max-w-3xl">
        <ProfileHeader user={user} own={own} />
        <Tabs defaultValue="posts" className="mt-6">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="followers">Followers</TabsTrigger>
            <TabsTrigger value="following">Following</TabsTrigger>
            <TabsTrigger value="friends">Friends</TabsTrigger>
          </TabsList>
          <TabsContent value="posts" className="mt-4 flex flex-col gap-4">
            {posts
              .filter((post) => post.author.handle === user.handle || own)
              .map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onChange={() => toast.success("Post updated")}
                />
              ))}
          </TabsContent>
          <TabsContent value="followers" className="mt-4">
            <UserList users={users} />
          </TabsContent>
          <TabsContent value="following" className="mt-4">
            <UserList users={suggestions} />
          </TabsContent>
          <TabsContent value="friends" className="mt-4">
            <UserList users={users.slice(0, 3)} />
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}
function UserList({ users: list }: { users: User[] }) {
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
export function FriendsPage() {
  const [requests, setRequests] = useState(friendRequests);
  return (
    <AppShell>
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight">Your people</h1>
          <p className="mt-1 text-muted-foreground">
            Keep up with friends and find new kindred spirits.
          </p>
        </div>
        <Tabs defaultValue="requests">
          <TabsList>
            <TabsTrigger value="requests">
              Requests <Badge className="ml-2">{requests.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="friends">Friends</TabsTrigger>
            <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
          </TabsList>
          <TabsContent value="requests" className="mt-6 flex flex-col gap-3">
            {requests.map((user) => (
              <Card key={user.handle}>
                <CardContent className="flex items-center gap-3 p-4">
                  <UserAvatar user={user} />
                  <div className="flex-1">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">
                      @{user.handle} · 8 mutual friends
                    </p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => {
                      setRequests(
                        requests.filter((item) => item.handle !== user.handle),
                      );
                      toast.success(`You and ${user.name} are now friends`);
                    }}
                  >
                    Accept
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      setRequests(
                        requests.filter((item) => item.handle !== user.handle),
                      )
                    }
                  >
                    Ignore
                  </Button>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
          <TabsContent value="friends" className="mt-6">
            <UserList users={users.slice(0, 3)} />
          </TabsContent>
          <TabsContent value="suggestions" className="mt-6">
            <UserList users={suggestions} />
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}
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
              <div>
                <p className="font-medium">{selected.user.name}</p>
                <p className="text-xs text-muted-foreground">Active now</p>
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
export function SavedPage() {
  const saved = posts.filter((post) => post.saved);
  return (
    <AppShell>
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <p className="text-sm font-medium text-primary">Your collection</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Saved posts
          </h1>
          <p className="mt-1 text-muted-foreground">
            {saved.length} posts saved for later.
          </p>
        </div>
        <div className="mb-4 flex gap-2">
          <Input placeholder="Filter saved posts" />
          <Button variant="outline">
            Newest <ChevronDown data-icon="inline-end" />
          </Button>
        </div>
        <div className="flex flex-col gap-4">
          {saved.length ? (
            saved.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onChange={() => toast.success("Removed from saved")}
              />
            ))
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center gap-3 p-12 text-center">
                <Bookmark className="size-8 text-muted-foreground" />
                <h2 className="font-semibold">Nothing saved yet</h2>
                <p className="text-sm text-muted-foreground">
                  When you find something worth keeping, it will appear here.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AppShell>
  );
}
export function SettingsPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>
          <p className="mt-1 text-muted-foreground">
            Manage your account and preferences.
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <h2 className="font-semibold">Account information</h2>
              <p className="text-sm text-muted-foreground">
                Update the details connected to your account.
              </p>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  defaultValue="maya@example.com"
                  type="email"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">New password</Label>
                <Input
                  id="password"
                  placeholder="Leave blank to keep current"
                  type="password"
                />
              </div>
              <Button
                className="w-fit"
                onClick={() => toast.success("Account settings saved")}
              >
                Save changes
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <h2 className="font-semibold">Preferences</h2>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              <label className="flex items-center justify-between gap-4">
                <span>
                  <span className="block text-sm font-medium">
                    Email notifications
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Get updates about activity.
                  </span>
                </span>
                <input
                  type="checkbox"
                  defaultChecked
                  className="size-4 accent-primary"
                />
              </label>
              <Separator />
              <label className="flex items-center justify-between gap-4">
                <span>
                  <span className="block text-sm font-medium">
                    Private profile
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Only friends can see your posts.
                  </span>
                </span>
                <input type="checkbox" className="size-4 accent-primary" />
              </label>
            </CardContent>
          </Card>
          <Button
            variant="destructive"
            className="w-fit"
            onClick={() =>
              toast.error("Please contact support to delete your account")
            }
          >
            Delete account
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
export function AuthPage({ register = false }: { register?: boolean }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="hidden bg-primary p-12 text-primary-foreground lg:flex lg:flex-col lg:justify-between">
        <Brand />
        <div>
          <p className="max-w-md text-4xl font-semibold leading-tight">
            A better place for the people you want to keep close.
          </p>
          <p className="mt-5 max-w-md leading-7 opacity-80">
            Less noise, more meaning. Welcome to Kindred.
          </p>
        </div>
        <p className="text-sm opacity-70">© 2026 Kindred</p>
      </div>
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <Brand />
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">
            {register ? "Create your account" : "Welcome back"}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {register
              ? "Find your people and start sharing."
              : "Sign in to see what your circle is up to."}
          </p>
          <form
            className="mt-8 flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              toast.success(register ? "Account created" : "Welcome back");
              window.location.href = "/app";
            }}
          >
            <div className="grid gap-2">
              <Label htmlFor="auth-email">Email</Label>
              <Input
                id="auth-email"
                type="email"
                placeholder="you@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="auth-password">Password</Label>
              <Input
                id="auth-password"
                type="password"
                placeholder="At least 8 characters"
                minLength={8}
                required
              />
            </div>
            <Button type="submit" size="lg">
              {register ? "Create account" : "Sign in"}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            {register ? "Already have an account?" : "New to Kindred?"}{" "}
            <Link
              className="font-medium text-primary hover:underline"
              href={register ? "/login" : "/register"}
            >
              {register ? "Sign in" : "Create an account"}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
