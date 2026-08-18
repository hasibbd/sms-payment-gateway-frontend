"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/status-badge";
import { StatCard } from "@/components/shared/stat-card";
import { Activity, AlertTriangle, Smartphone, Cpu, Webhook, CheckCircle2, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminMonitoringPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            System Diagnostics & Node Health Monitoring
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time health analyzer for Android SMS Gateway nodes, regex parser failures, and webhook retry queues.
          </p>
        </div>

        <Button variant="outline" size="sm" className="gap-1.5 text-xs">
          <RefreshCcw className="w-3.5 h-3.5" />
          <span>Run Health Check</span>
        </Button>
      </div>

      {/* Diagnostics Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Gateway Nodes"
          value="284 Online"
          change="99.6% Fleet Health"
          changeType="positive"
          icon={<Smartphone className="w-4 h-4" />}
          subtitle="2 Devices Offline"
        />
        <StatCard
          title="Regex Parsing Accuracy"
          value="99.82%"
          change="15 Failure Alerts"
          changeType="neutral"
          icon={<Cpu className="w-4 h-4" />}
          subtitle="bKash, Nagad & Bank Rules"
        />
        <StatCard
          title="Unsupported Provider SMS"
          value="42 Messages"
          change="Logged for AI Training"
          changeType="neutral"
          icon={<AlertTriangle className="w-4 h-4" />}
          subtitle="Unrecognized Senders"
        />
        <StatCard
          title="Webhook Delivery Queue"
          value="3 Pending Retry"
          change="Queue Running"
          changeType="positive"
          icon={<Webhook className="w-4 h-4" />}
          subtitle="Auto-retry active"
        />
      </div>

      {/* Diagnostic Logs Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Parsing Failure Diagnostic Logs */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" /> Recent Regex Parsing Failures
            </CardTitle>
            <CardDescription>SMS messages that failed standard financial extraction</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="p-3 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-950 dark:text-amber-200 space-y-1 font-mono">
              <div className="flex justify-between font-bold">
                <span>Sender: 8801700000000</span>
                <span>18/08/2026 14:10</span>
              </div>
              <p className="text-[11px] text-amber-900 dark:text-amber-300">
                &quot;Recharge Tk 50 and get 1GB data free for 3 days.&quot;
              </p>
              <div className="text-[10px] text-amber-600 dark:text-amber-400 font-sans mt-1">
                Reason: Non-financial message ignored by AI regex rules.
              </div>
            </div>

            <div className="p-3 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-950 dark:text-amber-200 space-y-1 font-mono">
              <div className="flex justify-between font-bold">
                <span>Sender: UNKNOWN_BANK</span>
                <span>18/08/2026 11:22</span>
              </div>
              <p className="text-[11px] text-amber-900 dark:text-amber-300">
                &quot;Your account ending in 4410 has been updated.&quot;
              </p>
              <div className="text-[10px] text-amber-600 dark:text-amber-400 font-sans mt-1">
                Reason: Missing TrxID or amount pattern.
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Node Health Monitor */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-500" /> Android Gateway Node Ping Monitor
            </CardTitle>
            <CardDescription>Physical phone node ping heartbeats</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-slate-100">Store POS Phone #1 (Samsung A54)</h4>
                    <p className="text-[10px] text-slate-400">DEV-ANDROID-98124 • Heartbeat: 12s ago</p>
                  </div>
                </div>
                <StatusBadge status="active" />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-slate-100">Dhaka Warehouse Gateway (Xiaomi)</h4>
                    <p className="text-[10px] text-slate-400">DEV-ANDROID-77219 • Heartbeat: 45s ago</p>
                  </div>
                </div>
                <StatusBadge status="active" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
