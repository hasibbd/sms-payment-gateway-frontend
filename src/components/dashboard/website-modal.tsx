"use client";

import { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { websiteService } from "@/services/website.service";
import { Website } from "@/types";
import { SecretReveal } from "@/components/shared/secret-reveal";

interface WebsiteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  websiteToEdit?: Website | null;
}

export function WebsiteModal({ isOpen, onClose, onSuccess, websiteToEdit }: WebsiteModalProps) {
  const [name, setName] = useState(websiteToEdit?.name || "");
  const [domain, setDomain] = useState(websiteToEdit?.domain || "");
  const [environment, setEnvironment] = useState<"production" | "sandbox">(websiteToEdit?.environment || "production");
  const [webhookUrl, setWebhookUrl] = useState(websiteToEdit?.webhook_url || "");
  const [isLoading, setIsLoading] = useState(false);
  const [createdSecret, setCreatedSecret] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !domain.trim()) return;
    setIsLoading(true);

    try {
      if (websiteToEdit) {
        await websiteService.updateWebsite(websiteToEdit.id, { name, domain, environment, webhook_url: webhookUrl });
        onSuccess();
        handleClose();
      } else {
        const { client_secret } = await websiteService.createWebsite({ name, domain, environment });
        setCreatedSecret(client_secret);
        onSuccess();
      }
    } catch {
      // Handled
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setName("");
    setDomain("");
    setEnvironment("production");
    setWebhookUrl("");
    setCreatedSecret(null);
    onClose();
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={handleClose}
      title={createdSecret ? "Website & Credentials Created" : websiteToEdit ? "Edit Website Settings" : "Connect New Merchant Website"}
      description={
        createdSecret
          ? "Your website client credentials have been provisioned."
          : "Register your e-commerce store domain to receive API key authorization."
      }
      maxWidth="md"
    >
      {createdSecret ? (
        <div className="space-y-4 pt-2">
          <SecretReveal secret={createdSecret} isNewGeneration={true} label="Website API Secret" />
          <div className="flex justify-end pt-3">
            <Button onClick={handleClose}>Done & Close</Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Website Title</label>
            <Input
              type="text"
              placeholder="e.g. My E-Commerce Shop"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Domain URL</label>
            <Input
              type="url"
              placeholder="https://shop.example.com"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="mt-1"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Environment</label>
              <select
                value={environment}
                onChange={(e) => setEnvironment(e.target.value as "production" | "sandbox")}
                className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 mt-1"
              >
                <option value="production">Production (Live)</option>
                <option value="sandbox">Sandbox (Testing)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Webhook Endpoint (Optional)</label>
              <Input
                type="url"
                placeholder="https://shop.com/webhook"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : websiteToEdit ? "Update Website" : "Create Website"}
            </Button>
          </div>
        </form>
      )}
    </Dialog>
  );
}
