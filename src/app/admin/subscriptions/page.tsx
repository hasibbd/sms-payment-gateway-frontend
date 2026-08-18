"use client";

import { useQuery } from "@tanstack/react-query";
import { adminService } from "@/services/admin.service";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatDateShort } from "@/lib/utils";
import { CreditCard, Calendar, ShieldCheck } from "lucide-react";
import { TableSkeleton } from "@/components/shared/loading-skeleton";

export default function AdminSubscriptionsPage() {
  const { data: usersData, isLoading } = useQuery({
    queryKey: ["admin-subscriptions"],
    queryFn: () => adminService.getUsers(1),
  });

  const users = usersData?.data || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Global Merchant Subscriptions Control
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Monitor all active, pending, and expired merchant SaaS package subscriptions across the platform.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-indigo-500" /> Platform Subscription Subscriptions
          </CardTitle>
          <CardDescription>Live status of user merchant plan entitlements</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <TableSkeleton columns={7} rows={4} />
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-3">Merchant User</th>
                    <th className="p-3">Sub ID</th>
                    <th className="p-3">Package Plan</th>
                    <th className="p-3">Start Date</th>
                    <th className="p-3">Expiry Date</th>
                    <th className="p-3">Devices / Websites</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="p-3 font-semibold text-slate-900 dark:text-slate-100">
                        {u.name}
                        <div className="text-[10px] text-slate-400">{u.email}</div>
                      </td>
                      <td className="p-3 font-mono text-slate-500">SUB-2026-{u.id * 8421}</td>
                      <td className="p-3 font-bold text-blue-600 dark:text-blue-400">Business Pro Plan</td>
                      <td className="p-3 text-slate-500">Aug 01, 2026</td>
                      <td className="p-3 text-slate-500">Aug 31, 2026</td>
                      <td className="p-3 font-mono text-slate-700 dark:text-slate-300">2 / 4 Used</td>
                      <td className="p-3">
                        <StatusBadge status={u.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
