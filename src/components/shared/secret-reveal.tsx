"use client";

import { useState } from "react";
import { Eye, EyeOff, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CopySecret } from "./copy-secret";
import { maskSecret } from "@/lib/utils";

interface SecretRevealProps {
  secret: string;
  isNewGeneration?: boolean;
  label?: string;
}

export function SecretReveal({ secret, isNewGeneration = false, label = "API Secret" }: SecretRevealProps) {
  const [revealed, setRevealed] = useState(isNewGeneration);

  return (
    <div className="space-y-3 w-full">
      {isNewGeneration && (
        <div className="flex items-start gap-3 p-3.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200">
          <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div className="text-xs leading-relaxed font-medium">
            <span className="font-bold">Important Security Notice:</span> Copy this secret now. For security reasons, it is securely hashed on our backend and will <span className="underline">never</span> be shown again.
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/80">
        <code className="flex-1 font-mono text-xs text-slate-800 dark:text-slate-200 break-all select-all">
          {revealed ? secret : maskSecret(secret)}
        </code>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setRevealed(!revealed)}
          className="h-8 px-2"
        >
          {revealed ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </Button>

        <CopySecret value={secret} label={label} />
      </div>
    </div>
  );
}
