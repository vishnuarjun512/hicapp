import ProfilePage from "@/app/(app)/profile/components/profile-page";
import UserNotFound from "./UserNotFound";

async function getUserById(id: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/user/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    return data.data ?? null;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return null;
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const user = await getUserById(id);

  if (!user) {
    return <UserNotFound />;
  }

  return <ProfilePage user={user} />;
}
