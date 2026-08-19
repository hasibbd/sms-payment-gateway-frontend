"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  ChevronLeft,
  ChevronRight,
  Shield,
  Activity,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/providers/auth-provider";

interface NavGroup {
  category: string;
  items: {
    label: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
  }[];
}

export function AppSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAuth();
  const isAdminPath = pathname.startsWith("/admin");

  const userNavGroups: NavGroup[] = [
    {
      category: "OVERVIEW",
      items: [
        { label: "Dashboard Overview", href: "/dashboard", icon: LayoutDashboard },
      ],
    },
    {
      category: "PLANS & BILLING",
      items: [
        { label: "Subscription & Quotas", href: "/dashboard/subscription", icon: CreditCard },
        { label: "Packages Tiers", href: "/dashboard/packages", icon: PackageCheck },
        { label: "Billing & Invoices", href: "/dashboard/billing", icon: Receipt },
      ],
    },
    {
      category: "GATEWAY & INTEGRATION",
      items: [
        { label: "Android Devices", href: "/dashboard/devices", icon: Smartphone },
        { label: "Connected Websites", href: "/dashboard/websites", icon: Globe },
        { label: "Developer & API Docs", href: "/dashboard/developer", icon: Code2 },
      ],
    },
    {
      category: "LOGS & AUDIT",
      items: [
        { label: "SMS Logs", href: "/dashboard/sms", icon: MessageSquareText },
        { label: "Verification Logs", href: "/dashboard/verifications", icon: FileCheck2 },
        { label: "Transactions Ledger", href: "/dashboard/transactions", icon: ShieldAlert },
        { label: "Webhooks Dispatch", href: "/dashboard/webhooks", icon: Webhook },
      ],
    },
    {
      category: "ACCOUNT",
      items: [
        { label: "Profile & Security", href: "/dashboard/profile", icon: User },
      ],
    },
  ];

  const adminNavGroups: NavGroup[] = [
    {
      category: "OVERVIEW",
      items: [
        { label: "Executive Dashboard", href: "/admin", icon: LayoutDashboard },
      ],
    },
    {
      category: "MANAGEMENT & BILLING",
      items: [
        { label: "Package Plans", href: "/admin/packages", icon: PackageCheck },
        { label: "SMS Parsers & Rules", href: "/admin/parsers", icon: Code2 },
        { label: "User Accounts", href: "/admin/users", icon: Users },
        { label: "Invoices & Revenue", href: "/admin/invoices", icon: Receipt },
        { label: "Subscriptions", href: "/admin/subscriptions", icon: CreditCard },
      ],
    },
    {
      category: "SYSTEM & OPERATIONS",
      items: [
        { label: "System Diagnostics", href: "/admin/monitoring", icon: Activity },
      ],
    },
  ];

  const navGroups = isAdminPath ? adminNavGroups : userNavGroups;

  return (
    <aside
      className={cn(
        "relative flex flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/95 transition-all duration-300 z-30 shrink-0 hidden md:flex",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-slate-100 dark:border-slate-800">
        <Link href={isAdminPath ? "/admin" : "/dashboard"} className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold shadow-md shadow-blue-500/20">
            <Shield className="w-5 h-5" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                PayPulse
              </span>
              <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                {isAdminPath ? "Admin Portal" : "Merchant SaaS"}
              </span>
            </div>
          )}
        </Link>

        {/* Collapse toggle button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        {navGroups.map((group) => (
          <div key={group.category} className="space-y-1">
            {!collapsed && (
              <h4 className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                {group.category}
              </h4>
            )}
            {group.items.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/dashboard" && item.href !== "/admin" && pathname.startsWith(item.href));
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium transition-all group relative",
                    isActive
                      ? "bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 font-semibold shadow-xs"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/80 dark:hover:text-slate-200"
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon
                    className={cn(
                      "w-4 h-4 shrink-0 transition-colors",
                      isActive
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300"
                    )}
                  />
                  {!collapsed && <span>{item.label}</span>}

                  {collapsed && (
                    <div className="absolute left-full ml-2 hidden rounded-md bg-slate-900 px-2 py-1 text-xs text-white group-hover:block whitespace-nowrap z-50 shadow-lg">
                      {item.label}
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer / Role indicator */}
      {!collapsed && user?.role === "admin" && (
        <div className="p-3 m-3 rounded-xl bg-slate-50 border border-slate-200 dark:bg-slate-800/50 dark:border-slate-800 text-center">
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Switch View</p>
          <Link
            href={isAdminPath ? "/dashboard" : "/admin"}
            className="mt-1 block text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
          >
            {isAdminPath ? "← User Dashboard" : "Go to Admin Portal →"}
          </Link>
        </div>
      )}
    </aside>
  );
}
