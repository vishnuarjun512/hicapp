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

  conversations: Conversation[];
  messages: Message[];

  setPosts: (post: Post[]) => void;
  setSuggestions: (suggestions: User[]) => void;
  setFollowers: (followers: User[]) => void;
  setFollowing: (following: User[]) => void;
  setFollowRequests: (followRequests: User[]) => void;
  setSentFollowRequests: (sentFollowRequests: User[]) => void;
  setConversations: (conversations: Conversation[]) => void;
  setMessages: (messages: Message[]) => void;
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
      conversations: [],
      messages: [],

      setPosts: (posts) => set({ posts }),
      setSuggestions: (suggestions) => set({ suggestions }),
      setFollowers: (followers) => set({ followers }),
      setFollowing: (following) => set({ following }),
      setFollowRequests: (followRequests) => set({ followRequests }),
      setSentFollowRequests: (sentFollowRequests) =>
        set({ sentFollowRequests }),
      setConversations: (conversations) => set({ conversations }),

      setMessages: (messages) => set({ messages }),
    }),

    {
      name: "hike-data",
    },
  ),
);
