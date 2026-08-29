"use client";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

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
