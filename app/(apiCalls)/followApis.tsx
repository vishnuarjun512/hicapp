const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const followUser = async (sender_id: string, receiver_id: string) => {
  console.log(sender_id, receiver_id);
  const res = await fetch(`${BASE_URL}/users/${receiver_id}/follow`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ sender_id }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to follow user");
  }

  return data;
};

export const unfollowUser = async (followerId: string, followingId: string) => {
  const res = await fetch(`${BASE_URL}/users/${followingId}/unfollow`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ follower_id: followerId }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to unfollow user");
  }

  return data;
};
