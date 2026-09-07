import { apiFetch } from "../api";

export const getProfileData = async (userId: string) => {
  try {
    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/profile/${userId}`;

    const response = await apiFetch(url, {
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
