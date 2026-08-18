"use client";

import { Breadcrumbs } from "./breadcrumbs";
import { NotificationsDropdown } from "./notifications-dropdown";
import { ProfileDropdown } from "./profile-dropdown";
import { MobileSidebar } from "./mobile-sidebar";

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/80 px-4 md:px-6 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80 transition-colors">
      <div className="flex items-center gap-3">
        <MobileSidebar />
        <Breadcrumbs />
      </div>

      <div className="flex items-center gap-3">
        <NotificationsDropdown />
        <div className="h-4 w-px bg-slate-200 dark:bg-slate-800" />
        <ProfileDropdown />
      </div>
    </header>
  );
}
