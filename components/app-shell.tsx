import { FootBar } from "./foot-bar";
import Navbar from "./navbar";
import RightRail from "./right-rail";
import Sidebar from "./side-bar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto flex max-w-7xl gap-8 px-4 py-8 lg:px-8">
        <Sidebar />
        <main className="min-w-0 flex-1">{children}</main>
        <RightRail />
      </div>
      <FootBar />
    </div>
  );
}
