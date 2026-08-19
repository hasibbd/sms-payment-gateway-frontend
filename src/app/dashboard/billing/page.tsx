"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { billingService, MOCK_PAYMENTS } from "@/services/billing.service";
import { Invoice } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import { SearchFilter } from "@/components/shared/search-filter";
import { Pagination } from "@/components/shared/pagination";
import { InvoiceDetailModal } from "@/components/dashboard/invoice-detail-modal";
import { formatDateShort, formatCurrency } from "@/lib/utils";
import { Receipt, CreditCard, Eye, Download } from "lucide-react";
import { TableSkeleton } from "@/components/shared/loading-skeleton";

export default function BillingPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [activeTab, setActiveTab] = useState<"invoices" | "payments">("invoices");

  const { data: invoicesData, isLoading } = useQuery({
    queryKey: ["invoices", currentPage],
    queryFn: () => billingService.getInvoices(currentPage),
  });

  const invoices = invoicesData?.data || [];
  const meta = invoicesData?.meta || { current_page: 1, last_page: 1, per_page: 10, total: 0 };

  const filteredInvoices = invoices.filter(
    (inv) =>
      inv.invoice_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.package_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Billing Overview & Invoices
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Track subscription invoices, payment references, and download official receipts.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveTab("invoices")}
            className={`px-4 py-1.5 rounded-lg transition-all ${
              activeTab === "invoices"
                ? "bg-white text-slate-900 shadow-xs dark:bg-slate-900 dark:text-slate-100"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            Invoices Ledger
          </button>
          <button
            onClick={() => setActiveTab("payments")}
            className={`px-4 py-1.5 rounded-lg transition-all ${
              activeTab === "payments"
                ? "bg-white text-slate-900 shadow-xs dark:bg-slate-900 dark:text-slate-100"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            Payment Sessions
          </button>
        </div>
      </div>

      {activeTab === "invoices" ? (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Receipt className="w-5 h-5 text-blue-500" /> Platform Invoices
            </CardTitle>
            <CardDescription>Filter and view official itemized invoices</CardDescription>

            <SearchFilter
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              placeholder="Search by invoice number or package..."
            />
          </CardHeader>

          <CardContent>
            {isLoading ? (
              <TableSkeleton columns={7} rows={4} />
            ) : (
              <>
                <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                      <tr>
                        <th className="p-3">Invoice Number</th>
                        <th className="p-3">Date</th>
                        <th className="p-3">Package</th>
                        <th className="p-3">Amount</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Due Date</th>
                        <th className="p-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {filteredInvoices.map((inv) => (
                        <tr key={inv.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                          <td className="p-3 font-mono font-bold text-blue-600 dark:text-blue-400">
                            {inv.invoice_number}
                          </td>
                          <td className="p-3 text-slate-500">{formatDateShort(inv.created_at)}</td>
                          <td className="p-3 font-medium text-slate-800 dark:text-slate-200">{inv.package_name}</td>
                          <td className="p-3 font-mono font-bold text-slate-900 dark:text-slate-100">
                            {formatCurrency(inv.total)}
                          </td>
                          <td className="p-3">
                            <StatusBadge status={inv.status} />
                          </td>
                          <td className="p-3 text-slate-500">{formatDateShort(inv.due_date)}</td>
                          <td className="p-3 text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedInvoice(inv)}
                              className="h-8 gap-1.5 text-xs"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>View Invoice</span>
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
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-indigo-500" /> Completed Payment Sessions
            </CardTitle>
            <CardDescription>Backend payment gateway transaction receipts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-3">Payment ID</th>
                    <th className="p-3">Invoice Number</th>
                    <th className="p-3">Method</th>
                    <th className="p-3">Transaction Ref</th>
                    <th className="p-3">Paid Date</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {MOCK_PAYMENTS.map((pmt) => (
                    <tr key={pmt.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="p-3 font-mono font-bold text-slate-800 dark:text-slate-200">{pmt.payment_id}</td>
                      <td className="p-3 font-mono text-slate-500">{pmt.invoice_number}</td>
                      <td className="p-3 text-slate-700 dark:text-slate-300 font-medium">{pmt.method}</td>
                      <td className="p-3 font-mono text-slate-600 dark:text-slate-400">{pmt.transaction_ref}</td>
                      <td className="p-3 text-slate-500">{formatDateShort(pmt.paid_at)}</td>
                      <td className="p-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(pmt.amount)}
                      </td>
                      <td className="p-3">
                        <StatusBadge status={pmt.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Invoice Detail Modal */}
      <InvoiceDetailModal
        isOpen={!!selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
        invoice={selectedInvoice}
      />
    </div>
  );
}
