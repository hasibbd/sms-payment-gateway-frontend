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

interface NavGroup {
  category: string;
  items: {
    label: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
  }[];
}

export function MobileSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
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
                <span className="text-sm font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                  PayPulse
                </span>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-1 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-5">
              {navGroups.map((group) => (
                <div key={group.category} className="space-y-1">
                  <h4 className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                    {group.category}
                  </h4>
                  {group.items.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium transition-colors",
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
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
