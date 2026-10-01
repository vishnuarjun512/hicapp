import { apiFetch } from "../api";

export const searchCall = async (
  searchQuery: string,
  type: "all" | "users" = "all",
) => {
  const params = new URLSearchParams({
    query: searchQuery.trim(),
    type,
  });

  const res = await apiFetch(`/search?${params.toString()}`, {
    method: "GET",
  });

  if (!res.ok) {
    throw new Error("Search failed");
  }

  return res.json();
};
