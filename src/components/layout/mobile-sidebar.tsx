"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Shield } from "lucide-react";
import {
  LayoutDashboard,
  Smartphone,
  Globe,
  Code2,
  MessageSquareText,
  Receipt,
  FileCheck2,
  Webhook,
  User,
  ShieldAlert,
  PackageCheck,
  CreditCard,
  Users,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function MobileSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const isAdminPath = pathname.startsWith("/admin");

  const userNavItems = [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: "Packages", href: "/dashboard/packages", icon: PackageCheck },
    { label: "Subscription", href: "/dashboard/subscription", icon: CreditCard },
    { label: "Billing & Invoices", href: "/dashboard/billing", icon: Receipt },
    { label: "Android Devices", href: "/dashboard/devices", icon: Smartphone },
    { label: "Connected Websites", href: "/dashboard/websites", icon: Globe },
    { label: "Developer & API Docs", href: "/dashboard/developer", icon: Code2 },
    { label: "SMS Logs", href: "/dashboard/sms", icon: MessageSquareText },
    { label: "Transactions", href: "/dashboard/transactions", icon: ShieldAlert },
    { label: "Verification Logs", href: "/dashboard/verifications", icon: FileCheck2 },
    { label: "Webhooks", href: "/dashboard/webhooks", icon: Webhook },
    { label: "Profile & Security", href: "/dashboard/profile", icon: User },
  ];

  const adminNavItems = [
    { label: "Executive Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Package Plans", href: "/admin/packages", icon: PackageCheck },
    { label: "User Accounts", href: "/admin/users", icon: Users },
    { label: "Subscriptions", href: "/admin/subscriptions", icon: CreditCard },
    { label: "Invoices & Revenue", href: "/admin/invoices", icon: Receipt },
    { label: "System Diagnostics", href: "/admin/monitoring", icon: Activity },
  ];

  const navItems = isAdminPath ? adminNavItems : userNavItems;

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(true)}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 dark:border-slate-800 dark:text-slate-300"
      >
        <Menu className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs" onClick={() => setIsOpen(false)} />

          <div className="relative w-4/5 max-w-xs flex-1 bg-white dark:bg-slate-900 p-4 flex flex-col z-10">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-bold">
                  <Shield className="w-4 h-4" />
                </div>
                <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">PayVerify</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-1 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-medium transition-colors",
                      isActive
                        ? "bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 font-semibold"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                    )}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
