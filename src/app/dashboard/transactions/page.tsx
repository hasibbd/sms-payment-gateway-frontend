"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { transactionService } from "@/services/transaction.service";
import { Transaction } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import { SearchFilter } from "@/components/shared/search-filter";
import { Pagination } from "@/components/shared/pagination";
import { TransactionDetailModal } from "@/components/dashboard/transaction-detail-modal";
import { formatDate, formatCurrency } from "@/lib/utils";
import { ShieldCheck, Eye, Smartphone, Zap } from "lucide-react";
import { TableSkeleton } from "@/components/shared/loading-skeleton";

export default function TransactionsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [filters, setFilters] = useState<Record<string, string>>({
    provider: "all",
    status: "all",
  });

  const { data: txData, isLoading } = useQuery({
    queryKey: ["transactions-ledger", currentPage, searchQuery, filters],
    queryFn: () =>
      transactionService.getTransactions({
        page: currentPage,
        search: searchQuery,
        provider: filters.provider,
        status: filters.status,
      }),
  });

  const transactions = txData?.data || [];
  const meta = txData?.meta || { current_page: 1, last_page: 1, per_page: 10, total: 0 };

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
      key: "status",
      label: "Status",
      options: [
        { label: "Verified", value: "verified" },
        { label: "Unverified", value: "unverified" },
        { label: "Claimed", value: "claimed" },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Parsed Financial Transaction Ledger
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Structured ledger of extracted payments, cash-ins, and references ready for API verification.
        </p>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500" /> Transaction Ledger
          </CardTitle>
          <CardDescription>Search by TrxID, customer phone, or order reference code</CardDescription>

          <SearchFilter
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            filters={filterOptions}
            activeFilters={filters}
            onFilterChange={(key, val) => setFilters({ ...filters, [key]: val })}
            onResetFilters={() => {
              setSearchQuery("");
              setFilters({ provider: "all", status: "all" });
            }}
            placeholder="Search TrxID, phone (017...), or reference..."
          />
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <TableSkeleton columns={10} rows={5} />
          ) : (
            <>
              <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="p-3">Transaction ID</th>
                      <th className="p-3">Provider</th>
                      <th className="p-3">Type</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Customer Phone</th>
                      <th className="p-3">Reference</th>
                      <th className="p-3">Gateway Device</th>
                      <th className="p-3">Time</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="p-3 font-mono font-bold text-blue-600 dark:text-blue-400">{tx.transaction_id}</td>
                        <td className="p-3 font-bold uppercase text-slate-700 dark:text-slate-300">{tx.provider}</td>
                        <td className="p-3 capitalize text-slate-600 dark:text-slate-400">{tx.type.replace(/_/g, " ")}</td>
                        <td className="p-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                          {formatCurrency(tx.amount)}
                        </td>
                        <td className="p-3 font-mono text-slate-600 dark:text-slate-400">{tx.customer_phone || "-"}</td>
                        <td className="p-3 font-mono text-slate-800 dark:text-slate-200 font-medium">{tx.reference || "-"}</td>
                        <td className="p-3 text-slate-500">{tx.device_name}</td>
                        <td className="p-3 text-slate-500 whitespace-nowrap">{formatDate(tx.transaction_time)}</td>
                        <td className="p-3">
                          <StatusBadge status={tx.status} />
                        </td>
                        <td className="p-3 text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedTx(tx)}
                            className="h-8 gap-1 text-xs"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Details</span>
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

      {/* Transaction Detail Modal */}
      <TransactionDetailModal
        isOpen={!!selectedTx}
        onClose={() => setSelectedTx(null)}
        transaction={selectedTx}
      />
    </div>
  );
}
