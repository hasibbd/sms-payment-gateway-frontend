"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { adminService } from "@/services/admin.service";
import { User } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import { SearchFilter } from "@/components/shared/search-filter";
import { Pagination } from "@/components/shared/pagination";
import { formatDateShort } from "@/lib/utils";
import { Users, Power, Calendar, Shield, Eye, Smartphone, Globe } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { TableSkeleton } from "@/components/shared/loading-skeleton";
import { ConfirmationDialog } from "@/components/shared/confirmation-dialog";
import { Dialog } from "@/components/ui/dialog";

export default function AdminUsersPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [suspendUserId, setSuspendUserId] = useState<number | null>(null);
  const [extendUserId, setExtendUserId] = useState<number | null>(null);
  const [extendDays, setExtendDays] = useState(30);

  const { data: usersData, isLoading, refetch } = useQuery({
    queryKey: ["admin-users", currentPage, searchQuery],
    queryFn: () => adminService.getUsers(currentPage, searchQuery),
  });

  const users = usersData?.data || [];
  const meta = usersData?.meta || { current_page: 1, last_page: 1, per_page: 10, total: 0 };

  const handleToggleStatus = async () => {
    if (!suspendUserId) return;
    try {
      const res = await adminService.toggleUserStatus(suspendUserId);
      toast({
        title: "User Status Updated",
        description: res.message,
        variant: "warning",
      });
      refetch();
      setSuspendUserId(null);
    } catch {
      toast({
        title: "Action Failed",
        description: "Could not update user status.",
        variant: "destructive",
      });
    }
  };

  const handleExtendConfirm = async () => {
    if (!extendUserId) return;
    try {
      const res = await adminService.extendSubscription(extendUserId, extendDays);
      toast({
        title: "Subscription Extended",
        description: res.message,
        variant: "success",
      });
      refetch();
      setExtendUserId(null);
    } catch {
      toast({
        title: "Action Failed",
        description: "Could not extend subscription.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Platform User & Merchant Accounts
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Manage registered SaaS merchants, inspect active gateway nodes, and extend validity.
        </p>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-500" /> Platform Merchant Directory
          </CardTitle>
          <CardDescription>Search by name, email, or company</CardDescription>

          <SearchFilter
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            placeholder="Search merchant name or email..."
          />
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <TableSkeleton columns={9} rows={5} />
          ) : (
            <>
              <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="p-3">ID</th>
                      <th className="p-3">User</th>
                      <th className="p-3">Email</th>
                      <th className="p-3">Role</th>
                      <th className="p-3">Current Plan</th>
                      <th className="p-3">Devices</th>
                      <th className="p-3">Joined Date</th>
                      <th className="p-3">Account Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="p-3 font-mono font-bold text-slate-400">#{u.id}</td>
                        <td className="p-3">
                          <div className="font-semibold text-slate-900 dark:text-slate-100">{u.name}</div>
                          <div className="text-[10px] text-slate-400">{u.company || "Individual Merchant"}</div>
                        </td>
                        <td className="p-3 text-slate-600 dark:text-slate-300 font-mono">{u.email}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${u.role === "admin" ? "bg-indigo-500/10 text-indigo-500" : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"}`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="p-3 font-medium text-blue-600 dark:text-blue-400">Business Pro</td>
                        <td className="p-3 font-mono font-semibold">2 Devices</td>
                        <td className="p-3 text-slate-500">{formatDateShort(u.created_at)}</td>
                        <td className="p-3">
                          <StatusBadge status={u.status} />
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setExtendUserId(u.id)}
                              className="h-8 text-xs gap-1"
                              title="Extend Validity"
                            >
                              <Calendar className="w-3.5 h-3.5 text-blue-500" />
                              <span>Extend</span>
                            </Button>
                            <Button
                              variant={u.status === "active" ? "destructive" : "outline"}
                              size="sm"
                              onClick={() => setSuspendUserId(u.id)}
                              className="h-8 px-2"
                              title={u.status === "active" ? "Suspend Account" : "Activate Account"}
                            >
                              <Power className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <Pagination
                currentPage={meta.current_page}
                lastPage={meta.last_page}
                total={meta.total}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </>
          )}
        </CardContent>
      </Card>

      {/* Suspend Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={!!suspendUserId}
        onClose={() => setSuspendUserId(null)}
        onConfirm={handleToggleStatus}
        title="Toggle User Account Status?"
        description="Changing user status will immediately affect their ability to log in and make verification calls."
        confirmText="Confirm Change"
      />

      {/* Extend Validity Modal */}
      <Dialog
        isOpen={!!extendUserId}
        onClose={() => setExtendUserId(null)}
        title="Extend Subscription Validity"
        description="Manually grant additional validity days to this merchant account."
        maxWidth="sm"
      >
        <div className="space-y-4 pt-2 text-xs">
          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300">Days to Extend</label>
            <select
              value={extendDays}
              onChange={(e) => setExtendDays(parseInt(e.target.value))}
              className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 mt-1"
            >
              <option value={7}>7 Days (1 Week Extension)</option>
              <option value={15}>15 Days</option>
              <option value={30}>30 Days (1 Month Extension)</option>
              <option value={90}>90 Days (Quarterly Extension)</option>
              <option value={365}>365 Days (1 Year Extension)</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setExtendUserId(null)}>
              Cancel
            </Button>
            <Button onClick={handleExtendConfirm}>Apply Extension</Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
