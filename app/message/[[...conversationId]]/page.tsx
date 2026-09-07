import MessagesPage from "../(components)/MessagePage";

export default async function Page({
  params,
}: {
  params: Promise<{
    conversationId?: string[];
  }>;
}) {
  const paramsObject = await params;

  const { conversationId } = paramsObject;

  const id = conversationId?.[0] ?? null;

  return <MessagesPage conversationId={id} />;
}
