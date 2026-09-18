"use client";

import { useEffect, useRef, useState } from "react";
import {
  AtSign,
  Globe2,
  Hash,
  ImagePlus,
  Lock,
  MapPin,
  Smile,
  Users,
  X,
} from "lucide-react";
import { toast } from "sonner";

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
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import UserAvatar from "@/components/user-avatar";
import { useAuthStore } from "@/lib/stores/auth-store";
import { Post } from "@/lib/social-data";
import { useApi } from "@/lib/(apiCalls)/useApi";
import {
  createPost,
  getPostImageUploadUrls,
  uploadPostImagesToURLs,
} from "@/lib/(apiCalls)/post/post";
import { uploadFileToS3 } from "@/lib/(apiCalls)/s3/uploadFileToS3";

type Visibility = "public" | "friends" | "only-me";

type SelectedImage = {
  id: string;
  file: File;
  preview: string;
};

type CreatePostProps = {
  onCreate?: (post: Post) => void;
};

const MAX_IMAGES = 10;
const MAX_CHARACTERS = 5000;

export default function CreatePost({ onCreate }: CreatePostProps) {
  const user = useAuthStore((state) => state.user);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [open, setOpen] = useState(false);

  const [content, setContent] = useState("");

  const [images, setImages] = useState<SelectedImage[]>([]);

  const [visibility, setVisibility] = useState<Visibility>("public");

  const [location, setLocation] = useState("");

  const [showLocation, setShowLocation] = useState(false);

  const [isDragging, setIsDragging] = useState(false);
  const { execute } = useApi();
  const [loading, setLoading] = useState(false);

  /*
   * --------------------------------------------------
   * IMAGE HANDLING
   * --------------------------------------------------
   */

  const addImages = (files: FileList | File[]) => {
    const selectedFiles = Array.from(files);

    const imageFiles = selectedFiles.filter((file) =>
      file.type.startsWith("image/"),
    );

    if (imageFiles.length === 0) {
      toast.error("Please select image files only.");
      return;
    }

    const remainingSlots = MAX_IMAGES - images.length;

    if (remainingSlots <= 0) {
      toast.error(`You can upload a maximum of ${MAX_IMAGES} images.`);
      return;
    }

    const filesToAdd = imageFiles.slice(0, remainingSlots);

    if (imageFiles.length > remainingSlots) {
      toast.error(`You can upload a maximum of ${MAX_IMAGES} images.`);
    }

    const newImages: SelectedImage[] = filesToAdd.map((file) => ({
      id: crypto.randomUUID(),
      file,
      preview: URL.createObjectURL(file),
    }));

    setImages((currentImages) => [...currentImages, ...newImages]);
  };

  const removeImage = (id: string) => {
    setImages((currentImages) => {
      const imageToRemove = currentImages.find((image) => image.id === id);

      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.preview);
      }

      return currentImages.filter((image) => image.id !== id);
    });
  };

  /*
   * --------------------------------------------------
   * TEXT FEATURES
   * --------------------------------------------------
   */

  const insertText = (text: string) => {
    setContent((currentContent) => {
      return currentContent + text;
    });
  };

  /*
   * --------------------------------------------------
   * DRAG & DROP
   * --------------------------------------------------
   */

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    setIsDragging(false);

    if (event.dataTransfer.files.length > 0) {
      addImages(event.dataTransfer.files);
    }
  };

  /*
   * --------------------------------------------------
   * RESET
   * --------------------------------------------------
   */

  const resetComposer = () => {
    images.forEach((image) => {
      URL.revokeObjectURL(image.preview);
    });

    setContent("");
    setImages([]);
    setVisibility("public");
    setLocation("");
    setShowLocation(false);
  };

  /*
   * --------------------------------------------------
   * CREATE POST
   * --------------------------------------------------
   */

  const handleCreatePost = async () => {
    if (!content.trim() && images.length === 0) {
      toast.error("Write something or add an image.");
      return;
    }

    if (!user) {
      return;
    }
    setLoading(true);
    try {
      // --------------------------------------------------
      // 1. CREATE THE POST
      // --------------------------------------------------

      const payload = {
        body: content,
        visibility,
        location: location.trim() || null,
      };

      const data = await execute(() => createPost(payload, user.id));

      let newPost = data.post;

      // --------------------------------------------------
      // 2. IF THERE ARE IMAGES, GET S3 UPLOAD URLS
      // --------------------------------------------------

      if (images.length > 0) {
        const uploadData = await getPostImageUploadUrls(
          newPost.id,
          images.map((image, index) => ({
            contentType: image.file.type,
            position: index + 1,
          })),
        );

        // --------------------------------------------------
        // 3. UPLOAD FILES DIRECTLY TO S3
        // --------------------------------------------------

        await Promise.all(
          images.map((image, index) => {
            const uploadInfo = uploadData.images[index];

            return uploadFileToS3(uploadInfo.uploadUrl, image.file);
          }),
        );

        // --------------------------------------------------
        // 4. SAVE THE PERMANENT S3 URLS IN DATABASE
        // --------------------------------------------------

        const savedImages = uploadData.images.map((image: any) => ({
          url: image.fileUrl,
          position: image.position,
        }));

        await uploadPostImagesToURLs(newPost.id, savedImages);
        newPost = { ...newPost, images: savedImages };
      }

      // --------------------------------------------------
      // 5. UPDATE FRONTEND
      // --------------------------------------------------

      onCreate?.(newPost);

      toast.success("Post created!");

      resetComposer();
      setOpen(false);
    } catch (error) {
      console.error("Failed to create post:", error);

      toast.error(
        error instanceof Error ? error.message : "Failed to create post",
      );
    } finally {
      setLoading(false);
    }
  }; /*
   * --------------------------------------------------
   * VISIBILITY
   * --------------------------------------------------
   */

  const visibilityOptions = {
    public: {
      label: "Everyone",
      icon: Globe2,
    },

    friends: {
      label: "Friends",
      icon: Users,
    },

    "only-me": {
      label: "Only me",
      icon: Lock,
    },
  };

  const VisibilityIcon = visibilityOptions[visibility].icon;

  const [canPost, setCanPost] = useState(false);

  useEffect(() => {
    if (content.trim().length > 0 || images.length > 0) {
      setCanPost(true);
    } else {
      setCanPost(false);
    }
  }, [content, images]);

  /*
   * --------------------------------------------------
   * UI
   * --------------------------------------------------
   */

  if (!user) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* --------------------------------------------- */}
      {/* CREATE POST CARD                              */}
      {/* --------------------------------------------- */}

      <DialogTrigger
        render={<button type="button" className="w-full text-left" />}
      >
        <Card className="cursor-pointer transition-shadow hover:shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <UserAvatar user={user} size="size-10" />

              <div className="flex-1 rounded-full bg-muted px-4 py-3 text-sm text-muted-foreground">
                What's on your mind?
              </div>

              <div
                className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary"
                aria-hidden="true"
              >
                <ImagePlus className="size-5" />
              </div>
            </div>

            <Separator className="my-4" />

            <div className="flex items-center justify-between text-sm">
              <div className="flex gap-4 text-muted-foreground">
                <span className="flex items-center gap-2">
                  <ImagePlus className="size-4 text-green-600" />
                  Photo
                </span>

                <span className="flex items-center gap-2">
                  <Smile className="size-4 text-yellow-500" />
                  Feeling
                </span>
              </div>

              <span className="text-xs text-muted-foreground">Create post</span>
            </div>
          </CardContent>
        </Card>
      </DialogTrigger>

      {/* --------------------------------------------- */}
      {/* DIALOG                                        */}
      {/* --------------------------------------------- */}

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create a post</DialogTitle>

          <DialogDescription>
            Share something with your friends and followers.
          </DialogDescription>
        </DialogHeader>

        {/* ------------------------------------------- */}
        {/* DIALOG MAIN CONTENT                         */}
        {/* ------------------------------------------- */}
        <div className="w-full overflow-y-auto">
          {/* ------------------------------------------- */}
          {/* USER                                        */}
          {/* ------------------------------------------- */}

          <div className="flex items-center gap-3">
            <UserAvatar user={user} size="size-11" />

            <div>
              <p className="font-medium">{user?.name || "Your name"}</p>

              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-1 h-7 gap-1.5 px-2 text-xs"
                onClick={() => {
                  if (visibility === "public") {
                    setVisibility("friends");
                  } else if (visibility === "friends") {
                    setVisibility("only-me");
                  } else {
                    setVisibility("public");
                  }
                }}
              >
                <VisibilityIcon className="size-3.5" />

                {visibilityOptions[visibility].label}
              </Button>
            </div>
          </div>

          {/* ------------------------------------------- */}
          {/* TEXT AREA                                   */}
          {/* ------------------------------------------- */}

          <div>
            <Textarea
              value={content}
              onChange={(event) => {
                const value = event.target.value;

                if (value.length <= MAX_CHARACTERS) {
                  setContent(value);
                }
              }}
              placeholder="What's on your mind?"
              className="min-h-40 resize-none border-0 px-0 text-base shadow-none focus-visible:ring-0"
              autoFocus
            />

            <div className="flex items-center justify-between">
              {/* Text tools */}

              <div className="flex items-center">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  title="Add hashtag"
                  onClick={() => insertText("#")}
                >
                  <Hash />
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  title="Mention someone"
                  onClick={() => insertText("@")}
                >
                  <AtSign />
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  title="Add emoji"
                  onClick={() => insertText(" 😊")}
                >
                  <Smile />
                </Button>
              </div>

              {/* Character count */}

              <span className="text-xs text-muted-foreground">
                {content.length}/{MAX_CHARACTERS}
              </span>
            </div>
          </div>

          {/* ------------------------------------------- */}
          {/* IMAGE PREVIEWS                              */}
          {/* ------------------------------------------- */}

          {images.length > 0 && (
            <div className="grid grid-cols-5 gap-1.5 mb-1">
              {images.map((image) => (
                <div
                  key={image.id}
                  className="group relative aspect-square overflow-hidden rounded-md bg-muted"
                >
                  <img
                    src={image.preview}
                    alt="Selected image"
                    className="size-full object-cover"
                  />

                  {/* Remove image */}
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    className="absolute right-1 top-1 size-6 rounded-full opacity-0 shadow transition-opacity group-hover:opacity-100"
                    onClick={() => removeImage(image.id)}
                    aria-label="Remove image"
                  >
                    <X className="size-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* ------------------------------------------- */}
          {/* IMAGE DROP AREA                             */}
          {/* ------------------------------------------- */}

          <div
            onDragOver={(event) => {
              event.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => {
              setIsDragging(false);
            }}
            onDrop={handleDrop}
            className={`rounded-xl border border-dashed p-5 text-center transition-colors ${
              isDragging ? "border-primary bg-primary/5" : "border-border"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(event) => {
                if (event.target.files) {
                  addImages(event.target.files);
                }

                event.target.value = "";
              }}
            />

            <ImagePlus className="mx-auto size-7 text-muted-foreground" />

            <p className="mt-2 text-sm font-medium">Add photos</p>

            <p className="mt-1 text-xs text-muted-foreground">
              Drag and drop images or choose them from your device.
            </p>

            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={() => {
                fileInputRef.current?.click();
              }}
            >
              Choose images
            </Button>

            <p className="mt-2 text-xs text-muted-foreground">
              {images.length}/{MAX_IMAGES} images
            </p>
          </div>

          {/* ------------------------------------------- */}
          {/* EXTRA OPTIONS                               */}
          {/* ------------------------------------------- */}

          <div className="overflow-hidden rounded-xl border">
            <div className="px-4 py-3">
              <p className="text-sm font-medium">Add to your post</p>
            </div>

            <Separator />

            <div className="grid grid-cols-2 sm:grid-cols-4">
              <Button
                type="button"
                variant="ghost"
                className="justify-start gap-2 rounded-none"
                onClick={() => {
                  fileInputRef.current?.click();
                }}
              >
                <ImagePlus className="size-4 text-green-600" />
                Photo
              </Button>

              <Button
                type="button"
                variant="ghost"
                className="justify-start gap-2 rounded-none"
                onClick={() => {
                  insertText(" 😊");
                }}
              >
                <Smile className="size-4 text-yellow-500" />
                Feeling
              </Button>

              <Button
                type="button"
                variant="ghost"
                className="justify-start gap-2 rounded-none"
                onClick={() => {
                  setShowLocation((current) => !current);
                }}
              >
                <MapPin className="size-4 text-red-500" />
                Location
              </Button>

              <Button
                type="button"
                variant="ghost"
                className="justify-start gap-2 rounded-none"
                onClick={() => {
                  insertText("@");
                }}
              >
                <AtSign className="size-4 text-blue-500" />
                Tag people
              </Button>
            </div>
          </div>

          {/* ------------------------------------------- */}
          {/* LOCATION                                    */}
          {/* ------------------------------------------- */}

          {showLocation && (
            <div className="flex items-center gap-2">
              <MapPin className="size-4 text-muted-foreground" />

              <input
                type="text"
                value={location}
                onChange={(event) => {
                  setLocation(event.target.value);
                }}
                placeholder="Add a location"
                className="h-9 flex-1 rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          )}

          {/* ------------------------------------------- */}
          {/* HELP TEXT                                   */}
          {/* ------------------------------------------- */}

          <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
            <p>
              Use <strong>#hashtags</strong> to categorize your post and{" "}
              <strong>@mentions</strong> to tag people.
            </p>
          </div>
        </div>

        {/* ------------------------------------------- */}
        {/* FOOTER                                      */}
        {/* ------------------------------------------- */}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              resetComposer();
              setOpen(false);
            }}
          >
            Cancel
          </Button>

          <Button
            type="button"
            disabled={!canPost || loading}
            onClick={handleCreatePost}
          >
            {loading ? "Posting" : "Post"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
