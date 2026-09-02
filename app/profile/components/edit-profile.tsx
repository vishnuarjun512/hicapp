import { useEffect, useState } from "react";
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
import { toast } from "sonner";

import { useAuthStore } from "@/lib/stores/auth-store";

export default function EditProfile() {
  const [open, setOpen] = useState(false);
  const { user, setUser } = useAuthStore();

  const [name, setName] = useState("");
  const [handle, setHandle] = useState("");
  const [bio, setBio] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name ?? "");
      setHandle(user.handle ?? "");
      setBio(user.bio ?? "");
    }
  }, [user]);

  const handleSaveChanges = async () => {
    if (!user) {
      toast.error("User not found");
      return;
    }

    try {
      // Update the user state in the auth store
      const url =
        process.env.NEXT_PUBLIC_BASE_URL + "/user/edit-profile/" + user?.id;
      const res = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, handle, bio }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      setUser({ ...user, name, handle, bio });

      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error saving profile changes:", error);
      toast.error("Failed to update profile. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" />}>
        Edit profile
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit your profile</DialogTitle>
          <DialogDescription>
            Make changes to how people see you.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="handle">Username</Label>
            <Input
              id="handle"
              onChange={(e) => setHandle(e.target.value)}
              value={handle}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              onChange={(e) => setBio(e.target.value)}
              value={bio}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSaveChanges}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
