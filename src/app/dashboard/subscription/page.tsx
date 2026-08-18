"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { subscriptionService } from "@/services/subscription.service";
import { billingService } from "@/services/billing.service";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatDate, formatCurrency, calculateRemainingDays } from "@/lib/utils";
import { CreditCard, Calendar, RefreshCcw, ShieldAlert, ArrowUpRight, CheckCircle2, History } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import { ConfirmationDialog } from "@/components/shared/confirmation-dialog";
import { CardSkeleton } from "@/components/shared/loading-skeleton";

export default function SubscriptionPage() {
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);

  const { data: subscription, isLoading } = useQuery({
    queryKey: ["current-subscription"],
    queryFn: () => subscriptionService.getCurrentSubscription(),
  });

  const { data: invoicesData } = useQuery({
    queryKey: ["renewal-history"],
    queryFn: () => billingService.getInvoices(1),
  });

  const handleCancelConfirm = async () => {
    setIsCanceling(true);
    try {
      const res = await subscriptionService.cancelSubscription();
      toast({
        title: "Auto-Renewal Canceled",
        description: res.message,
        variant: "warning",
      });
      setIsCancelModalOpen(false);
    } catch {
      toast({
        title: "Action Failed",
        description: "Failed to cancel subscription.",
        variant: "destructive",
      });
    } finally {
      setIsCanceling(false);
    }
  };

  if (isLoading || !subscription) {
    return <CardSkeleton />;
  }

  const remainingDays = calculateRemainingDays(subscription.expires_at);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Active Subscription & Billing Status
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Manage your current gateway plan, resource quotas, and renewal settings.
        </p>
      </div>

      {/* Main Subscription Info Card */}
      <Card className="border-slate-200 dark:border-slate-800 shadow-md">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-slate-400">{subscription.subscription_id}</span>
              <StatusBadge status={subscription.status} />
            </div>
            <CardTitle className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">
              {subscription.package?.name || "Business Pro Plan"}
            </CardTitle>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link href="/dashboard/billing">
              <Button size="sm" variant="outline" className="gap-1.5 text-xs">
                <RefreshCcw className="w-3.5 h-3.5" />
                <span>Renew Plan</span>
              </Button>
            </Link>
            <Link href="/dashboard/packages">
              <Button size="sm" className="gap-1.5 text-xs">
                <span>Upgrade Plan</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Validity & Dates Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs">
            <div>
              <span className="text-slate-400 font-medium flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-blue-500" /> Start Date
              </span>
              <p className="font-bold text-slate-900 dark:text-slate-100 mt-1">{formatDate(subscription.starts_at)}</p>
            </div>

            <div>
              <span className="text-slate-400 font-medium flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-500" /> Expiration Date
              </span>
              <p className="font-bold text-slate-900 dark:text-slate-100 mt-1">{formatDate(subscription.expires_at)}</p>
            </div>

            <div>
              <span className="text-slate-400 font-medium flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-emerald-500" /> Remaining Validity
              </span>
              <p className="font-bold text-blue-600 dark:text-blue-400 mt-1">{remainingDays} Days Active</p>
            </div>
          </div>

          {/* Plan Limits & Quota Breakdown */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Package Quota Entitlements</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 font-medium">Device Quota</span>
                <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                  {subscription.usage?.devices_used} / {subscription.package?.device_limit} Devices
                </p>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 font-medium">Website Quota</span>
                <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                  {subscription.usage?.websites_used} / {subscription.package?.website_limit} Sites
                </p>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 font-medium">SMS Quota</span>
                <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                  {subscription.usage?.sms_used} / {subscription.package?.sms_limit} SMS
                </p>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 font-medium">API Verifications</span>
                <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                  {subscription.usage?.verifications_used} / {subscription.package?.verification_limit} Calls
                </p>
              </div>
            </div>
          </div>

          {/* Cancellation Control */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="text-xs text-slate-500">
              Need to pause or cancel auto-renewal? You will maintain access until the end of your billing cycle.
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setIsCancelModalOpen(true)}
              className="text-xs"
            >
              Cancel Auto-Renewal
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Renewal History Ledger */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <History className="w-4 h-4 text-blue-500" /> Subscription Renewal History
          </CardTitle>
          <CardDescription>Past billing periods and payment receipts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3">Invoice Ref</th>
                  <th className="p-3">Package</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {invoicesData?.data.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="p-3 font-mono font-semibold text-slate-800 dark:text-slate-200">{inv.invoice_number}</td>
                    <td className="p-3 text-slate-700 dark:text-slate-300">{inv.package_name}</td>
                    <td className="p-3 text-slate-500">{formatDate(inv.created_at)}</td>
                    <td className="p-3 font-mono font-bold text-slate-900 dark:text-slate-100">{formatCurrency(inv.total)}</td>
                    <td className="p-3">
                      <StatusBadge status={inv.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Modal */}
      <ConfirmationDialog
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={handleCancelConfirm}
        title="Cancel Subscription Auto-Renewal?"
        description="Your subscription will remain active until the expiration date. Afterwards, SMS ingestion nodes will pause unless renewed."
        confirmText="Confirm Cancel"
        isLoading={isCanceling}
      />
    </div>
  );
}
