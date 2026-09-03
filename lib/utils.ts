import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const validateForm = (email: string, password: string) => {
  const newErrors: {
    email?: string;
    password?: string;
  } = {};

  const trimmedEmail = email.trim();

  if (!trimmedEmail) {
    newErrors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
    newErrors.email = "Enter a valid email address";
  }

  if (!password) {
    newErrors.password = "Password is required";
  } else if (password.length < 3) {
    newErrors.password = "Password must be at least 8 characters";
  }

  return newErrors;
};

export function formatPostTime(date: string) {
  const postDate = new Date(date);
  const now = new Date();

  const diff = now.getTime() - postDate.getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) {
    return "just now";
  }

  if (minutes < 60) {
    return `${minutes}m`;
  }

  if (hours < 24) {
    return `${hours}h`;
  }

  if (days < 7) {
    return `${days}d`;
  }

  return postDate.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}
