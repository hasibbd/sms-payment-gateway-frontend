"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { adminService } from "@/services/admin.service";
import { StatCard } from "@/components/shared/stat-card";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatNumber } from "@/lib/utils";
import {
  Users,
  CreditCard,
  DollarSign,
  Smartphone,
  MessageSquare,
  Zap,
  ShieldCheck,
  PackageCheck,
  Receipt,
  ArrowRight,
  Shield,
  Activity,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { CardSkeleton } from "@/components/shared/loading-skeleton";

export default function AdminDashboardPage() {
  const { data: adminStats, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => adminService.getAdminStats(),
  });

  if (isLoading || !adminStats) {
    return <CardSkeleton />;
  }

  const { overview, charts } = adminStats;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold uppercase text-[10px] px-2 py-0.5 rounded tracking-widest">
              Executive Portal
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mt-1">
            System-Wide Platform Executive Dashboard
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Platform SaaS revenue, active gateway node fleet status, and global SMS processing metrics.
          </p>
        </div>

        <Link href="/admin/packages">
          <Button className="gap-2 text-xs font-semibold">
            <PackageCheck className="w-4 h-4" />
            <span>Manage Package Tiers</span>
          </Button>
        </Link>
      </div>

      {/* Quick Admin Management Hub Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/admin/packages" className="group">
          <Card className="hover:border-blue-500/50 hover:shadow-md transition-all">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                  <PackageCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    Package Plans
                  </h3>
                  <p className="text-[11px] text-slate-500">Resource quotas & pricing</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/users" className="group">
          <Card className="hover:border-indigo-500/50 hover:shadow-md transition-all">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    User Accounts
                  </h3>
                  <p className="text-[11px] text-slate-500">{overview.total_users} Merchants registered</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/invoices" className="group">
          <Card className="hover:border-emerald-500/50 hover:shadow-md transition-all">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    Invoices & Bills
                  </h3>
                  <p className="text-[11px] text-slate-500">{overview.unpaid_invoices} Unpaid invoices</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/subscriptions" className="group">
          <Card className="hover:border-purple-500/50 hover:shadow-md transition-all">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    Subscriptions
                  </h3>
                  <p className="text-[11px] text-slate-500">{overview.active_subscriptions} Active merchant plans</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Financial & User Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total SaaS Revenue"
          value={formatCurrency(overview.total_revenue)}
          change={`+${formatCurrency(overview.monthly_revenue)} this month`}
          changeType="positive"
          icon={<Receipt className="w-4 h-4" />}
          subtitle={`${overview.unpaid_invoices} Unpaid Invoices`}
        />
        <StatCard
          title="Total User Accounts"
          value={overview.total_users}
          change={`${overview.active_users} Active`}
          changeType="positive"
          icon={<Users className="w-4 h-4" />}
          subtitle="Platform Merchants"
        />
        <StatCard
          title="Active Subscriptions"
          value={overview.active_subscriptions}
          change={`${overview.expired_subscriptions} Expired`}
          changeType="neutral"
          icon={<CreditCard className="w-4 h-4" />}
          subtitle="Paid SaaS Tiers"
        />
        <StatCard
          title="Active Android Devices"
          value={overview.active_devices}
          change="Connected Fleet"
          changeType="positive"
          icon={<Smartphone className="w-4 h-4" />}
          subtitle={`${overview.active_websites} Merchant Websites`}
        />
      </div>

      {/* Processing Volume Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Global SMS Processed"
          value={formatNumber(overview.sms_processed)}
          icon={<MessageSquare className="w-4 h-4" />}
          subtitle="Collected by phone nodes"
        />
        <StatCard
          title="Transactions Extracted"
          value={formatNumber(overview.transactions_detected)}
          icon={<Zap className="w-4 h-4" />}
          subtitle="bKash, Nagad, Rocket, Bank"
        />
        <StatCard
          title="Verification API Calls"
          value={formatNumber(overview.verification_requests)}
          icon={<ShieldCheck className="w-4 h-4" />}
          subtitle="Served to merchant stores"
        />
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Over Time */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly SaaS Revenue Growth ($ USD)</CardTitle>
            <CardDescription>Subscription revenue generated over past 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={charts.revenue_trend}>
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      borderColor: "#1e293b",
                      borderRadius: "8px",
                      color: "#fff",
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey="revenue" name="Revenue ($)" fill="#2563eb" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Global SMS Processing Volume */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly System SMS Volume</CardTitle>
            <CardDescription>Daily SMS ingestion across all Android device nodes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={charts.sms_processing}>
                  <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      borderColor: "#1e293b",
                      borderRadius: "8px",
                      color: "#fff",
                      fontSize: "12px",
                    }}
                  />
                  <Line type="monotone" dataKey="volume" name="SMS Ingested" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
