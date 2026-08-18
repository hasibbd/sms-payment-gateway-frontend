"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { dashboardService } from "@/services/dashboard.service";
import { StatCard } from "@/components/shared/stat-card";
import { UsageCard } from "@/components/shared/usage-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CardSkeleton } from "@/components/shared/loading-skeleton";
import { formatDateShort } from "@/lib/utils";
import {
  MessageSquare,
  ShieldCheck,
  Smartphone,
  Globe,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Webhook,
  ArrowUpRight,
  RefreshCcw,
  Sparkles,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const PROVIDER_COLORS = ["#2563eb", "#f59e0b", "#8b5cf6", "#10b981"];

export default function UserDashboardPage() {
  const { data: statsData, isLoading, refetch } = useQuery({
    queryKey: ["user-dashboard-stats"],
    queryFn: () => dashboardService.getDashboardStats(),
  });

  if (isLoading || !statsData) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    );
  }

  const { subscription, usage, stats, charts } = statsData;

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Platform Dashboard Overview
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time Android SMS Gateway Ingestion & Merchant API Verification Metrics
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()} className="gap-1.5 text-xs">
            <RefreshCcw className="w-3.5 h-3.5" />
            <span>Refresh Stats</span>
          </Button>
          <Link href="/dashboard/developer">
            <Button size="sm" className="gap-1.5 text-xs">
              <Zap className="w-3.5 h-3.5" />
              <span>API Integration</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Subscription Info Banner Card */}
      <Card className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-800 text-white shadow-xl border-slate-800 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-blue-400 uppercase tracking-widest flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Active SaaS Subscription
                </span>
                <StatusBadge status={subscription.status} />
              </div>
              <h2 className="text-2xl font-extrabold tracking-tight text-white">{subscription.package_name}</h2>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
                <span>Start: <strong>{formatDateShort(subscription.starts_at)}</strong></span>
                <span>•</span>
                <span>Expires: <strong>{formatDateShort(subscription.expires_at)}</strong></span>
                <span>•</span>
                <span className="bg-blue-500/20 text-blue-300 font-semibold px-2 py-0.5 rounded-full border border-blue-500/30">
                  {subscription.remaining_days} Days Remaining
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link href="/dashboard/billing">
                <Button variant="outline" size="sm" className="border-slate-700 text-white hover:bg-slate-800">
                  Renew Subscription
                </Button>
              </Link>
              <Link href="/dashboard/packages">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-500 text-white gap-1.5 shadow-md shadow-blue-600/30">
                  <span>Upgrade Package</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <UsageCard
          title="Android Gateway Nodes"
          used={usage.devices_used}
          limit={usage.device_limit}
          icon={<Smartphone className="w-4 h-4" />}
          unit="Devices"
        />
        <UsageCard
          title="Connected Websites"
          used={usage.websites_used}
          limit={usage.website_limit}
          icon={<Globe className="w-4 h-4" />}
          unit="Websites"
        />
        <UsageCard
          title="SMS Ingestion"
          used={usage.sms_used}
          limit={usage.sms_limit}
          icon={<MessageSquare className="w-4 h-4" />}
          unit="SMS"
        />
        <UsageCard
          title="Verification API Requests"
          used={usage.verifications_used}
          limit={usage.verification_limit}
          icon={<ShieldCheck className="w-4 h-4" />}
          unit="Requests"
        />
      </div>

      {/* Real-time Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="SMS Received Today"
          value={stats.sms_today}
          change="+18% vs yesterday"
          changeType="positive"
          icon={<MessageSquare className="w-4 h-4" />}
          subtitle={`Total this month: ${stats.sms_month}`}
        />
        <StatCard
          title="Transactions Detected"
          value={stats.transactions_detected}
          change="98.2% Parsed"
          changeType="positive"
          icon={<Zap className="w-4 h-4" />}
          subtitle={`${stats.successful_parsing} Success / ${stats.parsing_failures} Failures`}
        />
        <StatCard
          title="Verification Requests"
          value={stats.verification_requests}
          change="98.7% Success"
          changeType="positive"
          icon={<CheckCircle2 className="w-4 h-4" />}
          subtitle={`${stats.verification_success} Verified`}
        />
        <StatCard
          title="Webhook Deliveries"
          value={stats.webhook_success}
          change={`${stats.webhook_failure} Failures`}
          changeType={stats.webhook_failure > 0 ? "negative" : "positive"}
          icon={<Webhook className="w-4 h-4" />}
          subtitle="Real-time Merchant Push"
        />
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Ingestion & Verification Volume (Area Chart) */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Daily Processing Volume (Last 7 Days)</CardTitle>
            <CardDescription>Visualizing SMS collected vs API verification calls</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={charts.daily_volume}>
                  <defs>
                    <linearGradient id="colorSms" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorVerif" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
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
                  <Area type="monotone" dataKey="sms" name="SMS Ingested" stroke="#2563eb" fillOpacity={1} fill="url(#colorSms)" strokeWidth={2} />
                  <Area type="monotone" dataKey="verifications" name="Verifications" stroke="#10b981" fillOpacity={1} fill="url(#colorVerif)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Provider Distribution Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>MFS Provider Breakdown</CardTitle>
            <CardDescription>Parsed SMS volume by provider</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-56 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={charts.provider_distribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {charts.provider_distribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PROVIDER_COLORS[index % PROVIDER_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      borderColor: "#1e293b",
                      borderRadius: "8px",
                      color: "#fff",
                      fontSize: "12px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
              {charts.provider_distribution.map((item, idx) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PROVIDER_COLORS[idx % PROVIDER_COLORS.length] }} />
                  <span className="text-slate-600 dark:text-slate-400">{item.name}</span>
                  <span className="font-semibold ml-auto">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
