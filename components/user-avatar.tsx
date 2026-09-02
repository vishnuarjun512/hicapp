import { User } from "@/lib/stores/auth-store";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export default function UserAvatar({
  user,
  size = "size-9",
}: {
  user: User;
  size?: string;
}) {
  return (
    <Avatar className={size}>
      <AvatarImage src={user.profilePic} alt={`${user.name} avatar`} />
      <AvatarFallback>
        {user.name
          .split(" ")
          .map((part) => part[0])
          .join("")}
      </AvatarFallback>
    </Avatar>
  );
}
