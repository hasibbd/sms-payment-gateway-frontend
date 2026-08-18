"use client";

import { useState } from "react";
import { CopySecret } from "@/components/shared/copy-secret";
import { cn } from "@/lib/utils";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.example.com/api/v1";

export function ApiCodeExample() {
  const [activeTab, setActiveTab] = useState<"curl" | "php" | "js" | "node">("curl");

  const examples = {
    curl: `curl -X POST "${API_BASE_URL}/transactions/verify" \\
  -H "Content-Type: application/json" \\
  -H "Accept: application/json" \\
  -H "X-API-Key: YOUR_API_KEY" \\
  -H "X-API-Secret: YOUR_API_SECRET" \\
  -d '{
    "transaction_id": "9B71A02931",
    "amount": 1250,
    "provider": "bkash",
    "reference": "ORDER-10051"
  }'`,

    php: `<?php

$client = new \\GuzzleHttp\\Client();

$response = $client->post("${API_BASE_URL}/transactions/verify", [
    'headers' => [
        'Content-Type' => 'application/json',
        'Accept'       => 'application/json',
        'X-API-Key'    => env('SMS_GATEWAY_KEY'),
        'X-API-Secret' => env('SMS_GATEWAY_SECRET'),
    ],
    'json' => [
        'transaction_id' => '9B71A02931',
        'amount'         => 1250.00,
        'provider'       => 'bkash',
        'reference'      => 'ORDER-10051',
    ],
]);

$result = json_decode($response->getBody(), true);
if ($result['status'] === 'verified') {
    // Transaction verified! Update order to Paid
}`,

    js: `// Browser Fetch API
async function verifyTransaction() {
  const response = await fetch("${API_BASE_URL}/transactions/verify", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": "YOUR_API_KEY",
      "X-API-Secret": "YOUR_API_SECRET"
    },
    body: JSON.stringify({
      transaction_id: "9B71A02931",
      amount: 1250,
      provider: "bkash",
      reference: "ORDER-10051"
    })
  });

  const data = await response.json();
  console.log(data);
}`,

    node: `const axios = require('axios');

async function verifyPayment() {
  try {
    const res = await axios.post('${API_BASE_URL}/transactions/verify', {
      transaction_id: '9B71A02931',
      amount: 1250,
      provider: 'bkash',
      reference: 'ORDER-10051'
    }, {
      headers: {
        'X-API-Key': process.env.SMS_API_KEY,
        'X-API-Secret': process.env.SMS_API_SECRET
      }
    });

    if (res.data.result === 'verified') {
      console.log('Payment verified successfully!');
    }
  } catch (err) {
    console.error('Verification failed:', err.response?.data);
  }
}`,
  };

  const code = examples[activeTab];

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-900 text-slate-100 overflow-hidden shadow-lg">
      {/* Code Tab Navigation */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-950 border-b border-slate-800 text-xs">
        <div className="flex items-center gap-1">
          {(["curl", "php", "js", "node"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-3 py-1.5 rounded-lg font-semibold transition-colors uppercase text-[11px]",
                activeTab === tab
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              )}
            >
              {tab === "curl" ? "cURL" : tab === "php" ? "PHP / Laravel" : tab === "js" ? "JavaScript" : "Node.js"}
            </button>
          ))}
        </div>

        <CopySecret value={code} label="Code Snippet" />
      </div>

      {/* Code Editor Preview */}
      <div className="p-4 overflow-x-auto">
        <pre className="font-mono text-xs text-slate-200 leading-relaxed">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}
