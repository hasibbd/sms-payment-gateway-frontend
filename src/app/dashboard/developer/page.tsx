"use client";

import { ApiCodeExample } from "@/components/dashboard/api-code-example";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CopySecret } from "@/components/shared/copy-secret";
import { Code2, KeyRound, ShieldCheck, Webhook, Terminal, CheckCircle2, AlertTriangle, FileCode } from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.example.com/api/v1";

export default function DeveloperPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Developer API Portal & Integration Docs
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Complete REST API specification and SDK code samples to integrate SMS transaction verification into your website checkout.
        </p>
      </div>

      {/* 1. Endpoint Overview Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Terminal className="w-5 h-5 text-blue-500" /> Transaction Verification Endpoint
          </CardTitle>
          <CardDescription>Main endpoint used by merchant websites to verify customer payments</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs shadow-md">
            <Badge className="bg-emerald-600 text-white font-bold uppercase">POST</Badge>
            <span className="text-slate-300 font-bold">{API_BASE_URL}/transactions/verify</span>
            <div className="ml-auto">
              <CopySecret value={`${API_BASE_URL}/transactions/verify`} label="Endpoint URL" />
            </div>
          </div>

          <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
            <h4 className="font-semibold text-slate-900 dark:text-slate-100">Authentication Headers Required</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono">
              <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60">
                <span className="text-blue-500 font-bold">X-API-Key</span>: YOUR_WEBSITE_CLIENT_ID
              </div>
              <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60">
                <span className="text-indigo-500 font-bold">X-API-Secret</span>: YOUR_WEBSITE_SECRET
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Interactive Code Examples Component */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <FileCode className="w-5 h-5 text-indigo-500" /> Multi-Language Code Snippets
        </h3>
        <ApiCodeExample />
      </div>

      {/* 3. Request & Response Payload Schema */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Request Schema */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-bold">JSON Request Body Schema</CardTitle>
            <CardDescription>Fields sent in POST request body</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-100 dark:bg-slate-800/80 font-semibold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-2.5">Field</th>
                    <th className="p-2.5">Type</th>
                    <th className="p-2.5">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-[11px]">
                  <tr>
                    <td className="p-2.5 text-blue-500 font-bold">transaction_id</td>
                    <td className="p-2.5 text-slate-500">string</td>
                    <td className="p-2.5 text-slate-700 dark:text-slate-300">bKash / Nagad / TrxID (e.g. 9B71A02931)</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-blue-500 font-bold">amount</td>
                    <td className="p-2.5 text-slate-500">numeric</td>
                    <td className="p-2.5 text-slate-700 dark:text-slate-300">Requested amount in BDT (e.g. 1250)</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-blue-500 font-bold">provider</td>
                    <td className="p-2.5 text-slate-500">string</td>
                    <td className="p-2.5 text-slate-700 dark:text-slate-300">bkash, nagad, rocket, citybank</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-slate-400">reference</td>
                    <td className="p-2.5 text-slate-500">string (opt)</td>
                    <td className="p-2.5 text-slate-700 dark:text-slate-300">Order ID or merchant cart reference</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Response Code Dictionary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-bold">API Response Codes & Results</CardTitle>
            <CardDescription>Possible result statuses returned by the backend</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            <div className="space-y-2">
              <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">verified</span>
                <span className="text-slate-600 dark:text-slate-300">Transaction matches TrxID, amount & provider.</span>
              </div>

              <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-between">
                <span className="font-mono font-bold text-rose-600 dark:text-rose-400">not_found</span>
                <span className="text-slate-600 dark:text-slate-300">TrxID has not been ingested by any gateway phone.</span>
              </div>

              <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
                <span className="font-mono font-bold text-amber-600 dark:text-amber-400">amount_mismatch</span>
                <span className="text-slate-600 dark:text-slate-300">TrxID found, but customer paid a different amount.</span>
              </div>

              <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-between">
                <span className="font-mono font-bold text-rose-600 dark:text-rose-400">already_claimed</span>
                <span className="text-slate-600 dark:text-slate-300">TrxID was already verified and claimed for another order.</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 4. Webhooks & Signatures */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Webhook className="w-5 h-5 text-emerald-500" /> Webhook Signatures & Security
          </CardTitle>
          <CardDescription>How to verify incoming push webhook payloads</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
          <p>
            When a transaction event occurs, PayVerify dispatches an HTTP POST request to your registered Webhook Endpoint containing the header:
          </p>
          <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-900 text-slate-100 font-mono text-xs">
            X-PayVerify-Signature: sha256_hash_value
          </div>
          <p>
            Compute an HMAC-SHA256 hash of the raw HTTP request body using your <strong>Webhook Secret</strong> as the secret key. Verify that it matches <code className="font-mono text-blue-500">X-PayVerify-Signature</code> to prevent spoofing.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
