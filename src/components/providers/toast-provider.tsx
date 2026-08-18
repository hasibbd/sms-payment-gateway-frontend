"use client";

import { useEffect, useState } from "react";
import { ToastItem, removeToast } from "@/hooks/use-toast";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    // Polling or listener simulation for toast array updates
    const interval = setInterval(() => {
      const { toasts: currentToasts } = require("@/hooks/use-toast").useToastStore();
      setToasts([...currentToasts]);
    }, 200);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4">
        {toasts.map((item) => (
          <div
            key={item.id}
            className={cn(
              "pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-lg border backdrop-blur-md transition-all duration-300 animate-in slide-in-from-bottom-2",
              item.variant === "success" && "bg-emerald-950/90 text-emerald-100 border-emerald-800 dark:bg-emerald-950/90",
              item.variant === "destructive" && "bg-rose-950/90 text-rose-100 border-rose-800 dark:bg-rose-950/90",
              item.variant === "warning" && "bg-amber-950/90 text-amber-100 border-amber-800 dark:bg-amber-950/90",
              (!item.variant || item.variant === "default") && "bg-slate-900/90 text-slate-100 border-slate-800 dark:bg-slate-900/90"
            )}
          >
            {item.variant === "success" && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />}
            {item.variant === "destructive" && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />}
            {item.variant === "warning" && <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />}
            {(!item.variant || item.variant === "default") && <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />}

            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold">{item.title}</h4>
              {item.description && <p className="text-xs opacity-90 mt-0.5 leading-relaxed">{item.description}</p>}
            </div>

            <button
              onClick={() => removeToast(item.id)}
              className="text-slate-400 hover:text-slate-200 transition-colors p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
