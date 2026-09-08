import { apiFetch } from "../api";

export const getProfileData = async (userId: string) => {
  try {
    const response = await apiFetch(`/profile/${userId}`, {
      method: "GET",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch posts");
    }

    return data;
  } catch (error) {
    console.log("Profile Fetch Request Failed -> ", error);
  }
};
