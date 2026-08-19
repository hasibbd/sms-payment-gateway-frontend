"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { deviceService } from "@/services/device.service";
import { AndroidDevice } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import { DeviceAddModal } from "@/components/dashboard/device-add-modal";
import { ConfirmationDialog } from "@/components/shared/confirmation-dialog";
import { formatDate } from "@/lib/utils";
import { Smartphone, Plus, RefreshCw, Power, Trash2, Key, ShieldCheck, QrCode } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { TableSkeleton } from "@/components/shared/loading-skeleton";
import { EmptyState } from "@/components/shared/empty-state";

export default function DevicesPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [revokeDeviceId, setRevokeDeviceId] = useState<number | null>(null);
  const [isRevoking, setIsRevoking] = useState(false);

  const { data: devices = [], isLoading, refetch } = useQuery({
    queryKey: ["android-devices"],
    queryFn: () => deviceService.getDevices(),
  });

  const handleRevokeConfirm = async () => {
    if (!revokeDeviceId) return;
    setIsRevoking(true);
    try {
      const res = await deviceService.revokeDevice(revokeDeviceId);
      toast({
        title: "Device Credential Revoked",
        description: res.message,
        variant: "warning",
      });
      refetch();
      setRevokeDeviceId(null);
    } catch {
      toast({
        title: "Revoke Failed",
        description: "Failed to revoke device access.",
        variant: "destructive",
      });
    } finally {
      setIsRevoking(false);
    }
  };

  const handleToggleStatus = async (device: AndroidDevice) => {
    const isCurrentlyDisabled = device.status === "disabled";
    try {
      const res = await deviceService.toggleStatus(device.id, !isCurrentlyDisabled);
      toast({
        title: "Device Updated",
        description: res.message,
        variant: "success",
      });
      refetch();
    } catch {
      toast({
        title: "Status Update Failed",
        description: "Could not update device status.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Registered Android Phone Gateway Nodes
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Physical mobile devices running the PayPulse Android App that collect and ingest bank/MFS SMS notifications.
          </p>
        </div>

        <Button onClick={() => setIsAddModalOpen(true)} className="gap-2 text-xs font-semibold">
          <Plus className="w-4 h-4" />
          <span>Add Android Gateway</span>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-blue-500" /> Active Mobile Phone Nodes
          </CardTitle>
          <CardDescription>Real-time gateway connectivity and last seen status</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <TableSkeleton columns={9} rows={3} />
          ) : devices.length === 0 ? (
            <EmptyState
              title="No Android Gateway Phones Connected"
              description="Register your first Android phone to start automatically forwarding incoming transaction SMS messages to the backend."
              icon={<Smartphone className="w-8 h-8" />}
              actionText="Add Device Now"
              onAction={() => setIsAddModalOpen(true)}
            />
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-3">Device Name</th>
                    <th className="p-3">Device ID</th>
                    <th className="p-3">Model</th>
                    <th className="p-3">Android & App</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Last Seen</th>
                    <th className="p-3">SMS Ingested</th>
                    <th className="p-3">Created Date</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {devices.map((device) => (
                    <tr key={device.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="p-3 font-semibold text-slate-900 dark:text-slate-100">
                        {device.device_name}
                      </td>
                      <td className="p-3 font-mono font-bold text-blue-600 dark:text-blue-400">{device.device_id}</td>
                      <td className="p-3 text-slate-700 dark:text-slate-300">{device.model}</td>
                      <td className="p-3 text-slate-500">
                        <div>{device.android_version}</div>
                        <div className="text-[10px] font-mono text-slate-400">{device.app_version}</div>
                      </td>
                      <td className="p-3">
                        <StatusBadge status={device.status} />
                      </td>
                      <td className="p-3 text-slate-500">{formatDate(device.last_seen_at)}</td>
                      <td className="p-3 font-mono font-bold text-slate-800 dark:text-slate-200">
                        {device.sms_count} SMS
                      </td>
                      <td className="p-3 text-slate-500">{formatDate(device.created_at)}</td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleStatus(device)}
                            className="h-8 px-2"
                            title={device.status === "disabled" ? "Enable Device" : "Disable Device"}
                          >
                            <Power className={`w-3.5 h-3.5 ${device.status === "disabled" ? "text-emerald-500" : "text-amber-500"}`} />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setRevokeDeviceId(device.id)}
                            className="h-8 px-2"
                            title="Revoke Credential"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <DeviceAddModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => refetch()}
      />

      <ConfirmationDialog
        isOpen={!!revokeDeviceId}
        onClose={() => setRevokeDeviceId(null)}
        onConfirm={handleRevokeConfirm}
        title="Revoke Android Gateway Access?"
        description="Revoking this device credential will immediately stop incoming SMS ingestion from this physical phone."
        confirmText="Revoke Access"
        isLoading={isRevoking}
      />
    </div>
  );
}
