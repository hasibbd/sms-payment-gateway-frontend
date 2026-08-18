"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { smsService } from "@/services/sms.service";
import { SmsMessage } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import { SearchFilter } from "@/components/shared/search-filter";
import { Pagination } from "@/components/shared/pagination";
import { SmsDetailModal } from "@/components/dashboard/sms-detail-modal";
import { formatDate, formatCurrency } from "@/lib/utils";
import { MessageSquareText, Eye, Smartphone, Filter } from "lucide-react";
import { TableSkeleton } from "@/components/shared/loading-skeleton";

export default function SmsLogsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSms, setSelectedSms] = useState<SmsMessage | null>(null);
  const [filters, setFilters] = useState<Record<string, string>>({
    provider: "all",
    parsing_status: "all",
  });

  const { data: smsData, isLoading } = useQuery({
    queryKey: ["sms-logs", currentPage, searchQuery, filters],
    queryFn: () =>
      smsService.getSmsLogs({
        page: currentPage,
        search: searchQuery,
        provider: filters.provider,
        parsing_status: filters.parsing_status,
      }),
  });

  const logs = smsData?.data || [];
  const meta = smsData?.meta || { current_page: 1, last_page: 1, per_page: 10, total: 0 };

  const filterOptions = [
    {
      key: "provider",
      label: "Provider",
      options: [
        { label: "bKash", value: "bkash" },
        { label: "Nagad", value: "nagad" },
        { label: "Rocket", value: "rocket" },
        { label: "CityBank", value: "citybank" },
      ],
    },
    {
      key: "parsing_status",
      label: "Status",
      options: [
        { label: "Success", value: "success" },
        { label: "Failed", value: "failed" },
        { label: "Ignored", value: "ignored" },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Raw SMS Ingestion Logs
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Audit incoming financial SMS messages captured by your registered Android Gateway devices.
        </p>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <MessageSquareText className="w-5 h-5 text-blue-500" /> Ingested SMS Ledger
          </CardTitle>
          <CardDescription>Filter by provider, parsing status, or sender phone</CardDescription>

          <SearchFilter
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            filters={filterOptions}
            activeFilters={filters}
            onFilterChange={(key, val) => setFilters({ ...filters, [key]: val })}
            onResetFilters={() => {
              setSearchQuery("");
              setFilters({ provider: "all", parsing_status: "all" });
            }}
            placeholder="Search by sender, SMS text, or TrxID..."
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
                      <th className="p-3">Received At</th>
                      <th className="p-3">Sender</th>
                      <th className="p-3">Gateway Device</th>
                      <th className="p-3">Provider</th>
                      <th className="p-3">SMS Preview</th>
                      <th className="p-3">Parsing Status</th>
                      <th className="p-3">Transaction ID</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {logs.map((sms) => (
                      <tr key={sms.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="p-3 text-slate-500 whitespace-nowrap">{formatDate(sms.received_at)}</td>
                        <td className="p-3 font-bold text-slate-900 dark:text-slate-100">{sms.sender}</td>
                        <td className="p-3 text-slate-600 dark:text-slate-300">
                          <span className="flex items-center gap-1">
                            <Smartphone className="w-3 h-3 text-slate-400" />
                            {sms.device_name}
                          </span>
                        </td>
                        <td className="p-3 font-semibold uppercase text-slate-700 dark:text-slate-300">{sms.provider}</td>
                        <td className="p-3 text-slate-600 dark:text-slate-400 max-w-xs truncate">{sms.sms_preview}</td>
                        <td className="p-3">
                          <StatusBadge status={sms.parsing_status} />
                        </td>
                        <td className="p-3 font-mono font-bold text-blue-600 dark:text-blue-400">
                          {sms.transaction_id || "-"}
                        </td>
                        <td className="p-3 font-mono font-bold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                          {sms.amount ? formatCurrency(sms.amount) : "-"}
                        </td>
                        <td className="p-3 text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedSms(sms)}
                            className="h-8 gap-1 text-xs"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View</span>
                          </Button>
                        </td>
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

      {/* SMS Payload Detail Modal */}
      <SmsDetailModal
        isOpen={!!selectedSms}
        onClose={() => setSelectedSms(null)}
        sms={selectedSms}
      />
    </div>
  );
}
