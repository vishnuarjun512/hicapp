import { apiFetch } from "../api";

export const getFriendsApiCall = async (userId: string) => {
  try {
    const response = await apiFetch(`/friends/${userId}`, {
      method: "GET",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch friends");
    }

    return data;
  } catch (error) {
    console.log("Friends Fetch Request Failed -> ", error);
  }
};
