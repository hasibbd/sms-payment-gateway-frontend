"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { webhookService } from "@/services/webhook.service";
import { websiteService } from "@/services/website.service";
import { WebhookDelivery } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import { SecretReveal } from "@/components/shared/secret-reveal";
import { formatDate } from "@/lib/utils";
import { Webhook, RefreshCw, CheckCircle2, AlertTriangle, Send } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { TableSkeleton } from "@/components/shared/loading-skeleton";

export default function WebhooksPage() {
  const [retryingId, setRetryingId] = useState<number | null>(null);

  const { data: webhookLogs = [], isLoading, refetch } = useQuery({
    queryKey: ["webhook-logs"],
    queryFn: () => webhookService.getWebhookLogs(),
  });

  const handleRetry = async (id: number) => {
    setRetryingId(id);
    try {
      const res = await webhookService.retryWebhook(id);
      toast({
        title: "Webhook Dispatched",
        description: res.message,
        variant: "success",
      });
      refetch();
    } catch {
      toast({
        title: "Retry Failed",
        description: "Failed to deliver webhook payload.",
        variant: "destructive",
      });
    } finally {
      setRetryingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Webhook Endpoints & Delivery Audit
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Monitor push notifications sent to your merchant servers upon payment verification.
        </p>
      </div>

      {/* Webhook Configuration Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Webhook className="w-5 h-5 text-emerald-500" /> Webhook Global Signing Secret
          </CardTitle>
          <CardDescription>Use this HMAC secret to verify X-PayVerify-Signature headers</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <SecretReveal secret="whsec_live_992104810294819" label="Global Webhook Secret" />

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Subscribed Events:</span>
            <span className="bg-blue-500/10 text-blue-600 dark:text-blue-400 font-mono px-2 py-0.5 rounded">transaction.created</span>
            <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono px-2 py-0.5 rounded">transaction.verified</span>
            <span className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-mono px-2 py-0.5 rounded">transaction.claimed</span>
          </div>
        </CardContent>
      </Card>

      {/* Webhook Delivery Logs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Send className="w-5 h-5 text-blue-500" /> Webhook Delivery Logs
          </CardTitle>
          <CardDescription>Recent payload dispatches and HTTP response status codes</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <TableSkeleton columns={7} rows={3} />
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-3">Event Type</th>
                    <th className="p-3">Destination Endpoint</th>
                    <th className="p-3">Delivery Status</th>
                    <th className="p-3">HTTP Code</th>
                    <th className="p-3">Attempts</th>
                    <th className="p-3">Timestamp</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {webhookLogs.map((wh) => (
                    <tr key={wh.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="p-3 font-mono font-bold text-blue-600 dark:text-blue-400">{wh.event_type}</td>
                      <td className="p-3 font-mono text-slate-600 dark:text-slate-400 truncate max-w-xs">{wh.destination_url}</td>
                      <td className="p-3">
                        <StatusBadge status={wh.status} />
                      </td>
                      <td className="p-3 font-mono font-bold">
                        <span className={wh.http_status === 200 ? "text-emerald-500" : "text-rose-500"}>
                          {wh.http_status}
                        </span>
                      </td>
                      <td className="p-3 text-slate-500 font-mono">{wh.attempt_count}</td>
                      <td className="p-3 text-slate-500">{formatDate(wh.timestamp)}</td>
                      <td className="p-3 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRetry(wh.id)}
                          disabled={retryingId === wh.id}
                          className="h-8 gap-1.5 text-xs"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${retryingId === wh.id ? "animate-spin" : ""}`} />
                          <span>{retryingId === wh.id ? "Retrying..." : "Retry Dispatch"}</span>
                        </Button>
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
