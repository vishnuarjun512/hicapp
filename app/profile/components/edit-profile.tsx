"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";

import {
  Camera,
  Check,
  ImagePlus,
  Loader2,
  Trash2,
  UserRound,
  X,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Separator } from "@/components/ui/separator";

import { toast } from "sonner";

import { useAuthStore } from "@/lib/stores/auth-store";
import { EditProfilePreview } from "./edit-profile-preview";

const MAX_BIO_LENGTH = 160;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

export default function EditProfile() {
  const [open, setOpen] = useState(false);

  const { user, setUser } = useAuthStore();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [handle, setHandle] = useState("");
  const [bio, setBio] = useState("");

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const [removeProfileImage, setRemoveProfileImage] = useState(false);

  const [saving, setSaving] = useState(false);

  /*
   * Load the current user whenever the dialog opens.
   */
  useEffect(() => {
    if (!open || !user) {
      return;
    }

    setName(user.name ?? "");
    setHandle(user.handle ?? "");
    setBio(user.bio ?? "");

    setProfileImage(user.profilePicUrl ?? null);

    setSelectedImage(null);
    setRemoveProfileImage(false);
  }, [open, user]);

  /*
   * Revoke local object URLs when the component changes/unmounts.
   */
  useEffect(() => {
    return () => {
      if (profileImage?.startsWith("blob:")) {
        URL.revokeObjectURL(profileImage);
      }
    };
  }, [profileImage]);

  /*
   * Whether anything has changed.
   */
  const hasChanges =
    !!user &&
    (name !== (user.name ?? "") ||
      handle !== (user.handle ?? "") ||
      bio !== (user.bio ?? "") ||
      selectedImage !== null ||
      removeProfileImage);

  /*
   * Profile completion.
   */
  const profileCompletion = [name.trim(), handle.trim(), bio.trim()].filter(
    Boolean,
  ).length;

  const completionPercentage = (profileCompletion / 3) * 100;

  /*
   * Handle image selection.
   */
  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    /*
     * Validate file type.
     */
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      return;
    }

    /*
     * Validate file size.
     */
    if (file.size > MAX_IMAGE_SIZE) {
      toast.error("Profile image must be smaller than 5 MB.");
      return;
    }

    /*
     * Clean up previous preview.
     */
    if (profileImage?.startsWith("blob:")) {
      URL.revokeObjectURL(profileImage);
    }

    const previewUrl = URL.createObjectURL(file);

    setSelectedImage(file);
    setProfileImage(previewUrl);
    setRemoveProfileImage(false);

    toast.success("Profile image selected");
  };

  /*
   * Remove profile image.
   */
  const handleRemoveImage = () => {
    if (profileImage?.startsWith("blob:")) {
      URL.revokeObjectURL(profileImage);
    }

    setProfileImage(null);
    setSelectedImage(null);
    setRemoveProfileImage(true);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  /*
   * Validate form before sending.
   */
  const validateForm = () => {
    const trimmedName = name.trim();
    const trimmedHandle = handle.trim();
    const trimmedBio = bio.trim();

    if (!trimmedName) {
      toast.error("Please enter your name.");
      return false;
    }

    if (trimmedName.length < 2) {
      toast.error("Name must be at least 2 characters.");
      return false;
    }

    if (!trimmedHandle) {
      toast.error("Please enter a username.");
      return false;
    }

    if (trimmedHandle.length < 3) {
      toast.error("Username must be at least 3 characters.");
      return false;
    }

    /*
     * Only allow letters, numbers and underscores.
     */
    if (!/^[a-zA-Z0-9_]+$/.test(trimmedHandle)) {
      toast.error(
        "Username can only contain letters, numbers and underscores.",
      );
      return false;
    }

    if (trimmedBio.length > MAX_BIO_LENGTH) {
      toast.error(`Bio cannot be longer than ${MAX_BIO_LENGTH} characters.`);
      return false;
    }

    return true;
  };

  /*
   * Save profile.
   */
  const handleSaveChanges = async () => {
    if (!user) {
      toast.error("User not found.");
      return;
    }

    if (!validateForm()) {
      return;
    }

    setSaving(true);

    try {
      /*
       * Use FormData because the request can contain:
       *
       * - text fields
       * - profile image
       */
      const formData = new FormData();

      formData.append("name", name.trim());
      formData.append("handle", handle.trim());
      formData.append("bio", bio.trim());

      /*
       * Only send a file if the user selected a new one.
       */
      if (selectedImage) {
        formData.append("profilePic", selectedImage);
      }

      /*
       * Tell backend that the existing image should be removed.
       */
      if (removeProfileImage) {
        formData.append("removeProfileImage", "true");
      }

      const url =
        process.env.NEXT_PUBLIC_BASE_URL + "/user/edit-profile/" + user.id;

      const response = await fetch(url, {
        method: "PUT",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile.");
      }

      /*
       * Ideally your backend should return the
       * complete updated user.
       *
       * Example:
       *
       * {
       *   user: {...}
       * }
       */
      const updatedUser = data.user;

      if (updatedUser) {
        setUser(updatedUser);
      } else {
        /*
         * Temporary fallback if backend currently
         * doesn't return the complete user.
         */
        setUser({
          ...user,
          name: name.trim(),
          handle: handle.trim(),
          bio: bio.trim(),
          profilePicUrl: removeProfileImage
            ? undefined
            : (profileImage ?? user.profilePicUrl),
        });
      }

      toast.success("Profile updated successfully!");

      setOpen(false);
    } catch (error) {
      console.error("Error saving profile changes:", error);

      toast.error(
        error instanceof Error ? error.message : "Failed to update profile.",
      );
    } finally {
      setSaving(false);
    }
  };

  /*
   * Don't accidentally lose changes.
   */
  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && hasChanges && !saving) {
      const shouldClose = window.confirm(
        "You have unsaved changes. Are you sure you want to close?",
      );

      if (!shouldClose) {
        return;
      }
    }

    setOpen(nextOpen);
  };

  const initials =
    name
      .trim()
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button variant="outline">Edit profile</Button>}>
        Edit profile
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Edit your profile</DialogTitle>

          <DialogDescription>
            Update your profile information and choose how people see you.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-2">
          {/* ========================================= */}
          {/* PROFILE IMAGE                             */}
          {/* ========================================= */}

          <section className="rounded-xl border bg-muted/30 p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="relative mx-auto sm:mx-0">
                <Avatar className="size-24 border-4 border-background shadow-md">
                  {profileImage && !removeProfileImage ? (
                    <AvatarImage
                      src={profileImage}
                      alt={`${name}'s profile picture`}
                    />
                  ) : null}

                  <AvatarFallback className="text-xl">
                    {initials}
                  </AvatarFallback>
                </Avatar>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 flex size-8 items-center justify-center rounded-full border-2 border-background bg-primary text-primary-foreground shadow-sm transition hover:scale-105"
                  aria-label="Change profile picture"
                >
                  <Camera className="size-4" />
                </button>
              </div>

              <div className="min-w-0 flex-1 text-center sm:text-left">
                <h3 className="font-medium">Profile picture</h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  Choose a clear photo so people can recognize you.
                </p>

                <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <ImagePlus data-icon="inline-start" />
                    {profileImage ? "Change photo" : "Upload photo"}
                  </Button>

                  {profileImage && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={handleRemoveImage}
                    >
                      <Trash2 data-icon="inline-start" />
                      Remove
                    </Button>
                  )}
                </div>

                <p className="mt-2 text-xs text-muted-foreground">
                  JPG, PNG or WEBP · Max 5 MB
                </p>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={handleImageChange}
            />
          </section>

          {/* ========================================= */}
          {/* PROFILE COMPLETION                        */}
          {/* ========================================= */}

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
                style={{
                  width: `${completionPercentage}%`,
                }}
              />
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <CompletionItem completed={!!name.trim()} label="Name" />

              <CompletionItem completed={!!handle.trim()} label="Username" />

              <CompletionItem completed={!!bio.trim()} label="Bio" />
            </div>
          </section>

          <Separator />

          {/* ========================================= */}
          {/* BASIC INFORMATION                         */}
          {/* ========================================= */}

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
                onChange={(event) => setName(event.target.value)}
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

                    setHandle(value);
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
                    bio.length > MAX_BIO_LENGTH
                      ? "text-xs text-destructive"
                      : "text-xs text-muted-foreground"
                  }
                >
                  {bio.length}/{MAX_BIO_LENGTH}
                </span>
              </div>

              <Textarea
                id="profile-bio"
                value={bio}
                maxLength={MAX_BIO_LENGTH}
                placeholder="Tell people a little about yourself..."
                className="min-h-28 resize-none"
                disabled={saving}
                onChange={(event) => setBio(event.target.value)}
              />

              <p className="text-xs text-muted-foreground">
                Keep it short and let your personality show.
              </p>
            </div>
          </section>

          {/* ========================================= */}
          {/* PROFILE PREVIEW                           */}
          {/* ========================================= */}

          <EditProfilePreview
            name={name}
            handle={handle}
            bio={bio}
            profileImage={profileImage}
            removeProfileImage={removeProfileImage}
            initials={initials}
          />
        </div>

        {/* =========================================== */}
        {/* FOOTER                                      */}
        {/* =========================================== */}

        <DialogFooter className="gap-2 sm:gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={saving}
            onClick={() => handleOpenChange(false)}
          >
            <X data-icon="inline-start" />
            Cancel
          </Button>

          <Button
            type="button"
            disabled={saving || !hasChanges}
            onClick={handleSaveChanges}
          >
            {saving ? (
              <>
                <Loader2 className="animate-spin" data-icon="inline-start" />
                Saving...
              </>
            ) : (
              "Save changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/*
 * Small profile completion indicator.
 */
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
