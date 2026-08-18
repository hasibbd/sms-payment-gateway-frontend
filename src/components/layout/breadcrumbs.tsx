"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

export function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) return null;

  const isAdmin = segments[0] === "admin";
  const basePath = isAdmin ? "/admin" : "/dashboard";

  return (
    <nav className="flex items-center text-xs text-slate-500 dark:text-slate-400 font-medium">
      <Link
        href={basePath}
        className="flex items-center gap-1 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
      >
        <Home className="w-3.5 h-3.5" />
        <span>{isAdmin ? "Admin" : "Dashboard"}</span>
      </Link>

      {segments.slice(1).map((segment, index) => {
        const url = `/${segments.slice(0, index + 2).join("/")}`;
        const isLast = index === segments.slice(1).length - 1;
        const formatted = segment.replace(/-/g, " ");

        return (
          <div key={url} className="flex items-center">
            <ChevronRight className="w-3.5 h-3.5 mx-1 text-slate-400 dark:text-slate-600" />
            {isLast ? (
              <span className="font-semibold text-slate-900 dark:text-slate-100 capitalize">
                {formatted}
              </span>
            ) : (
              <Link
                href={url}
                className="hover:text-slate-900 dark:hover:text-slate-100 capitalize transition-colors"
              >
                {formatted}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
