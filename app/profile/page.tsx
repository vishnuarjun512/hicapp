"use client";
import { useAuthStore } from "@/lib/stores/auth-store";
import ProfilePage from "./components/profile-page";

export default function Page() {
  const { user } = useAuthStore();

  if (!user) {
    return (
      <div className="text-center text-muted-foreground">No user found</div>
    );
  }

  return <ProfilePage user={user} />;
}
