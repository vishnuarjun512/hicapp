"use client";

import { useState } from "react";
import Brand from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { validateForm } from "@/lib/utils";
import { useAuthStore } from "@/lib/stores/auth-store";

export function AuthPage({ register = false }: { register?: boolean }) {
  const router = useRouter();
  const { setUser } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const [loading, setLoading] = useState(false);

  const authSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // const validationErrors = validateForm(email, password);
    // setErrors(validationErrors);

    // if (Object.keys(validationErrors).length > 0) {
    //   toast.error("Please fix the errors in the form");
    //   return;
    // }

    setLoading(true);

    // Temporary mock operation.
    console.log("[MOCK AUTH]", {
      operation: register ? "REGISTER" : "LOGIN",
      email: email.trim(),
      password: password,
    });

    const url = `/api/${register ? "register" : "login"}`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();
      // Check if the response status is 200-299
      if (!response.ok) {
        throw new Error(`${data.message}`);
      }

      console.log("[AUTH RESPONSE] - ", data);

      setUser(data.user);

      toast.success(register ? "Account created" : "Welcome back");

      router.push(register ? "/" : "/home");
    } catch (error: any) {
      console.log("Failed Register - ", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="hidden bg-primary p-12 text-primary-foreground lg:flex lg:flex-col lg:justify-between">
        <Brand />

        <div>
          <p className="max-w-md text-4xl font-semibold leading-tight">
            A better place for the people you want to keep close.
          </p>

          <p className="mt-5 max-w-md leading-7 opacity-80">
            Less noise, more meaning. Welcome to Hicapp.
          </p>
        </div>

        <p className="text-sm opacity-70">© 2026 Hicapp</p>
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

          <form className="mt-8 flex flex-col gap-4" onSubmit={authSubmit}>
            <div className="grid gap-2">
              <Label htmlFor="auth-email">Email</Label>

              <Input
                id="auth-email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={!!errors.email}
              />

              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="auth-password">Password</Label>

              <Input
                id="auth-password"
                type="password"
                placeholder="At least 3 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={!!errors.password}
              />

              {errors.password && (
                <p className="text-sm text-destructive">{errors.password}</p>
              )}
            </div>

            <Button type="submit" size="lg" disabled={loading}>
              {loading
                ? "Please wait..."
                : register
                  ? "Create account"
                  : "Sign in"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {register ? "Already have an account?" : "New to Hicapp?"}{" "}
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
