"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { resetAllStores } from "@/lib/(apiCalls)/auth/auth";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    console.log("Resetting All Stores from Logout Page");
    resetAllStores();

    router.replace("/login");
  }, [router]);

  return null;
}
