// lib/stores/data-store.ts

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Post } from "../social-data";
import { User } from "./auth-store";

type DataState = {
  posts: Post[];
  suggestions: User[];

  setPosts: (post: Post[]) => void;
  setSuggestions: (suggestions: User[]) => void;
};

export const useDataStore = create<DataState>()(
  persist(
    (set) => ({
      posts: [],
      suggestions: [],

      setPosts: (posts) => set({ posts }),
      setSuggestions: (suggestions) => set({ suggestions }),
    }),

    {
      name: "hike-data",
    },
  ),
);
