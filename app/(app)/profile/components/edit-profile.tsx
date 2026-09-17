"use client";

import { ChangeEvent, ReactNode, useEffect, useRef, useState } from "react";
import { Loader2, X } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

import { useAuthStore } from "@/lib/stores/auth-store";
import { EditProfilePreview } from "./(edit-profile)/edit-profile-preview";
import { ProfileImageSection } from "./(edit-profile)/profile-image-section";
import { ProfileCompletionSection } from "./(edit-profile)/profile-completion-section";
import { ProfileFormFields } from "./(edit-profile)/profile-form-fields";
import { useApi } from "@/lib/(apiCalls)/useApi";
import {
  getProfileImageUploadUrl,
  updateProfileData,
} from "@/lib/(apiCalls)/user/user";
import { uploadFileToS3 } from "@/lib/(apiCalls)/s3/uploadFileToS3";

const MAX_BIO_LENGTH = 160;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

interface EditProfileProps {
  /** Optional custom trigger component to open the edit dialog */
  trigger?: ReactNode;
}

export default function EditProfile({ trigger }: EditProfileProps) {
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

  const { execute } = useApi();

  // Synchronize form state whenever the dialog opens or user state updates
  useEffect(() => {
    if (!open || !user) return;

    setName(user.name ?? "");
    setHandle(user.handle ?? "");
    setBio(user.bio ?? "");
    setProfileImage(user.profile_pic_url ?? null);
    setSelectedImage(null);
    setRemoveProfileImage(false);
  }, [open, user]);

  // Safely revoke object URLs created during image uploads
  useEffect(() => {
    return () => {
      if (profileImage?.startsWith("blob:")) {
        URL.revokeObjectURL(profileImage);
      }
    };
  }, [profileImage]);

  const hasChanges =
    !!user &&
    (name.trim() !== (user.name ?? "").trim() ||
      handle.trim() !== (user.handle ?? "").trim() ||
      bio.trim() !== (user.bio ?? "").trim() ||
      selectedImage !== null ||
      removeProfileImage);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      toast.error("Profile image must be smaller than 5 MB.");
      return;
    }

    if (profileImage?.startsWith("blob:")) {
      URL.revokeObjectURL(profileImage);
    }

    const previewUrl = URL.createObjectURL(file);
    setSelectedImage(file);
    setProfileImage(previewUrl);
    setRemoveProfileImage(false);

    toast.success("Profile image selected");

    // Reset file input so identical file selection works again
    event.target.value = "";
  };

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

  // const handleSaveChanges = async () => {
  //   if (!user) {
  //     toast.error("User not found.");
  //     return;
  //   }

  //   if (!validateForm()) return;

  //   setSaving(true);

  //   try {
  //     const formData = new FormData();
  //     formData.append("name", name.trim());
  //     formData.append("handle", handle.trim());
  //     formData.append("bio", bio.trim());

  //     if (selectedImage) {
  //       formData.append("profilePic", selectedImage);
  //     }

  //     if (removeProfileImage) {
  //       formData.append("removeProfileImage", "true");
  //     }

  //     const form = {
  //       name: formData.get("name"),
  //       handle: formData.get("handle"),
  //       bio: formData.get("bio"),
  //       verified: name == "" && handle == "" ? false : true,
  //     };

  //     const data = await execute(() => updateProfileData(user.id, form));

  //     if (!data.error) {
  //       setUser({
  //         ...user,
  //         name: name.trim(),
  //         handle: handle.trim(),
  //         bio: bio.trim(),
  //         profile_pic_url: removeProfileImage
  //           ? undefined
  //           : (profileImage ?? user.profile_pic_url),
  //         verified: name == "" && handle == "" ? false : true,
  //       });

  //       toast.success("Profile updated successfully!");
  //       return;
  //     }
  //   } catch (error) {
  //     console.error("Error saving profile changes:", error);
  //     toast.error(
  //       error instanceof Error ? error.message : "Failed to update profile.",
  //     );
  //   } finally {
  //     setSaving(false);
  //   }
  // };

  const handleSaveChanges = async () => {
    if (!user) {
      toast.error("User not found.");
      return;
    }

    if (!validateForm()) return;

    setSaving(true);

    try {
      let profilePicUrl = user.profile_pic_url ?? null;

      /*
       * 1. Upload new profile image if one was selected
       */
      if (selectedImage) {
        toast.loading("Uploading profile image...", {
          id: "profile-upload",
        });

        const uploadData = await getProfileImageUploadUrl(selectedImage.type);

        await uploadFileToS3(uploadData.uploadUrl, selectedImage);

        profilePicUrl = uploadData.fileUrl;

        toast.success("Profile image uploaded", {
          id: "profile-upload",
        });
      }

      /*
       * 2. Remove profile image
       */
      if (removeProfileImage) {
        profilePicUrl = null;
      }

      /*
       * 3. Update profile in your backend
       */
      const form = {
        name: name.trim(),
        handle: handle.trim(),
        bio: bio.trim(),
        profilePicUrl,
        verified: name.trim() !== "" && handle.trim() !== "",
      };

      const data = await execute(() => updateProfileData(user.id, form));

      if (data.error) {
        throw new Error(data.message || "Failed to update profile.");
      }

      /*
       * 4. Update local Zustand state
       */

      setUser({
        ...user,
        name: name.trim(),
        handle: handle.trim(),
        bio: bio.trim(),
        profile_pic_url: profilePicUrl,
        verified: name.trim() !== "" && handle.trim() !== "",
      });

      toast.success("Profile updated successfully!");

      setOpen(false);
    } catch (error) {
      console.error("Error saving profile changes:", error);

      toast.error(
        error instanceof Error ? error.message : "Failed to update profile.",
      );
    } finally {
      toast.dismiss("profile-upload");
      setSaving(false);
    }
  };
  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && hasChanges && !saving) {
      const shouldClose = window.confirm(
        "You have unsaved changes. Are you sure you want to close?",
      );
      if (!shouldClose) return;
    }
    setOpen(nextOpen);
  };

  const initials =
    name
      .trim()
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={(props) =>
          trigger ? (
            <div {...props}>{trigger}</div>
          ) : (
            <Button variant="outline" {...props}>
              Edit profile
            </Button>
          )
        }
      />

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Edit your profile</DialogTitle>
          <DialogDescription>
            Update your profile information and choose how people see you.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-2">
          <ProfileImageSection
            name={name}
            initials={initials}
            profileImage={profileImage}
            removeProfileImage={removeProfileImage}
            fileInputRef={fileInputRef}
            onImageChange={handleImageChange}
            onRemoveImage={handleRemoveImage}
          />

          <ProfileCompletionSection name={name} handle={handle} bio={bio} />

          <Separator />

          <ProfileFormFields
            name={name}
            handle={handle}
            bio={bio}
            maxBioLength={MAX_BIO_LENGTH}
            saving={saving}
            onNameChange={setName}
            onHandleChange={setHandle}
            onBioChange={setBio}
          />

          <EditProfilePreview
            name={name}
            handle={handle}
            bio={bio}
            profileImage={profileImage}
            removeProfileImage={removeProfileImage}
            initials={initials}
          />
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={saving}
            onClick={() => handleOpenChange(false)}
          >
            <X className="mr-1.5 size-4" />
            Cancel
          </Button>

          <Button
            type="button"
            disabled={saving || !hasChanges}
            onClick={handleSaveChanges}
          >
            {saving ? (
              <>
                <Loader2 className="mr-1.5 size-4 animate-spin" />
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
