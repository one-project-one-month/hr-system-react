import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { useAuthStore } from "@/stores/useAuthStore";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const dateFormatter = (date: string): string => {
  const dt = new Date(date);
  return isNaN(dt.getTime())
    ? ""
    : dt.toISOString().split(".")[0].replace("T", " ");
};

export const formatDate = (date: Date | undefined) => {
  if (!date) {
    return "";
  }
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

export const isEmailValid = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const capitalizeCamelCase = (text: string): string => {
  const words = text.replace(/([A-Z])/g, " $1").split(" ");
  // Capitalize each word
  const capitalized = words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return capitalized;
};

export function handleUnauthorized() {
  const logout = useAuthStore.getState().logout;
  logout();
}
