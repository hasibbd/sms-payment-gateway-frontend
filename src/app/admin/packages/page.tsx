"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { packageService } from "@/services/package.service";
import { adminService } from "@/services/admin.service";
import { Package } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { PackageCheck, Plus, Edit, Power, Check } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { TableSkeleton } from "@/components/shared/loading-skeleton";

export default function AdminPackagesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPkg, setEditingPkg] = useState<Package | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { data: packages = [], isLoading: loadingPackages, refetch } = useQuery({
    queryKey: ["admin-packages"],
    queryFn: () => packageService.getPackages(),
  });

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    price: 49,
    device_limit: 5,
    website_limit: 10,
    sms_limit: 20000,
    verification_limit: 50000,
  });

  const handleOpenCreate = () => {
    setEditingPkg(null);
    setFormData({
      name: "",
      slug: "",
      price: 49,
      device_limit: 5,
      website_limit: 10,
      sms_limit: 20000,
      verification_limit: 50000,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (pkg: Package) => {
    setEditingPkg(pkg);
    setFormData({
      name: pkg.name,
      slug: pkg.slug,
      price: pkg.price,
      device_limit: pkg.device_limit,
      website_limit: pkg.website_limit,
      sms_limit: pkg.sms_limit,
      verification_limit: pkg.verification_limit,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await adminService.savePackage({
        id: editingPkg?.id,
        ...formData,
        billing_cycle: "monthly",
        validity_days: 30,
        features: ["Multi-device Node Ingestion", "Webhooks & REST APIs", "24/7 Service Monitoring"],
        is_active: true,
      });
      toast({
        title: "Package Saved",
        description: res.message,
        variant: "success",
      });
      refetch();
      setIsModalOpen(false);
    } catch {
      toast({
        title: "Save Failed",
        description: "Failed to save package plan.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            SaaS Package Plan Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Configure subscription tiers, price rates, resource limits, and feature lists.
          </p>
        </div>

        <Button onClick={handleOpenCreate} className="gap-2 text-xs font-semibold">
          <Plus className="w-4 h-4" />
          <span>Create New Package</span>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <PackageCheck className="w-5 h-5 text-blue-500" /> Active SaaS Tiers
          </CardTitle>
          <CardDescription>Platform package definitions available for merchant checkout</CardDescription>
        </CardHeader>
        <CardContent>
          {loadingPackages ? (
            <TableSkeleton columns={8} rows={3} />
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-3">Package Name</th>
                    <th className="p-3">Slug</th>
                    <th className="p-3">Price</th>
                    <th className="p-3">Devices Limit</th>
                    <th className="p-3">Websites Limit</th>
                    <th className="p-3">SMS Limit</th>
                    <th className="p-3">Verifications Limit</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {packages.map((pkg) => (
                    <tr key={pkg.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="p-3 font-bold text-slate-900 dark:text-slate-100">{pkg.name}</td>
                      <td className="p-3 font-mono text-slate-500">{pkg.slug}</td>
                      <td className="p-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(pkg.price)}
                      </td>
                      <td className="p-3 font-mono">{pkg.device_limit} Devices</td>
                      <td className="p-3 font-mono">{pkg.website_limit} Websites</td>
                      <td className="p-3 font-mono">{formatNumber(pkg.sms_limit)} SMS</td>
                      <td className="p-3 font-mono">{formatNumber(pkg.verification_limit)} Calls</td>
                      <td className="p-3 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenEdit(pkg)}
                          className="h-8 gap-1 text-xs"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>Edit Tier</span>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Package Create/Edit Modal */}
      <Dialog
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingPkg ? `Edit Package: ${editingPkg.name}` : "Create SaaS Package Tier"}
        description="Specify resource quotas and price rates for merchants."
        maxWidth="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4 pt-2 text-xs">
          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300">Package Name</label>
            <Input
              type="text"
              placeholder="e.g. Growth Merchant"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300">URL Slug</label>
              <Input
                type="text"
                placeholder="growth-merchant"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="mt-1"
                required
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300">Monthly Price ($ USD)</label>
              <Input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                className="mt-1"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300">Android Devices Limit</label>
              <Input
                type="number"
                value={formData.device_limit}
                onChange={(e) => setFormData({ ...formData, device_limit: parseInt(e.target.value) || 0 })}
                className="mt-1"
                required
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300">Websites Limit</label>
              <Input
                type="number"
                value={formData.website_limit}
                onChange={(e) => setFormData({ ...formData, website_limit: parseInt(e.target.value) || 0 })}
                className="mt-1"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300">Monthly SMS Quota</label>
              <Input
                type="number"
                value={formData.sms_limit}
                onChange={(e) => setFormData({ ...formData, sms_limit: parseInt(e.target.value) || 0 })}
                className="mt-1"
                required
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300">API Verification Limit</label>
              <Input
                type="number"
                value={formData.verification_limit}
                onChange={(e) => setFormData({ ...formData, verification_limit: parseInt(e.target.value) || 0 })}
                className="mt-1"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Package Definition"}
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
