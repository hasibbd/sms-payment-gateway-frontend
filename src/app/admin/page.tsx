"use client";

import { useQuery } from "@tanstack/react-query";
import { adminService } from "@/services/admin.service";
import { StatCard } from "@/components/shared/stat-card";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { formatCurrency, formatNumber } from "@/lib/utils";
import {
  Users,
  CreditCard,
  DollarSign,
  Smartphone,
  Globe,
  MessageSquare,
  Zap,
  ShieldCheck,
  Activity,
  AlertTriangle,
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

      {/* Financial & User Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total SaaS Revenue"
          value={formatCurrency(overview.total_revenue)}
          change={`+${formatCurrency(overview.monthly_revenue)} this month`}
          changeType="positive"
          icon={<DollarSign className="w-4 h-4" />}
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
