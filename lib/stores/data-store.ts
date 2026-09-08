// lib/stores/data-store.ts

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Post } from "../social-data";
import { User } from "./auth-store";
import { Conversation, Message } from "../types";

type DataState = {
  posts: Post[];
  suggestions: User[];
  followers: User[];
  following: User[];
  followRequests: User[];
  sentFollowRequests: User[];

  setPosts: (post: Post[]) => void;
  setSuggestions: (suggestions: User[]) => void;
  setFollowers: (followers: User[]) => void;
  setFollowing: (following: User[]) => void;
  setFollowRequests: (followRequests: User[]) => void;
  setSentFollowRequests: (sentFollowRequests: User[]) => void;
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

      setPosts: (posts) => set({ posts }),
      setSuggestions: (suggestions) => set({ suggestions }),
      setFollowers: (followers) => set({ followers }),
      setFollowing: (following) => set({ following }),
      setFollowRequests: (followRequests) => set({ followRequests }),
      setSentFollowRequests: (sentFollowRequests) =>
        set({ sentFollowRequests }),

      resetData: () =>
        set({
          posts: [],
          suggestions: [],
          followers: [],
          following: [],
          followRequests: [],
          sentFollowRequests: [],
        }),
    }),

    {
      name: "hike-data",
    },
  ),
);
