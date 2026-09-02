"use client";
import { useAuthStore } from "@/lib/stores/auth-store";

import ProfilePage from "./components/profile-page";

export default function Page() {
  const { user } = useAuthStore();

  if (!user) {
    return (
      <div className="flex h-full w-full items-center justify-center text-muted-foreground">
        <p>Loading profile...</p>
      </div>
    );
  }

  return <ProfilePage user={user} />;
}
