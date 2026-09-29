"use client";
import { useAuthStore } from "@/lib/stores/auth-store";
import { Sparkles } from "lucide-react";
import Link from "next/link";

export default function Brand() {
  const { user } = useAuthStore();
  return (
    <Link
      href={user ? "/home" : "/"}
      className="flex items-center gap-2 font-semibold tracking-tight"
    >
      <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground">
        <Sparkles className="size-4" />
      </span>
      <span className="text-lg">Hicapp</span>
    </Link>
  );
}
