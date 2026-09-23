import { useAuthStore } from "@/lib/stores/auth-store";
import { useDataStore } from "@/lib/stores/data-store";
import { useMessageStore } from "@/lib/stores/message-store";

export const resetAllStores = async () => {
  useAuthStore.getState().logout();
  useDataStore.getState().resetData();
  useMessageStore.getState().resetMessages();

  useAuthStore.persist?.clearStorage?.();
  useDataStore.persist?.clearStorage?.();
  useMessageStore.persist?.clearStorage?.();

  window.location.href = "/";
};

export const handleLogOut = async () => {
  try {
    await fetch(`/api/logout`, {
      method: "GET",
      credentials: "include",
    });
    await resetAllStores();
  } catch (error) {
    console.error("Logout request failed:", error);
  }
};
