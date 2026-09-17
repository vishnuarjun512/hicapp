import { apiFetch } from "../api";

export const createPost = async (payload: object, userId: string) => {
  try {
    const response = await apiFetch(`/post/${userId}`, {
      method: "POST",
      body: JSON.stringify(payload),
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

export const deletePost = async (postID: string) => {
  try {
    const response = await apiFetch(`/post/${postID}`, {
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

export const getPostImageURLS = async (contentType: string) => {
  const response = await apiFetch(`/user/getPostUrls`, {
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

export const getPostImageUploadUrls = async (
  postId: string,
  images: { contentType: string; position: number }[],
) => {
  const response = await apiFetch(`/post/get-image-urls`, {
    method: "POST",
    body: JSON.stringify({
      postId,
      images,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to generate upload URLs");
  }

  return data;
};

export const uploadPostImagesToURLs = async (
  postId: string,
  images: {
    url: string;
    position: number;
  }[],
) => {
  const response = await apiFetch(`/post/upload-image-urls`, {
    method: "POST",
    body: JSON.stringify({
      postId,
      images,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to save post images");
  }

  return data;
};
