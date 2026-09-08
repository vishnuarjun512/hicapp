import Link from "next/link";
import Brand from "./brand";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Bookmark,
  ChevronDown,
  Heart,
  MessageCircle,
  Sparkles,
  Users,
} from "lucide-react";
import { currentUser, users } from "@/lib/social-data";
import UserAvatar from "./user-avatar";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";

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
              <Link href="/home">
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
