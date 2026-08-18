"use client";

import { useState } from "react";
import { Bell, CheckCircle2, AlertTriangle, ShieldCheck, X } from "lucide-react";

const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    title: "bKash SMS Gateway Synced",
    description: "Store POS Phone #1 received TrxID 9B71A02931 (Tk 1,250.00)",
    time: "5m ago",
    type: "success",
  },
  {
    id: 2,
    title: "Webhook Delivery Warning",
    description: "Mobile App Checkout API returned HTTP 504 on retry attempt.",
    time: "1h ago",
    type: "warning",
  },
  {
    id: 3,
    title: "Subscription Renewal Complete",
    description: "Business Pro Plan renewed for 30 days.",
    time: "1d ago",
    type: "info",
  },
];

export function NotificationsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100 transition-colors"
      >
        <Bell className="w-4 h-4" />
        {notifications.length > 0 && (
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 z-50 w-80 sm:w-96 rounded-xl border border-slate-200 bg-white p-4 shadow-xl dark:border-slate-800 dark:bg-slate-900 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">System Notifications</h4>
              <button
                onClick={() => setNotifications([])}
                className="text-[11px] font-medium text-blue-600 hover:underline dark:text-blue-400"
              >
                Clear all
              </button>
            </div>

            <div className="py-2 space-y-2 max-h-72 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-400">No unread notifications</div>
              ) : (
                notifications.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                  >
                    {item.type === "success" && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />}
                    {item.type === "warning" && <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />}
                    {item.type === "info" && <ShieldCheck className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{item.title}</p>
                        <span className="text-[10px] text-slate-400">{item.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
