import { useAuthStore } from "@/lib/stores/auth-store";

const API_URL = "http://localhost:4000";

export const handleLogOut = async () => {
  try {
    await fetch(`${API_URL}/api/auth/logout`, {
      method: "GET",
      credentials: "include",
    });
  } catch (error) {
    console.error("Logout request failed:", error);
  }

  useAuthStore.getState().setUser(null);

  window.location.href = "/";
};
