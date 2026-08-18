"use client";

export interface ToastItem {
  id: string;
  title: string;
  description?: string;
  variant?: "default" | "success" | "destructive" | "warning";
}

interface ToastStore {
  toasts: ToastItem[];
  toast: (toast: Omit<ToastItem, "id">) => void;
  removeToast: (id: string) => void;
}

// Simple internal event emitter store without external zustand dependency if not installed
let listeners: Array<(toasts: ToastItem[]) => void> = [];
let toastsList: ToastItem[] = [];

export function toast(options: Omit<ToastItem, "id">) {
  const id = Math.random().toString(36).substring(2, 9);
  const newToast: ToastItem = { id, ...options };
  toastsList = [...toastsList, newToast];
  listeners.forEach((listener) => listener(toastsList));

  setTimeout(() => {
    removeToast(id);
  }, 4000);
}

export function removeToast(id: string) {
  toastsList = toastsList.filter((t) => t.id !== id);
  listeners.forEach((listener) => listener(toastsList));
}

export function useToastStore() {
  return { toasts: toastsList, toast, removeToast };
}
