import { AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import EditProfile from "./edit-profile";

type ProfileVerificationStatusProps = {
  name?: string | null;
  handle?: string | null;
  bio?: string | null;
};

export default function ProfileVerificationStatus({
  name,
  handle,
  bio,
}: ProfileVerificationStatusProps) {
  const missingFields = [
    !name?.trim() && "name",
    !handle?.trim() && "username",
    !bio?.trim() && "bio",
  ].filter(Boolean);

  if (missingFields.length === 0) {
    return null;
  }

  return (
    <Card className="border-amber-500/20 bg-amber-500/5">
      <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-3">
          <AlertCircle className="mt-0.5 size-5 shrink-0 text-amber-600" />

          <div>
            <p className="font-medium">Complete your profile</p>

            <p className="mt-1 text-sm text-muted-foreground">
              Your profile is not verified yet. Add your name, username, and bio
              to complete your profile.
            </p>

            <p className="mt-2 text-xs text-muted-foreground">
              Missing: {missingFields.join(", ")}
            </p>
          </div>
        </div>

        <EditProfile />
      </CardContent>
    </Card>
  );
}
