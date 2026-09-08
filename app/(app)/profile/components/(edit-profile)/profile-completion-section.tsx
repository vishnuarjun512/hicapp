"use client";

import { Check } from "lucide-react";

interface ProfileCompletionSectionProps {
  name: string;
  handle: string;
  bio: string;
}

export function ProfileCompletionSection({
  name,
  handle,
  bio,
}: ProfileCompletionSectionProps) {
  const profileCompletion = [name.trim(), handle.trim(), bio.trim()].filter(
    Boolean,
  ).length;

  const completionPercentage = (profileCompletion / 3) * 100;

  return (
    <section className="rounded-xl border p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium">Profile completion</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Complete your profile to help people get to know you.
          </p>
        </div>
        <span className="text-sm font-semibold">
          {Math.round(completionPercentage)}%
        </span>
      </div>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${completionPercentage}%` }}
        />
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <CompletionItem completed={!!name.trim()} label="Name" />
        <CompletionItem completed={!!handle.trim()} label="Username" />
        <CompletionItem completed={!!bio.trim()} label="Bio" />
      </div>
    </section>
  );
}

function CompletionItem({
  completed,
  label,
}: {
  completed: boolean;
  label: string;
}) {
  return (
    <span
      className={
        completed
          ? "inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs text-primary"
          : "inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground"
      }
    >
      {completed && <Check className="size-3" />}
      {label}
    </span>
  );
}
