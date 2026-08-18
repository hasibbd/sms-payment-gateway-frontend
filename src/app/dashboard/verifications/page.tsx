"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { verificationService } from "@/services/verification.service";
import { VerificationLog } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/status-badge";
import { SearchFilter } from "@/components/shared/search-filter";
import { Pagination } from "@/components/shared/pagination";
import { formatDate, formatCurrency } from "@/lib/utils";
import { FileCheck2, Globe, Clock, Shield } from "lucide-react";
import { TableSkeleton } from "@/components/shared/loading-skeleton";

export default function VerificationLogsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({
    result: "all",
  });

  const { data: logsData, isLoading } = useQuery({
    queryKey: ["verification-logs", currentPage, searchQuery, filters],
    queryFn: () =>
      verificationService.getVerificationLogs({
        page: currentPage,
        search: searchQuery,
        result: filters.result,
      }),
  });

  const logs = logsData?.data || [];
  const meta = logsData?.meta || { current_page: 1, last_page: 1, per_page: 10, total: 0 };

  const filterOptions = [
    {
      key: "result",
      label: "Verification Result",
      options: [
        { label: "Verified", value: "verified" },
        { label: "Not Found", value: "not_found" },
        { label: "Amount Mismatch", value: "amount_mismatch" },
        { label: "Already Claimed", value: "already_claimed" },
        { label: "Invalid Request", value: "invalid_request" },
        { label: "Rate Limited", value: "rate_limited" },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          API Verification Audit Logs
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Real-time record of verification API calls initiated by your connected merchant websites.
        </p>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-emerald-500" /> Verification Request Stream
          </CardTitle>
          <CardDescription>Filter by result status code, website domain, or IP address</CardDescription>

          <SearchFilter
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            filters={filterOptions}
            activeFilters={filters}
            onFilterChange={(key, val) => setFilters({ ...filters, [key]: val })}
            onResetFilters={() => {
              setSearchQuery("");
              setFilters({ result: "all" });
            }}
            placeholder="Search TrxID, website name, or reference..."
          />
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <TableSkeleton columns={9} rows={5} />
          ) : (
            <>
              <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="p-3">Timestamp</th>
                      <th className="p-3">Merchant Website</th>
                      <th className="p-3">Transaction ID</th>
                      <th className="p-3">Requested Amount</th>
                      <th className="p-3">Provider</th>
                      <th className="p-3">Reference</th>
                      <th className="p-3">Result</th>
                      <th className="p-3">Response Time</th>
                      <th className="p-3">IP Address</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {logs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="p-3 text-slate-500 whitespace-nowrap">{formatDate(log.date)}</td>
                        <td className="p-3 font-medium text-slate-800 dark:text-slate-200">{log.website_name}</td>
                        <td className="p-3 font-mono font-bold text-blue-600 dark:text-blue-400">{log.transaction_id}</td>
                        <td className="p-3 font-mono font-bold text-slate-900 dark:text-slate-100">
                          {formatCurrency(log.requested_amount)}
                        </td>
                        <td className="p-3 font-bold uppercase text-slate-700 dark:text-slate-300">{log.provider}</td>
                        <td className="p-3 font-mono text-slate-600 dark:text-slate-400">{log.reference || "-"}</td>
                        <td className="p-3">
                          <StatusBadge status={log.result} />
                        </td>
                        <td className="p-3 font-mono text-slate-500 whitespace-nowrap">
                          {log.response_time_ms} ms
                        </td>
                        <td className="p-3 font-mono text-slate-400">{log.request_ip}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <Pagination
                currentPage={meta.current_page}
                lastPage={meta.last_page}
                total={meta.total}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
