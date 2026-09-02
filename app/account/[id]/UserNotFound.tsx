"use client";

import { useEffect } from "react";
import { toast } from "sonner";

export default function UserNotFound() {
  useEffect(() => {
    toast.error("User not found");
  }, []);

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center">
        <h1 className="text-xl font-semibold">User not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The profile you're looking for doesn't exist.
        </p>
      </div>
    </div>
  );
}
