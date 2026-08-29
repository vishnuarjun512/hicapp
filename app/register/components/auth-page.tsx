"use client";
import Brand from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { toast } from "sonner";

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
