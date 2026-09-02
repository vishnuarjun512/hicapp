"use client";

import { ChangeEvent, RefObject } from "react";
import { Camera, ImagePlus, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface ProfileImageSectionProps {
  name: string;
  initials: string;
  profileImage: string | null;
  removeProfileImage: boolean;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onImageChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: () => void;
}

export function ProfileImageSection({
  name,
  initials,
  profileImage,
  removeProfileImage,
  fileInputRef,
  onImageChange,
  onRemoveImage,
}: ProfileImageSectionProps) {
  return (
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
            <AvatarFallback className="text-xl">{initials}</AvatarFallback>
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
              <ImagePlus className="mr-1.5 size-4" />
              {profileImage ? "Change photo" : "Upload photo"}
            </Button>

            {profileImage && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive"
                onClick={onRemoveImage}
              >
                <Trash2 className="mr-1.5 size-4" />
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
        onChange={onImageChange}
      />
    </section>
  );
}
