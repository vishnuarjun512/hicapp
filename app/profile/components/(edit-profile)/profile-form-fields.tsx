"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ProfileFormFieldsProps {
  name: string;
  handle: string;
  bio: string;
  maxBioLength: number;
  saving: boolean;
  onNameChange: (val: string) => void;
  onHandleChange: (val: string) => void;
  onBioChange: (val: string) => void;
}

export function ProfileFormFields({
  name,
  handle,
  bio,
  maxBioLength,
  saving,
  onNameChange,
  onHandleChange,
  onBioChange,
}: ProfileFormFieldsProps) {
  return (
    <section className="space-y-5">
      <div>
        <h3 className="font-medium">Basic information</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          This information will appear on your profile.
        </p>
      </div>

      {/* NAME */}
      <div className="grid gap-2">
        <Label htmlFor="profile-name">Name</Label>
        <Input
          id="profile-name"
          value={name}
          maxLength={50}
          placeholder="Your name"
          disabled={saving}
          onChange={(event) => onNameChange(event.target.value)}
        />
        <p className="text-xs text-muted-foreground">{name.length}/50</p>
      </div>

      {/* USERNAME */}
      <div className="grid gap-2">
        <Label htmlFor="profile-handle">Username</Label>
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            @
          </span>
          <Input
            id="profile-handle"
            value={handle}
            maxLength={30}
            className="pl-8"
            placeholder="username"
            disabled={saving}
            onChange={(event) => {
              const value = event.target.value
                .replace(/[^a-zA-Z0-9_]/g, "")
                .toLowerCase();
              onHandleChange(value);
            }}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Letters, numbers and underscores only.
        </p>
      </div>

      {/* BIO */}
      <div className="grid gap-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="profile-bio">Bio</Label>
          <span
            className={
              bio.length > maxBioLength
                ? "text-xs text-destructive"
                : "text-xs text-muted-foreground"
            }
          >
            {bio.length}/{maxBioLength}
          </span>
        </div>
        <Textarea
          id="profile-bio"
          value={bio}
          maxLength={maxBioLength}
          placeholder="Tell people a little about yourself..."
          className="min-h-28 resize-none"
          disabled={saving}
          onChange={(event) => onBioChange(event.target.value)}
        />
        <p className="text-xs text-muted-foreground">
          Keep it short and let your personality show.
        </p>
      </div>
    </section>
  );
}
