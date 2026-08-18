import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { formatNumber, cn } from "@/lib/utils";

interface UsageCardProps {
  title: string;
  used: number;
  limit: number;
  icon: React.ReactNode;
  unit?: string;
}

export function UsageCard({ title, used, limit, icon, unit = "" }: UsageCardProps) {
  const percentage = Math.min(100, Math.round((used / Math.max(1, limit)) * 100));
  const isHighUsage = percentage >= 85;

  return (
    <Card className="transition-all hover:shadow-md">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
              {icon}
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {formatNumber(used)} / {formatNumber(limit)} {unit}
              </p>
            </div>
          </div>
          <span
            className={cn(
              "text-xs font-semibold px-2 py-0.5 rounded-md",
              isHighUsage
                ? "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
            )}
          >
            {percentage}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500",
              isHighUsage
                ? "bg-gradient-to-r from-amber-500 to-rose-500"
                : "bg-gradient-to-r from-blue-500 to-indigo-600"
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
