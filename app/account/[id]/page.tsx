import ProfilePage from "@/app/profile/components/profile-page";
import { users } from "@/lib/social-data";
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = users.find((item) => item.handle === id) ?? users[0];
  return <ProfilePage user={user} own={false} />;
}
