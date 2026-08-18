"use client";

import { Dialog } from "@/components/ui/dialog";
import { StatusBadge } from "@/components/shared/status-badge";
import { Transaction } from "@/types";
import { formatDate, formatCurrency } from "@/lib/utils";
import { ShieldCheck, MessageSquare, History, UserCheck } from "lucide-react";
import { CopySecret } from "@/components/shared/copy-secret";

interface TransactionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
}

export function TransactionDetailModal({ isOpen, onClose, transaction }: TransactionDetailModalProps) {
  if (!transaction) return null;

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Financial Transaction Detail" maxWidth="lg">
      <div className="space-y-5 pt-2 text-xs">
        {/* Top Header Card */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-md">
          <div>
            <span className="text-[10px] uppercase font-semibold text-slate-400">Transaction ID</span>
            <h3 className="text-lg font-mono font-bold tracking-tight text-white flex items-center gap-2">
              {transaction.transaction_id}
              <CopySecret value={transaction.transaction_id} label="TrxID" />
            </h3>
          </div>

          <div className="text-right">
            <StatusBadge status={transaction.status} />
            <p className="text-base font-mono font-bold text-emerald-400 mt-1">
              {formatCurrency(transaction.amount)}
            </p>
          </div>
        </div>

        {/* Breakdown Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
          <div>
            <span className="text-slate-400 font-medium">Provider</span>
            <p className="font-bold uppercase text-slate-800 dark:text-slate-200 mt-0.5">{transaction.provider}</p>
          </div>

          <div>
            <span className="text-slate-400 font-medium">Transaction Type</span>
            <p className="font-semibold capitalize text-slate-800 dark:text-slate-200 mt-0.5">
              {transaction.type.replace(/_/g, " ")}
            </p>
          </div>

          <div>
            <span className="text-slate-400 font-medium">Customer Phone</span>
            <p className="font-mono font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
              {transaction.customer_phone || "N/A"}
            </p>
          </div>

          <div>
            <span className="text-slate-400 font-medium">Reference Code</span>
            <p className="font-mono font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
              {transaction.reference || "None"}
            </p>
          </div>

          <div>
            <span className="text-slate-400 font-medium">Gateway Device</span>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{transaction.device_name}</p>
          </div>

          <div>
            <span className="text-slate-400 font-medium">Timestamp</span>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
              {formatDate(transaction.transaction_time)}
            </p>
          </div>
        </div>

        {/* Verification History */}
        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
          <h4 className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <History className="w-4 h-4 text-blue-500" />
            Verification History & Claims Audit
          </h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            This transaction record has been requested for API verification <strong className="text-slate-800 dark:text-slate-200">{transaction.verification_count || 0} times</strong> by connected merchant websites.
          </p>
        </div>

        {/* SMS Reference preview */}
        {transaction.raw_sms_preview && (
          <div className="space-y-1.5">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Raw SMS Ingest Source</span>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-[11px] text-slate-700 dark:text-slate-300">
              {transaction.raw_sms_preview}
            </div>
          </div>
        )}
      </div>
    </Dialog>
  );
}
