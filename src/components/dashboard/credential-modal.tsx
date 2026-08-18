"use client";

import { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { websiteService } from "@/services/website.service";
import { WebsiteCredential } from "@/types";
import { SecretReveal } from "@/components/shared/secret-reveal";
import { CopySecret } from "@/components/shared/copy-secret";
import { formatDate } from "@/lib/utils";
import { StatusBadge } from "@/components/shared/status-badge";
import { KeyRound, RefreshCw } from "lucide-react";

interface CredentialModalProps {
  isOpen: boolean;
  onClose: () => void;
  websiteId: number;
  websiteName: string;
  credentials?: WebsiteCredential[];
  onRefresh: () => void;
}

export function CredentialModal({
  isOpen,
  onClose,
  websiteId,
  websiteName,
  credentials = [],
  onRefresh,
}: CredentialModalProps) {
  const [regeneratedSecret, setRegeneratedSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegenerate = async () => {
    setIsLoading(true);
    try {
      const res = await websiteService.regenerateCredentials(websiteId);
      setRegeneratedSecret(res.client_secret);
      onRefresh();
    } catch {
      // Handled
    } finally {
      setIsLoading(false);
    }
  };

  const activeCred = credentials[0];

  return (
    <Dialog
      isOpen={isOpen}
      onClose={() => {
        setRegeneratedSecret(null);
        onClose();
      }}
      title={`API Credentials: ${websiteName}`}
      description="Manage API client keys and secret credentials for transaction verification calls."
      maxWidth="lg"
    >
      <div className="space-y-5 pt-2">
        {regeneratedSecret ? (
          <div className="space-y-4">
            <SecretReveal secret={regeneratedSecret} isNewGeneration={true} label="Regenerated API Secret" />
            <div className="flex justify-end pt-2">
              <Button onClick={() => setRegeneratedSecret(null)}>Return to Credentials</Button>
            </div>
          </div>
        ) : (
          <>
            {activeCred ? (
              <div className="space-y-4">
                {/* Client ID / Public Key */}
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Client ID / API Key</span>
                    <StatusBadge status={activeCred.status} />
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="font-mono text-xs text-slate-900 dark:text-slate-100 font-bold bg-white dark:bg-slate-800 px-3 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 flex-1">
                      {activeCred.client_id}
                    </code>
                    <CopySecret value={activeCred.client_id} label="API Key" />
                  </div>
                </div>

                {/* Metadata details */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                  <div>
                    <span className="text-slate-400 font-medium">Created Date</span>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">{formatDate(activeCred.created_at)}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium">Last Request</span>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">{formatDate(activeCred.last_used_at)}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium">Total Requests</span>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">{activeCred.request_count}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                  <Button variant="outline" size="sm" onClick={handleRegenerate} disabled={isLoading} className="gap-2">
                    <RefreshCw className="w-3.5 h-3.5 text-amber-500" />
                    <span>Regenerate API Secret</span>
                  </Button>

                  <Button variant="ghost" size="sm" onClick={onClose}>
                    Close
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <KeyRound className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-xs text-slate-500">No active credential found for this website.</p>
                <Button onClick={handleRegenerate} className="mt-3" size="sm">
                  Generate Initial API Key
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </Dialog>
  );
}
