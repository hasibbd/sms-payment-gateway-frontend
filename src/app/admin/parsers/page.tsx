"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { adminService } from "@/services/admin.service";
import { SmsParserConfig } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/shared/status-badge";
import { Code2, Plus, Edit, Power, Play, CheckCircle2, AlertCircle, Smartphone, Calendar, CreditCard, Tag } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { TableSkeleton } from "@/components/shared/loading-skeleton";

export default function AdminParsersPage() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [editingParser, setEditingParser] = useState<SmsParserConfig | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { data: parsers = [], isLoading: loadingParsers, refetch } = useQuery({
    queryKey: ["admin-parsers"],
    queryFn: () => adminService.getParsers(),
  });

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    provider: "bkash",
    sender_pattern: "",
    trx_id_regex: "/TrxID\\s+([A-Z0-9]+)/i",
    amount_regex: "/Tk\\s+([0-9,]+(\\.[0-9]{2})?)/i",
    phone_regex: "/from\\s+(01[0-9]{9})/i",
    date_time_regex: "/at\\s+([0-9\\/: ]+)/i",
    type_regex: "/(received|payment|cash in)/i",
    allowed_package_ids: ["starter", "growth", "enterprise"],
    priority: 1,
  });

  // Multi-field Test Playground State
  const [testForm, setTestForm] = useState({
    sender: "bKash",
    message: "You have received Tk 1,500.00 from 01711223344. Fee Tk 0.00. Balance Tk 12,500.00. TrxID 9B8A7C6D at 19/08/2026 01:15.",
    trx_id_regex: "/TrxID\\s+([A-Z0-9]+)/i",
    amount_regex: "/Tk\\s+([0-9,]+(\\.[0-9]{2})?)/i",
    phone_regex: "/from\\s+(01[0-9]{9})/i",
    date_time_regex: "/at\\s+([0-9\\/: ]+)/i",
    type_regex: "/(received|payment|cash in)/i",
  });

  const [testResult, setTestResult] = useState<{
    sender: string;
    message: string;
    extracted_trx_id: string | null;
    extracted_amount: number | null;
    extracted_phone: string | null;
    extracted_date_time: string | null;
    extracted_type: string | null;
    is_valid_match: boolean;
  } | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  const handleOpenCreate = () => {
    setEditingParser(null);
    setFormData({
      name: "",
      code: "",
      provider: "bkash",
      sender_pattern: "",
      trx_id_regex: "/TrxID\\s+([A-Z0-9]+)/i",
      amount_regex: "/Tk\\s+([0-9,]+(\\.[0-9]{2})?)/i",
      phone_regex: "/from\\s+(01[0-9]{9})/i",
      date_time_regex: "/at\\s+([0-9\\/: ]+)/i",
      type_regex: "/(received|payment|cash in)/i",
      allowed_package_ids: ["starter", "growth", "enterprise"],
      priority: parsers.length + 1,
    });
    setIsEditModalOpen(true);
  };

  const handleOpenEdit = (p: SmsParserConfig) => {
    setEditingParser(p);
    setFormData({
      name: p.name,
      code: p.code,
      provider: p.provider,
      sender_pattern: p.sender_pattern,
      trx_id_regex: p.trx_id_regex,
      amount_regex: p.amount_regex,
      phone_regex: p.phone_regex || "/from\\s+(01[0-9]{9})/i",
      date_time_regex: p.date_time_regex || "/at\\s+([0-9\\/: ]+)/i",
      type_regex: p.type_regex || "/(received|payment|cash in)/i",
      allowed_package_ids: p.allowed_package_ids || ["starter", "growth", "enterprise"],
      priority: p.priority,
    });
    setIsEditModalOpen(true);
  };

  const handleOpenTest = (p?: SmsParserConfig) => {
    if (p) {
      setTestForm({
        sender: p.sender_pattern,
        message:
          p.code === "bkash"
            ? "You have received Tk 1,500.00 from 01711223344. Fee Tk 0.00. Balance Tk 12,500.00. TrxID 9B8A7C6D at 19/08/2026 01:15."
            : p.code === "nagad"
            ? "Merchant Pay: Amount: Tk 2,500.00; TxnID: NAGAD88331; from 01811223344 at 19/08/2026 01:20."
            : "Received Tk 500.00 from 01800000000. TxnId: 88291230 at 19/08/2026 01:25.",
        trx_id_regex: p.trx_id_regex,
        amount_regex: p.amount_regex,
        phone_regex: p.phone_regex || "/from\\s+(01[0-9]{9})/i",
        date_time_regex: p.date_time_regex || "/at\\s+([0-9\\/: ]+)/i",
        type_regex: p.type_regex || "/(received|payment|cash in)/i",
      });
    }
    setTestResult(null);
    setIsTestModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await adminService.saveParser({
        id: editingParser?.id,
        ...formData,
      });
      toast({
        title: "Parser Saved",
        description: res.message,
        variant: "success",
      });
      refetch();
      setIsEditModalOpen(false);
    } catch {
      toast({
        title: "Save Failed",
        description: "Failed to save parser format.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStatus = async (id: string | number) => {
    try {
      const res = await adminService.toggleParserStatus(id);
      toast({
        title: "Status Updated",
        description: res.message,
        variant: "warning",
      });
      refetch();
    } catch {
      toast({
        title: "Action Failed",
        description: "Could not update status.",
        variant: "destructive",
      });
    }
  };

  const handleRunTest = async () => {
    setIsTesting(true);
    try {
      const res = await adminService.testParser(testForm);
      setTestResult(res.data);
    } catch {
      toast({
        title: "Test Failed",
        description: "Error running regex test.",
        variant: "destructive",
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handlePackageToggle = (pkgSlug: string) => {
    const current = formData.allowed_package_ids || [];
    if (current.includes(pkgSlug)) {
      setFormData({
        ...formData,
        allowed_package_ids: current.filter((s) => s !== pkgSlug),
      });
    } else {
      setFormData({
        ...formData,
        allowed_package_ids: [...current, pkgSlug],
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Multi-Field SMS Parser & Regex Engine
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Configure regex extraction rules for Mobile Phone, Amount, TrxID, Date/Time, and Type.
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleOpenTest()} className="gap-1.5 text-xs">
            <Play className="w-3.5 h-3.5 text-emerald-500" />
            <span>5-Field Test Playground</span>
          </Button>
          <Button onClick={handleOpenCreate} className="gap-2 text-xs font-semibold">
            <Plus className="w-4 h-4" />
            <span>Add New Parser Format</span>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Code2 className="w-5 h-5 text-blue-500" /> Configured SMS Regex Rules
          </CardTitle>
          <CardDescription>
            Multi-attribute extraction patterns (TrxID, Amount, Mobile Phone, Date/Time, Type)
          </CardDescription>
        </CardHeader>

        <CardContent>
          {loadingParsers ? (
            <TableSkeleton columns={9} rows={4} />
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-3 whitespace-nowrap">Parser Name</th>
                    <th className="p-3 whitespace-nowrap">Provider</th>
                    <th className="p-3 whitespace-nowrap">Sender Match</th>
                    <th className="p-3 whitespace-nowrap">TrxID Regex</th>
                    <th className="p-3 whitespace-nowrap">Amount Regex</th>
                    <th className="p-3 whitespace-nowrap">Mobile Phone Regex</th>
                    <th className="p-3 whitespace-nowrap">Type Regex</th>
                    <th className="p-3 whitespace-nowrap">Package Access</th>
                    <th className="p-3 whitespace-nowrap">Status</th>
                    <th className="p-3 text-right whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {parsers.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="p-3 font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap">{p.name}</td>
                      <td className="p-3 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 font-mono text-[10px] uppercase font-bold">
                          {p.code}
                        </span>
                      </td>
                      <td className="p-3 font-mono text-slate-600 dark:text-slate-300 whitespace-nowrap">{p.sender_pattern}</td>
                      <td className="p-3 font-mono text-[10px] text-slate-500 max-w-[120px] truncate" title={p.trx_id_regex}>
                        {p.trx_id_regex}
                      </td>
                      <td className="p-3 font-mono text-[10px] text-slate-500 max-w-[120px] truncate" title={p.amount_regex}>
                        {p.amount_regex}
                      </td>
                      <td className="p-3 font-mono text-[10px] text-slate-500 max-w-[120px] truncate" title={p.phone_regex || "Default"}>
                        {p.phone_regex || "/from\\s+(01[0-9]{9})/i"}
                      </td>
                      <td className="p-3 font-mono text-[10px] text-slate-500 max-w-[120px] truncate" title={p.type_regex || "Default"}>
                        {p.type_regex || "/(received|payment)/i"}
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1">
                          {(p.allowed_package_ids || ["starter", "growth", "enterprise"]).map((pkgSlug) => (
                            <span
                              key={pkgSlug}
                              className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                            >
                              {pkgSlug}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        <StatusBadge status={p.is_active ? "active" : "disabled"} />
                      </td>
                      <td className="p-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenTest(p)}
                            className="h-8 px-2 text-xs"
                            title="Test 5-Field Regex"
                          >
                            <Play className="w-3.5 h-3.5 text-emerald-500" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenEdit(p)}
                            className="h-8 gap-1 text-xs"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            <span>Edit Format</span>
                          </Button>
                          <Button
                            variant={p.is_active ? "destructive" : "outline"}
                            size="sm"
                            onClick={() => handleToggleStatus(p.id)}
                            className="h-8 px-2"
                            title={p.is_active ? "Deactivate Parser" : "Activate Parser"}
                          >
                            <Power className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit / Create Multi-Field Parser Modal */}
      <Dialog
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={editingParser ? `Edit Format: ${editingParser.name}` : "Add New Provider Parser"}
        description="Specify regex matching rules for TrxID, Amount, Mobile Phone, Date/Time, and Type."
        maxWidth="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4 pt-2 text-xs">
          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300">Parser Display Name</label>
            <Input
              type="text"
              placeholder="e.g. bKash Merchant Parser"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300">Provider Code</label>
              <Input
                type="text"
                placeholder="e.g. bkash"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toLowerCase() })}
                disabled={!!editingParser}
                className="mt-1 font-mono"
                required
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300">Sender Match Pattern</label>
              <Input
                type="text"
                placeholder="e.g. bKash, Nagad, 16216"
                value={formData.sender_pattern}
                onChange={(e) => setFormData({ ...formData, sender_pattern: e.target.value })}
                className="mt-1 font-mono"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300">Transaction ID Regex (TrxID)</label>
              <Input
                type="text"
                placeholder="/TrxID\s+([A-Z0-9]+)/i"
                value={formData.trx_id_regex}
                onChange={(e) => setFormData({ ...formData, trx_id_regex: e.target.value })}
                className="mt-1 font-mono text-xs"
                required
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300">Amount Regex (Tk / BDT)</label>
              <Input
                type="text"
                placeholder="/Tk\s+([0-9,]+(\.[0-9]{2})?)/i"
                value={formData.amount_regex}
                onChange={(e) => setFormData({ ...formData, amount_regex: e.target.value })}
                className="mt-1 font-mono text-xs"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300">Mobile Phone Regex</label>
              <Input
                type="text"
                placeholder="/from\s+(01[0-9]{9})/i"
                value={formData.phone_regex}
                onChange={(e) => setFormData({ ...formData, phone_regex: e.target.value })}
                className="mt-1 font-mono text-xs"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300">Date & Time Regex</label>
              <Input
                type="text"
                placeholder="/at\s+([0-9\/: ]+)/i"
                value={formData.date_time_regex}
                onChange={(e) => setFormData({ ...formData, date_time_regex: e.target.value })}
                className="mt-1 font-mono text-xs"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300">Transaction Type Regex</label>
            <Input
              type="text"
              placeholder="/(received|payment|cash in)/i"
              value={formData.type_regex}
              onChange={(e) => setFormData({ ...formData, type_regex: e.target.value })}
              className="mt-1 font-mono text-xs"
            />
            <span className="text-[10px] text-slate-400 mt-0.5 block">
              Extracts operation type (e.g. Received, Payment, Cash In, Send Money)
            </span>
          </div>

          {/* Package Tier Association Checkboxes */}
          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
              Allowed Package Tiers
            </label>
            <div className="flex flex-wrap gap-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
              {["starter", "growth", "enterprise"].map((slug) => {
                const isChecked = (formData.allowed_package_ids || []).includes(slug);
                return (
                  <label key={slug} className="flex items-center gap-2 cursor-pointer capitalize font-medium">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handlePackageToggle(slug)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>{slug} Tier</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Parser Definition"}
            </Button>
          </div>
        </form>
      </Dialog>

      {/* Live SMS 5-Field Test Playground Modal */}
      <Dialog
        isOpen={isTestModalOpen}
        onClose={() => setIsTestModalOpen(false)}
        title="Live 5-Field SMS Extraction Playground"
        description="Test extracting Transaction ID, Amount, Customer Phone, Date/Time, and Type in real-time."
        maxWidth="lg"
      >
        <div className="space-y-4 pt-2 text-xs">
          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300">Sender SMS Origin</label>
            <Input
              type="text"
              value={testForm.sender}
              onChange={(e) => setTestForm({ ...testForm, sender: e.target.value })}
              className="mt-1 font-mono"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300">Raw Incoming SMS Message</label>
            <textarea
              rows={3}
              value={testForm.message}
              onChange={(e) => setTestForm({ ...testForm, message: e.target.value })}
              className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-xs text-slate-900 font-mono dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300">TrxID Regex Pattern</label>
              <Input
                type="text"
                value={testForm.trx_id_regex}
                onChange={(e) => setTestForm({ ...testForm, trx_id_regex: e.target.value })}
                className="mt-1 font-mono text-xs"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300">Amount Regex Pattern</label>
              <Input
                type="text"
                value={testForm.amount_regex}
                onChange={(e) => setTestForm({ ...testForm, amount_regex: e.target.value })}
                className="mt-1 font-mono text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300">Mobile Phone Regex Pattern</label>
              <Input
                type="text"
                value={testForm.phone_regex}
                onChange={(e) => setTestForm({ ...testForm, phone_regex: e.target.value })}
                className="mt-1 font-mono text-xs"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300">Date/Time Regex Pattern</label>
              <Input
                type="text"
                value={testForm.date_time_regex}
                onChange={(e) => setTestForm({ ...testForm, date_time_regex: e.target.value })}
                className="mt-1 font-mono text-xs"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300">Transaction Type Regex Pattern</label>
            <Input
              type="text"
              value={testForm.type_regex}
              onChange={(e) => setTestForm({ ...testForm, type_regex: e.target.value })}
              className="mt-1 font-mono text-xs"
            />
          </div>

          <Button onClick={handleRunTest} disabled={isTesting} className="w-full gap-2 mt-2">
            <Play className="w-4 h-4 text-emerald-400" />
            <span>{isTesting ? "Executing Multi-Field Regex..." : "Run 5-Field Pattern Extraction"}</span>
          </Button>

          {/* Test Extraction 5-Card Output Grid */}
          {testResult && (
            <div
              className={`p-4 rounded-xl border ${
                testResult.is_valid_match
                  ? "bg-slate-900 border-emerald-500/40"
                  : "bg-slate-900 border-rose-500/40"
              } space-y-3 mt-3`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs flex items-center gap-1.5">
                  {testResult.is_valid_match ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400">Multi-Field Extraction Success</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4 text-rose-400" />
                      <span className="text-rose-400">No Pattern Match Found</span>
                    </>
                  )}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-xs font-mono pt-1">
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 font-sans font-semibold flex items-center gap-1">
                    <CreditCard className="w-3 h-3 text-blue-400" /> TrxID
                  </span>
                  <span className="font-bold text-blue-400 block mt-1 truncate" title={testResult.extracted_trx_id || ""}>
                    {testResult.extracted_trx_id || "N/A"}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 font-sans font-semibold flex items-center gap-1">
                    <CreditCard className="w-3 h-3 text-emerald-400" /> Amount
                  </span>
                  <span className="font-bold text-emerald-400 block mt-1">
                    {testResult.extracted_amount ? `৳${testResult.extracted_amount}` : "N/A"}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 font-sans font-semibold flex items-center gap-1">
                    <Smartphone className="w-3 h-3 text-indigo-400" /> Mobile Phone
                  </span>
                  <span className="font-bold text-indigo-300 block mt-1 truncate" title={testResult.extracted_phone || ""}>
                    {testResult.extracted_phone || "N/A"}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 font-sans font-semibold flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" /> Date & Time
                  </span>
                  <span className="font-bold text-amber-300 block mt-1 text-[10px] truncate" title={testResult.extracted_date_time || ""}>
                    {testResult.extracted_date_time || "N/A"}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 font-sans font-semibold flex items-center gap-1">
                    <Tag className="w-3 h-3 text-purple-400" /> Type
                  </span>
                  <span className="font-bold text-purple-300 block mt-1 truncate">
                    {testResult.extracted_type || "Received"}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </Dialog>
    </div>
  );
}
