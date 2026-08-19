import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = "BDT"): string {
  if (currency === "BDT" || currency === "Tk" || currency === "BDT ") {
    return `৳${amount.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })}`;
  }
  return `৳${amount.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

export function formatDate(dateString: string | Date | null | undefined): string {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "N/A";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function formatDateShort(dateString: string | Date | null | undefined): string {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "N/A";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function maskSecret(secret: string, visibleChars = 4): string {
  if (!secret) return "••••••••••••••••";
  if (secret.length <= visibleChars * 2) {
    return "•".repeat(secret.length);
  }
  const prefix = secret.slice(0, visibleChars);
  const suffix = secret.slice(-visibleChars);
  return `${prefix}${"•".repeat(Math.max(8, secret.length - visibleChars * 2))}${suffix}`;
}

export function calculateRemainingDays(expiryDateString: string | null | undefined): number {
  if (!expiryDateString) return 0;
  const expiry = new Date(expiryDateString).getTime();
  const now = new Date().getTime();
  const diffTime = expiry - now;
  return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
}
