"use client";
import { toast } from "sonner";

export const apiFetch = async (url: string, options: any = {}) => {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const response = await fetch(`${BASE_URL}${url}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (response.status !== 401) {
    return response;
  }

  toast.error("Session Expired");

  // Access token expired.
  // Try to refresh it.
  const refreshResponse = await fetch(`${BASE_URL}/auth/refresh`, {
    method: "POST",
    credentials: "include",
  });

  if (!refreshResponse.ok) {
    // Refresh token is also invalid/expired.
    console.log("Refresh Token also expired");
    throw new Error("SESSION_EXPIRED");
  }

  toast.success("Session Restored with refresh token!");

  // New access token was created.
  // Try the original request again.
  return await fetch(`${BASE_URL}${url}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
};
