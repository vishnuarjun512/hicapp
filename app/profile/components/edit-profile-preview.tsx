import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, UserRound } from "lucide-react";

interface EditProfilePreviewInterface {
  name: string;
  handle: string;
  bio: string;
  profileImage: string | null;
  removeProfileImage: boolean;
  initials: string;
}
export const EditProfilePreview: React.FC<EditProfilePreviewInterface> = ({
  name,
  handle,
  bio,
  profileImage,
  removeProfileImage,
  initials,
}) => {
  return (
    <section className="rounded-xl border bg-muted/30 p-4">
      <div className="mb-4 flex items-center gap-2">
        <UserRound className="size-4 text-muted-foreground" />

        <div>
          <p className="text-sm font-medium">Profile preview</p>

          <p className="text-xs text-muted-foreground">
            This is roughly how your profile will appear.
          </p>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <Avatar className="size-12">
          {profileImage && !removeProfileImage ? (
            <AvatarImage src={profileImage} alt="" />
          ) : null}

          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-semibold">{name || "Your name"}</p>

            {name.trim() && handle.trim() && bio.trim() && (
              <span className="flex size-4 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Check className="size-2.5" />
              </span>
            )}
          </div>

          <p className="text-xs text-muted-foreground">
            @{handle || "username"}
          </p>

          <p className="mt-2 text-sm leading-6">
            {bio || "Your bio will appear here..."}
          </p>
        </div>
      </div>
    </section>
  );
};
