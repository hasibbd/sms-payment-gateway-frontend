"use client";

import { useQuery } from "@tanstack/react-query";
import { billingService } from "@/services/billing.service";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatDateShort, formatCurrency } from "@/lib/utils";
import { Receipt, DollarSign, Download, Eye } from "lucide-react";
import { TableSkeleton } from "@/components/shared/loading-skeleton";

export default function AdminInvoicesPage() {
  const { data: invoicesData, isLoading } = useQuery({
    queryKey: ["admin-invoices"],
    queryFn: () => billingService.getInvoices(1),
  });

  const invoices = invoicesData?.data || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          System Invoice & Financial Transaction Audit
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Inspect platform billing records, verified payments, and unpaid subscription invoices.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Receipt className="w-5 h-5 text-emerald-500" /> Platform Invoices Ledger
          </CardTitle>
          <CardDescription>System-wide billing history and payment references</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <TableSkeleton columns={7} rows={4} />
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-3">Invoice Number</th>
                    <th className="p-3">Package Tier</th>
                    <th className="p-3">Issued Date</th>
                    <th className="p-3">Due Date</th>
                    <th className="p-3">Payment Method</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="p-3 font-mono font-bold text-blue-600 dark:text-blue-400">{inv.invoice_number}</td>
                      <td className="p-3 font-medium text-slate-800 dark:text-slate-200">{inv.package_name}</td>
                      <td className="p-3 text-slate-500">{formatDateShort(inv.created_at)}</td>
                      <td className="p-3 text-slate-500">{formatDateShort(inv.due_date)}</td>
                      <td className="p-3 text-slate-600 dark:text-slate-400">{inv.payment_method || "bKash Gateway"}</td>
                      <td className="p-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(inv.total)}
                      </td>
                      <td className="p-3">
                        <StatusBadge status={inv.status} />
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
