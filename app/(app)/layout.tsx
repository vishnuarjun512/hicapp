import { WebSocketProvider } from "@/components/WebSocketProvider";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <WebSocketProvider>{children}</WebSocketProvider>;
}
