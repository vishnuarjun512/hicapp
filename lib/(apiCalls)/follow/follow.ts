import { apiFetch } from "../api";

export const followUser = async (sender_id: string, receiver_id: string) => {
  const url = `/users/${receiver_id}/follow`;
  const res = await apiFetch(url, {
    method: "POST",
    body: JSON.stringify({ sender_id }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to follow user");
  }

  return data;
};

export const unfollowUser = async (followerId: string, followingId: string) => {
  const url = `/users/${followingId}/unfollow`;
  const res = await apiFetch(url, {
    method: "DELETE",
    body: JSON.stringify({ follower_id: followerId }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to unfollow user");
  }

  return data;
};

export const acceptRequest = async (senderID: string, receiverID: string) => {
  const url = `/followrequest/${senderID}/accept`;
  const res = await apiFetch(url, {
    method: "POST",
    body: JSON.stringify({ receiver_id: receiverID }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error("Failed to Reject Request");
  }
  return data;
};

export const rejectRequest = async (senderID: string, receiverID: string) => {
  const url = `/followrequest/${senderID}/reject`;
  const res = await apiFetch(url, {
    method: "POST",
    body: JSON.stringify({ receiver_id: receiverID }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error("Failed to Reject Request");
  }
  return data;
};
