import { apiFetch } from "../api";

export const likePost = async (postId: string) => {
  try {
    const response = await apiFetch(`/like/${postId}/post`, {
      method: "GET",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to like post");
    }

    return data;
  } catch (error) {
    console.log("Like Post Request Failed -> ", error);
  }
};

export const unlikePost = async (postId: string) => {
  try {
    const response = await apiFetch(`/unlike/${postId}/post`, {
      method: "GET",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to unlike post");
    }

    return data;
  } catch (error) {
    console.log("Unlike Post Request Failed -> ", error);
  }
};
