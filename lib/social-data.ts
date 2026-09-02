export type User = {
  name: string;
  handle: string;
  avatar: string;
  bio: string;
  followers: number;
  following: number;
  friends: number;
  posts: number;
  verified?: boolean;
};
export type Post = {
  id: number;
  author: User;
  body: string;
  image?: string;
  likes: number;
  comments: number;
  shares: number;
  time: string;
  liked?: boolean;
  saved?: boolean;
  topic?: string;
};

export const currentUser: User = {
  name: "Maya Chen",
  handle: "mayachen",
  avatar: "https://i.pravatar.cc/150?img=47",
  bio: "Designing calm, useful things for the internet. Coffee, cameras, and curious conversations.",
  followers: 1284,
  following: 438,
  friends: 86,
  posts: 142,
  verified: true,
};
export const users: User[] = [
  {
    name: "Jordan Lee",
    handle: "jordanlee",
    avatar: "https://i.pravatar.cc/150?img=12",
    bio: "Product builder and weekend photographer.",
    followers: 892,
    following: 312,
    friends: 34,
    posts: 42,
  },
  {
    name: "Nora Williams",
    handle: "noraw",
    avatar: "https://i.pravatar.cc/150?img=32",
    bio: "Writer, reader, and recovering perfectionist.",
    followers: 2100,
    following: 184,
    friends: 62,
    posts: 23,
  },
  {
    name: "Sam Rivera",
    handle: "samrivera",
    avatar: "https://i.pravatar.cc/150?img=68",
    bio: "Making tiny tools with big feelings.",
    followers: 654,
    following: 520,
    friends: 28,
    posts: 32,
  },
  {
    name: "Theo Martins",
    handle: "theom",
    avatar: "https://i.pravatar.cc/150?img=53",
    bio: "Film, food, and finding the long way home.",
    followers: 1100,
    following: 290,
    friends: 41,
    posts: 32,
  },
];
export const posts: Post[] = [
  {
    id: 1,
    author: currentUser,
    body: "A quiet reminder: the best ideas usually arrive after you stop trying to force them. Make a little space today.",
    likes: 284,
    comments: 32,
    shares: 8,
    time: "12 min",
    liked: true,
    topic: "Mindful work",
  },
  {
    id: 2,
    author: users[0],
    body: "Spent the morning walking through the city with no destination. Turns out that is still a pretty good way to find one.",
    image:
      "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1200&q=80",
    likes: 184,
    comments: 18,
    shares: 12,
    time: "1 hr",
    topic: "City walks",
  },
  {
    id: 3,
    author: users[1],
    body: "What is a small ritual that makes your day feel more like yours? Mine is reading ten pages before opening any apps.",
    likes: 96,
    comments: 41,
    shares: 4,
    time: "3 hr",
    saved: true,
    topic: "Daily rituals",
  },
];
export const suggestions = users.slice(1, 4);
export const friendRequests = [users[2], users[3]];
export const conversations = [
  {
    user: users[0],
    preview: "That sounds perfect. See you Saturday!",
    time: "2m",
    unread: 2,
  },
  {
    user: users[1],
    preview: "Sending over the notes now.",
    time: "1h",
    unread: 0,
  },
  {
    user: users[2],
    preview: "Have you tried the new photo walk?",
    time: "4h",
    unread: 0,
  },
];
export const navItems = [
  { label: "Home", href: "/app", icon: "home" },
  { label: "Friends", href: "/friends", icon: "users" },
  { label: "Messages", href: "/messages", icon: "message" },
  { label: "Profile", href: "/profile", icon: "user" },
  { label: "Saved", href: "/profile/saved", icon: "bookmark" },
  { label: "Settings", href: "/settings", icon: "settings" },
];
export const formatNumber = (value: number) =>
  value > 999 ? `${(value / 1000).toFixed(1)}k` : value.toString();
export const clonePosts = () =>
  posts.map((post) => ({ ...post, author: { ...post.author } }));
