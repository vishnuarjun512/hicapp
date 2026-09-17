import { apiFetch } from "../api";

export const getComments = async (postId: string) => {
  try {
    const response = await apiFetch(`/comment/${postId}`, {
      method: "GET",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to Get Comments");
    }

    return data;
  } catch (error) {
    console.log("Get Comments Request Failed -> ", error);
  }
};

export const createComment = async (postId: string, comment: string) => {
  try {
    const response = await apiFetch(`/comment/${postId}`, {
      method: "POST",
      body: JSON.stringify({ body: comment }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to Create Comment");
    }

    return data;
  } catch (error) {
    console.log("Create Comment Request Failed -> ", error);
  }
};

export const deleteComment = async (commentID: string) => {
  try {
    const response = await apiFetch(`/comment/${commentID}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to Delete Comment");
    }

    return data;
  } catch (error) {
    console.log("Delete Comment Request Failed -> ", error);
  }
};

export const updateComment = async (commentID: string, comment: string) => {
  try {
    const response = await apiFetch(`/comment/${commentID}`, {
      method: "PATCH",
      body: JSON.stringify({
        updatedText: comment,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to Update Comment");
    }

    return data;
  } catch (error) {
    console.log("Update Comment Request Failed -> ", error);
  }
};
