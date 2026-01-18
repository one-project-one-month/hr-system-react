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

export const toDateOnly = (value: Date | string) => {
  const d = new Date(value);

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`; // YYYY-MM-DD
};


export const formatDate = (date: string | undefined) => {
  if (!date) {
    return "";
  }
  return new Date(date).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

export const isEmailValid = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const toLocalISOString = (date: Date) => {
  const pad = (n: number) => n.toString().padStart(2, "0");

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
    date.getSeconds()
  )}`;
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

export const downloadFile = (
  blob: Blob,
  contentDisposition?: string | null
) => {
  let filename = "download.xlsx";

  if (contentDisposition) {
    const match =
      contentDisposition.match(/filename\*=UTF-8''(.+)/) ||
      contentDisposition.match(/filename="?([^"]+)"?/);

    if (match?.[1]) {
      filename = decodeURIComponent(match[1]);
    }
  }

  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
};

export const formatDateTime = (date?: Date) => {
  if (!date) return "";
  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};


export const dashboardRoutes: Record<string, string> = {
  administrator: "/admin/dashboard",
  admin: "/admin/dashboard",
  "hr specialist": "/hr/dashboard",
  hr: "/hr/dashboard",
  employee: "/employee/dashboard",
};

export const leaveRoutes: Record<string, string> = {
  employee: "/leave/employee",
  admin: "/leave/hr",
  administrator: "/leave/hr",
  hr: "/leave/hr",
  "hr specialist": "/leave/hr",
};

export const payrollRoutes: Record<string, string> = {
  employee: "/payroll",
  admin: "/payrollSummary",
  administrator: "/payrollSummary",
  hr: "/payrollSummary",
  "hr specialist": "/payrollSummary",
  "hr manager": "/payrollSummary",
};


export const getRoute = (
  role: string | undefined,
  routes: Record<string, string>,
  fallback: string
) => {
  return (role && routes[role]) || fallback;
};