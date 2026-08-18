"use client";

import { Dialog } from "@/components/ui/dialog";
import { StatusBadge } from "@/components/shared/status-badge";
import { SmsMessage } from "@/types";
import { formatDate, formatCurrency } from "@/lib/utils";
import { MessageSquare, Smartphone, ShieldCheck, AlertCircle } from "lucide-react";
import { CopySecret } from "@/components/shared/copy-secret";

interface SmsDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  sms: SmsMessage | null;
}

export function SmsDetailModal({ isOpen, onClose, sms }: SmsDetailModalProps) {
  if (!sms) return null;

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="SMS Gateway Payload Analysis" maxWidth="lg">
      <div className="space-y-5 pt-2 text-xs">
        {/* Top Status Header */}
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-400">Sender Address</span>
              <p className="font-bold text-slate-900 dark:text-slate-100">{sms.sender}</p>
            </div>
          </div>

          <div className="text-right">
            <StatusBadge status={sms.parsing_status} />
            <p className="text-[10px] text-slate-400 mt-1">{formatDate(sms.received_at)}</p>
          </div>
        </div>

        {/* Metadata Details */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
          <div>
            <span className="text-slate-400 font-medium">Gateway Device</span>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5 flex items-center gap-1">
              <Smartphone className="w-3.5 h-3.5 text-slate-400" />
              {sms.device_name}
            </p>
          </div>

          <div>
            <span className="text-slate-400 font-medium">Provider Type</span>
            <p className="font-semibold uppercase text-slate-800 dark:text-slate-200 mt-0.5">{sms.provider}</p>
          </div>

          <div>
            <span className="text-slate-400 font-medium">Extracted Amount</span>
            <p className="font-mono font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
              {sms.amount ? formatCurrency(sms.amount) : "N/A"}
            </p>
          </div>
        </div>

        {/* Extracted Transaction ID */}
        {sms.transaction_id && (
          <div className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-950 dark:text-emerald-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Parsed TrxID: <strong className="font-mono">{sms.transaction_id}</strong></span>
            </div>
            <CopySecret value={sms.transaction_id} label="Transaction ID" />
          </div>
        )}

        {/* Error message if any */}
        {sms.error_message && (
          <div className="p-3 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-950 dark:text-rose-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            <span>{sms.error_message}</span>
          </div>
        )}

        {/* Raw SMS Payload */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Raw SMS Payload Text</span>
            <CopySecret value={sms.raw_message || sms.sms_preview} label="SMS Text" />
          </div>
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-900 text-slate-100 font-mono text-xs leading-relaxed select-all">
            {sms.raw_message || sms.sms_preview}
          </div>
        </div>
      </div>
    </Dialog>
  );
}
