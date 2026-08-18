import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn, formatNumber } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: number | string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: React.ReactNode;
  subtitle?: string;
  isCurrency?: boolean;
}

export function StatCard({ title, value, change, changeType = "neutral", icon, subtitle }: StatCardProps) {
  return (
    <Card className="relative overflow-hidden transition-all hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {title}
          </span>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
            {icon}
          </div>
        </div>

        <div className="mt-3 flex items-baseline justify-between">
          <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            {typeof value === "number" ? formatNumber(value) : value}
          </div>
          {change && (
            <span
              className={cn(
                "inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full",
                changeType === "positive" && "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
                changeType === "negative" && "bg-rose-500/10 text-rose-600 dark:text-rose-400",
                changeType === "neutral" && "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
              )}
            >
              {change}
            </span>
          )}
        </div>

        {subtitle && <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">{subtitle}</p>}
      </CardContent>
    </Card>
  );
}
