// lib/stores/data-store.ts

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Post } from "../social-data";
import { User } from "./auth-store";
import { Notification } from "../types";

type DataState = {
  posts: Post[];
  suggestions: User[];
  followers: User[];
  following: User[];
  followRequests: User[];
  sentFollowRequests: User[];
  notifications: Notification[];

  setPosts: (post: Post[]) => void;
  setSuggestions: (suggestions: User[]) => void;
  setFollowers: (followers: User[]) => void;
  setFollowing: (following: User[]) => void;
  setFollowRequests: (followRequests: User[]) => void;
  setSentFollowRequests: (sentFollowRequests: User[]) => void;
  setNotifications: (notifications: Notification[]) => void;
  resetData: () => void;
};

export const useDataStore = create<DataState>()(
  persist(
    (set) => ({
      posts: [],
      suggestions: [],
      followers: [],
      following: [],
      followRequests: [],
      sentFollowRequests: [],
      notifications: [],

      setPosts: (posts) => set({ posts }),
      setSuggestions: (suggestions) => set({ suggestions }),
      setFollowers: (followers) => set({ followers }),
      setFollowing: (following) => set({ following }),
      setFollowRequests: (followRequests) => set({ followRequests }),
      setSentFollowRequests: (sentFollowRequests) =>
        set({ sentFollowRequests }),
      setNotifications: (notifications) => set({ notifications }),

      resetData: () =>
        set({
          posts: [],
          suggestions: [],
          followers: [],
          following: [],
          followRequests: [],
          sentFollowRequests: [],
          notifications: [],
        }),
    }),

    {
      name: "hike-data",
    },
  ),
);
