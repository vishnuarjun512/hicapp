import { apiFetch } from "../api";

export const getProfileData = async (userId: string) => {
  try {
    const response = await apiFetch(`/profile/${userId}`, {
      method: "GET",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch profile Data");
    }

    return data;
  } catch (error) {
    console.log("Profile Fetch Request Failed -> ", error);
  }
};

export const updateProfileData = async (userId: string, form: object) => {
  try {
    const response = await apiFetch(`/user/edit-profile/${userId}`, {
      method: "PUT",
      body: JSON.stringify({ ...form }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to Update Profile");
    }

    return data;
  } catch (error) {
    console.log("Profile Update Request Failed -> ", error);
  }
};

export const getProfileImageUploadUrl = async (contentType: string) => {
  const response = await apiFetch(`/user/profilePic`, {
    method: "POST",
    body: JSON.stringify({
      contentType,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to generate upload URL");
  }

  return data;
};
