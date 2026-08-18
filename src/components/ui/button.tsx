import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive" | "link";
  size?: "sm" | "md" | "lg" | "icon";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          "inline-flex items-center justify-center font-medium rounded-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none cursor-pointer active:scale-[0.98]",
          // Variants
          variant === "primary" &&
            "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/20 dark:bg-blue-600 dark:hover:bg-blue-500",
          variant === "secondary" &&
            "bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700",
          variant === "outline" &&
            "border border-slate-200 bg-transparent text-slate-800 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-800",
          variant === "ghost" &&
            "bg-transparent text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800",
          variant === "destructive" &&
            "bg-rose-600 hover:bg-rose-700 text-white shadow-sm shadow-rose-500/20 dark:bg-rose-600 dark:hover:bg-rose-500",
          variant === "link" && "text-blue-600 hover:underline underline-offset-4 dark:text-blue-400 p-0 h-auto",
          // Sizes
          size === "sm" && "h-8 px-3 text-xs gap-1.5",
          size === "md" && "h-10 px-4 text-sm gap-2",
          size === "lg" && "h-12 px-6 text-base gap-2.5",
          size === "icon" && "h-9 w-9 p-0",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
