import ProfilePage from "@/app/(app)/profile/components/profile-page";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <ProfilePage userID={id} />;
}
