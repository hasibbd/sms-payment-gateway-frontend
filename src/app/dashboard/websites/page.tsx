"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { websiteService } from "@/services/website.service";
import { Website } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import { WebsiteModal } from "@/components/dashboard/website-modal";
import { CredentialModal } from "@/components/dashboard/credential-modal";
import { ConfirmationDialog } from "@/components/shared/confirmation-dialog";
import { formatDate } from "@/lib/utils";
import { Globe, Plus, Key, Edit, Trash2, Webhook, ExternalLink, ShieldCheck } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { TableSkeleton } from "@/components/shared/loading-skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import Link from "next/link";

export default function WebsitesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWebsite, setEditingWebsite] = useState<Website | null>(null);
  const [credentialWebsite, setCredentialWebsite] = useState<Website | null>(null);
  const [deleteWebsiteId, setDeleteWebsiteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data: websites = [], isLoading, refetch } = useQuery({
    queryKey: ["merchant-websites"],
    queryFn: () => websiteService.getWebsites(),
  });

  const handleDeleteConfirm = async () => {
    if (!deleteWebsiteId) return;
    setIsDeleting(true);
    try {
      const res = await websiteService.deleteWebsite(deleteWebsiteId);
      toast({
        title: "Website Removed",
        description: res.message,
        variant: "warning",
      });
      refetch();
      setDeleteWebsiteId(null);
    } catch {
      toast({
        title: "Delete Failed",
        description: "Could not remove website.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Connected Merchant Websites
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Authorize your e-commerce platforms and stores to query transaction verification APIs.
          </p>
        </div>

        <Button
          onClick={() => {
            setEditingWebsite(null);
            setIsModalOpen(true);
          }}
          className="gap-2 text-xs font-semibold"
        >
          <Plus className="w-4 h-4" />
          <span>Connect New Website</span>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Globe className="w-5 h-5 text-indigo-500" /> Authorized Merchant Applications
          </CardTitle>
          <CardDescription>Website credentials, API Keys, and endpoint configuration</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <TableSkeleton columns={7} rows={3} />
          ) : websites.length === 0 ? (
            <EmptyState
              title="No Websites Connected"
              description="Register your first website to generate API credentials and enable transaction verification endpoints."
              icon={<Globe className="w-8 h-8" />}
              actionText="Connect Website Now"
              onAction={() => {
                setEditingWebsite(null);
                setIsModalOpen(true);
              }}
            />
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-3">Website Name</th>
                    <th className="p-3">Domain</th>
                    <th className="p-3">Environment</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Last API Request</th>
                    <th className="p-3">Created Date</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {websites.map((site) => (
                    <tr key={site.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="p-3 font-semibold text-slate-900 dark:text-slate-100">{site.name}</td>
                      <td className="p-3 text-blue-600 dark:text-blue-400 font-mono">
                        <a href={site.domain} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:underline">
                          {site.domain}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </td>
                      <td className="p-3">
                        <StatusBadge status={site.environment} />
                      </td>
                      <td className="p-3">
                        <StatusBadge status={site.status} />
                      </td>
                      <td className="p-3 text-slate-500">{formatDate(site.last_api_request_at)}</td>
                      <td className="p-3 text-slate-500">{formatDate(site.created_at)}</td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCredentialWebsite(site)}
                            className="h-8 px-2 text-xs gap-1"
                            title="Manage Credentials"
                          >
                            <Key className="w-3.5 h-3.5 text-amber-500" />
                            <span>API Keys</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingWebsite(site);
                              setIsModalOpen(true);
                            }}
                            className="h-8 px-2"
                            title="Edit Website"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setDeleteWebsiteId(site.id)}
                            className="h-8 px-2"
                            title="Delete Website"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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

      {/* Website Modal */}
      <WebsiteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => refetch()}
        websiteToEdit={editingWebsite}
      />

      {/* Credential Modal */}
      <CredentialModal
        isOpen={!!credentialWebsite}
        onClose={() => setCredentialWebsite(null)}
        websiteId={credentialWebsite?.id || 0}
        websiteName={credentialWebsite?.name || ""}
        credentials={credentialWebsite?.credentials}
        onRefresh={() => refetch()}
      />

      {/* Delete Confirmation */}
      <ConfirmationDialog
        isOpen={!!deleteWebsiteId}
        onClose={() => setDeleteWebsiteId(null)}
        onConfirm={handleDeleteConfirm}
        title="Revoke Website Authorization?"
        description="Deleting this website will immediately revoke its API keys. Any pending API verification requests from this domain will fail."
        confirmText="Revoke Website"
        isLoading={isDeleting}
      />
    </div>
  );
}
