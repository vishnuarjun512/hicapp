// lib/stores/auth-store.ts

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type User = {
  id: string;
  name: string;
  email: string;
  profile_pic_url?: string;
  handle: string;
  verified?: boolean;
  bio: string;
  postsCount: number;
  followersCount: number;
  followingCount: number;
  isPrivate?: boolean;
};

type AuthState = {
  user: User | null;

  setUser: (user: User) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,

      setUser: (user) =>
        set({
          user,
        }),

      logout: () =>
        set({
          user: null,
        }),
    }),
    {
      name: "hike-auth",
    },
  ),
);
