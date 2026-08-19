"use client";

import { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import { Invoice } from "@/types";
import { formatCurrency, formatDateShort } from "@/lib/utils";
import { Shield, Download, CreditCard, ExternalLink, Printer } from "lucide-react";
import { billingService } from "@/services/billing.service";
import { toast } from "@/hooks/use-toast";

interface InvoiceDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice | null;
}

export function InvoiceDetailModal({ isOpen, onClose, invoice }: InvoiceDetailModalProps) {
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  if (!invoice) return null;

  const handlePay = async () => {
    setIsProcessingPayment(true);
    try {
      const session = await billingService.initiatePayment(invoice.id);
      toast({
        title: "Redirecting to Secure Gateway",
        description: `Session ${session.payment_session} generated. Launching backend checkout...`,
        variant: "success",
      });
      setTimeout(() => {
        window.open(session.payment_url, "_blank");
        setIsProcessingPayment(false);
      }, 1000);
    } catch {
      setIsProcessingPayment(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} maxWidth="2xl">
      <div className="space-y-6 p-2 printable-invoice">
        {/* Header Branding */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white font-bold shadow-md">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">PayPulse Inc.</h3>
              <p className="text-xs text-slate-400">SMS Transaction Verification SaaS Platform</p>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <h4 className="text-lg font-mono font-bold text-slate-900 dark:text-slate-100">{invoice.invoice_number}</h4>
            <div className="mt-1">
              <StatusBadge status={invoice.status} />
            </div>
          </div>
        </div>

        {/* Invoice Info Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-xs">
          <div>
            <span className="text-slate-400 font-medium">Issue Date</span>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{formatDateShort(invoice.created_at)}</p>
          </div>

          <div>
            <span className="text-slate-400 font-medium">Due Date</span>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{formatDateShort(invoice.due_date)}</p>
          </div>

          <div>
            <span className="text-slate-400 font-medium">Payment Method</span>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{invoice.payment_method || "Online Payment"}</p>
          </div>

          <div>
            <span className="text-slate-400 font-medium">Payment Ref</span>
            <p className="font-mono font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{invoice.payment_reference || "N/A"}</p>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-3">Item Description</th>
                <th className="p-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {invoice.items.map((item, idx) => (
                <tr key={idx}>
                  <td className="p-3 font-medium text-slate-800 dark:text-slate-200">{item.description}</td>
                  <td className="p-3 text-right font-mono text-slate-800 dark:text-slate-200">
                    {formatCurrency(item.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals Summary */}
        <div className="flex justify-end">
          <div className="w-full sm:w-64 space-y-2 text-xs">
            <div className="flex justify-between text-slate-500">
              <span>Subtotal</span>
              <span className="font-mono">{formatCurrency(invoice.amount)}</span>
            </div>
            {invoice.discount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Discount</span>
                <span className="font-mono">-{formatCurrency(invoice.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-500">
              <span>Estimated Tax (5%)</span>
              <span className="font-mono">{formatCurrency(invoice.tax)}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-slate-900 dark:text-slate-100 pt-2 border-t border-slate-200 dark:border-slate-800">
              <span>Total Amount</span>
              <span className="font-mono text-blue-600 dark:text-blue-400">{formatCurrency(invoice.total)}</span>
            </div>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handlePrint} className="gap-1.5">
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </Button>
          </div>

          {invoice.status === "unpaid" ? (
            <Button onClick={handlePay} disabled={isProcessingPayment} className="gap-2">
              <CreditCard className="w-4 h-4" />
              <span>{isProcessingPayment ? "Connecting..." : "Pay Invoice Now"}</span>
            </Button>
          ) : (
            <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1.5">
              <ExternalLink className="w-3.5 h-3.5" />
              Paid via Backend Checkout Session
            </span>
          )}
        </div>
      </div>
    </Dialog>
  );
}
