"use client";

import { useQuery } from "@tanstack/react-query";
import { packageService } from "@/services/package.service";
import { subscriptionService } from "@/services/subscription.service";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { Check, Sparkles, Smartphone, Globe, MessageSquare, ShieldCheck, ArrowRight } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import { CardSkeleton } from "@/components/shared/loading-skeleton";

export default function PackagesPage() {
  const [subscribingId, setSubscribingId] = useState<number | null>(null);

  const { data: packages, isLoading: loadingPackages } = useQuery({
    queryKey: ["packages"],
    queryFn: () => packageService.getPackages(),
  });

  const { data: currentSubscription } = useQuery({
    queryKey: ["current-subscription"],
    queryFn: () => subscriptionService.getCurrentSubscription(),
  });

  const handleSubscribe = async (packageId: number, packageName: string) => {
    setSubscribingId(packageId);
    try {
      const res = await subscriptionService.subscribe(packageId);
      toast({
        title: "Order Placed",
        description: `${res.message}`,
        variant: "success",
      });
    } catch {
      toast({
        title: "Order Failed",
        description: "Could not initiate package subscription.",
        variant: "destructive",
      });
    } finally {
      setSubscribingId(null);
    }
  };

  if (loadingPackages || !packages) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  const currentPackageId = currentSubscription?.package_id || 2;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          SaaS Gateway Subscription Packages
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Choose an automated SMS verification plan tailored to your transaction volume.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {packages.map((pkg) => {
          const isCurrent = pkg.id === currentPackageId;
          const isPopular = pkg.slug === "business-pro";

          return (
            <Card
              key={pkg.id}
              className={`relative flex flex-col justify-between transition-all duration-300 ${
                isCurrent
                  ? "border-2 border-blue-600 dark:border-blue-500 shadow-xl bg-blue-50/10 dark:bg-blue-950/20"
                  : isPopular
                  ? "border-amber-500/50 shadow-lg"
                  : ""
              }`}
            >
              {isCurrent && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge variant="info" className="px-3 py-1 bg-blue-600 text-white font-bold uppercase tracking-wider text-[10px]">
                    Current Active Plan
                  </Badge>
                </div>
              )}

              {isPopular && !isCurrent && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge variant="warning" className="px-3 py-1 bg-amber-500 text-slate-950 font-bold uppercase tracking-wider text-[10px] gap-1">
                    <Sparkles className="w-3 h-3" /> Recommended Choice
                  </Badge>
                </div>
              )}

              <CardHeader className="pt-8">
                <CardTitle className="text-xl font-bold text-slate-900 dark:text-slate-100">{pkg.name}</CardTitle>
                <CardDescription className="text-xs line-clamp-2 mt-1">{pkg.description}</CardDescription>

                <div className="pt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-50 font-mono">
                    {formatCurrency(pkg.price)}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">/ {pkg.validity_days} Days</span>
                </div>
              </CardHeader>

              <CardContent className="space-y-6 flex-1 flex flex-col justify-between">
                {/* Resource Limits List */}
                <div className="space-y-2.5 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <Smartphone className="w-3.5 h-3.5 text-blue-500" /> Android Phones
                    </span>
                    <span className="font-bold font-mono">{pkg.device_limit} Devices</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-indigo-500" /> Connected Websites
                    </span>
                    <span className="font-bold font-mono">{pkg.website_limit} Websites</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-amber-500" /> Monthly SMS
                    </span>
                    <span className="font-bold font-mono">{formatNumber(pkg.sms_limit)} SMS</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> API Verifications
                    </span>
                    <span className="font-bold font-mono">{formatNumber(pkg.verification_limit)} Requests</span>
                  </div>
                </div>

                {/* Features List */}
                <div className="space-y-2 text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Included Features:</span>
                  <ul className="space-y-1.5">
                    {pkg.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-slate-600 dark:text-slate-400 leading-relaxed">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action button */}
                <Button
                  onClick={() => handleSubscribe(pkg.id, pkg.name)}
                  disabled={isCurrent || subscribingId === pkg.id}
                  variant={isCurrent ? "outline" : isPopular ? "primary" : "secondary"}
                  className="w-full h-11 text-xs font-semibold gap-2 mt-4"
                >
                  {isCurrent ? (
                    "Active Current Package"
                  ) : subscribingId === pkg.id ? (
                    "Processing..."
                  ) : (
                    <>
                      <span>Upgrade to {pkg.name}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
