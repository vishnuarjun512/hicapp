import { User } from "./stores/auth-store";

export const currentUser: User = {
  id: "current-user-id",
  email: "maya.chen@example.com",
  name: "Maya Chen",
  handle: "mayachen",
  profile_pic_url: "https://i.pravatar.cc/150?img=12",
  bio: "Designing calm, useful things for the internet. Coffee, cameras, and curious conversations.",
  followersCount: 1284,
  followingCount: 438,
  postsCount: 142,
  verified: true,
};

export const users: User[] = [
  {
    id: "sjdkfad",
    email: "jordan.lee@example.com",
    name: "Jordan Lee",
    handle: "jordanlee",
    profile_pic_url: "https://i.pravatar.cc/150?img=47",
    bio: "Product builder and weekend photographer.",
    followersCount: 892,
    followingCount: 312,
    postsCount: 42,
    verified: true,
  },
  {
    id: "kldjfsa",
    email: "nora.williams@example.com",
    name: "Nora Williams",
    handle: "noraw",
    profile_pic_url: "https://i.pravatar.cc/150?img=32",
    bio: "Writer, reader, and recovering perfectionist.",
    followersCount: 2100,
    followingCount: 184,
    postsCount: 23,
    verified: true,
  },
  {
    id: "asdkfja",
    email: "sam.rivera@example.com",
    name: "Sam Rivera",
    handle: "samrivera",
    profile_pic_url: "https://i.pravatar.cc/150?img=68",
    bio: "Making tiny tools with big feelings.",
    followersCount: 654,
    followingCount: 520,
    postsCount: 32,
    verified: true,
  },
  {
    id: "asdkfja",
    email: "theo.martins@example.com",
    name: "Theo Martins",
    handle: "theom",
    profile_pic_url: "https://i.pravatar.cc/150?img=53",
    bio: "Film, food, and finding the long way home.",
    followersCount: 1100,
    followingCount: 290,
    postsCount: 32,
    verified: true,
  },
];

type PostImage = {
  id: string;
  url: string;
  position: number;
};

export type Post = {
  id: string;
  author: User;
  body: string;
  images: PostImage[];
  likes: number;
  comments: number;
  shares?: number;
  liked?: boolean;
  saved?: boolean;
  created_at: string;
  visibility: "public" | "private" | "only-me";
  location?: string | null;
};

export const suggestions = users.slice(1, 4);
export const friendRequests = [users[2], users[3]];

export const conversations = [
  {
    id: "conversation-1",
    user: users[1],
    preview: "Hey, are you free tomorrow?",
    unread: 2,
    isOnline: true,
  },
  {
    id: "conversation-2",
    user: users[2],
    preview: "That sounds good!",
    unread: 0,
    isOnline: false,
  },
];

export type Comment = {
  id: string;
  author: User;
  comment: string;
  time: string;
  created_at: string;
  updated_at: string;
};

export const navItems = [
  { label: "Home", href: "/home", icon: "home" },
  { label: "Friends", href: "/friends", icon: "users" },
  { label: "Messages", href: "/message", icon: "message" },
  { label: "Profile", href: "/profile", icon: "user" },
  { label: "Saved", href: "/profile/saved", icon: "bookmark" },
  { label: "Settings", href: "/settings", icon: "settings" },
];

export const formatNumber = (value: number) =>
  value > 999 ? `${(value / 1000).toFixed(1)}k` : value.toString();
