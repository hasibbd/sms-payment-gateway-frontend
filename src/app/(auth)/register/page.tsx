"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Shield, Mail, Lock, User as UserIcon, Building, ArrowRight, PackageCheck, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/components/providers/auth-provider";
import { authService } from "@/services/auth.service";
import { toast } from "@/hooks/use-toast";
import { getErrorMessage } from "@/lib/api/api-client";

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters."),
    email: z.string().email("Please enter a valid email address."),
    company: z.string().optional(),
    password: z.string().min(8, "Password must be at least 8 characters."),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match.",
    path: ["password_confirmation"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedPlan = searchParams.get("plan");

  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setIsLoading(true);
    try {
      const res = await authService.register(values);
      login(res.user, res.token);
      toast({
        title: "Account Created!",
        description: selectedPlan
          ? `Welcome! Selected plan '${selectedPlan}' activated.`
          : "Welcome to PayPulse SMS Transaction Verification Platform.",
        variant: "success",
      });
      router.push("/dashboard");
    } catch (err) {
      toast({
        title: "Registration Failed",
        description: getErrorMessage(err),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center text-center">
          <Link href="/" className="inline-flex items-center gap-2 group mb-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Shield className="w-6 h-6" />
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Create Merchant Account
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Connect Android SMS Gateway & Expose Secure Verification APIs
          </p>
        </div>

        {selectedPlan && (
          <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 dark:bg-blue-950/50 dark:border-blue-900 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-600 text-white shrink-0">
              <PackageCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-blue-900 dark:text-blue-200 uppercase tracking-wide">
                Selected SaaS Package
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-300 font-semibold capitalize">
                {selectedPlan} Tier Subscription
              </p>
            </div>
          </div>
        )}

        <Card className="border-slate-200 dark:border-slate-800 shadow-xl">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Full Name</label>
                <Input
                  type="text"
                  placeholder="John Doe"
                  icon={<UserIcon className="w-4 h-4" />}
                  error={errors.name?.message}
                  {...register("name")}
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Work Email</label>
                <Input
                  type="email"
                  placeholder="john@merchantstore.com"
                  icon={<Mail className="w-4 h-4" />}
                  error={errors.email?.message}
                  {...register("email")}
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Company / Store Name</label>
                <Input
                  type="text"
                  placeholder="Merchant Store Ltd."
                  icon={<Building className="w-4 h-4" />}
                  error={errors.company?.message}
                  {...register("company")}
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Password</label>
                <Input
                  type="password"
                  placeholder="At least 8 characters"
                  icon={<Lock className="w-4 h-4" />}
                  error={errors.password?.message}
                  {...register("password")}
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Confirm Password</label>
                <Input
                  type="password"
                  placeholder="Re-enter password"
                  icon={<Lock className="w-4 h-4" />}
                  error={errors.password_confirmation?.message}
                  {...register("password_confirmation")}
                  className="mt-1"
                />
              </div>

              <Button type="submit" className="w-full h-11 text-sm font-semibold gap-2 mt-2" disabled={isLoading}>
                {isLoading ? "Creating Account..." : `Register & Activate ${selectedPlan || "Plan"}`}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
          <Link href="/" className="hover:underline font-medium text-slate-600 dark:text-slate-300">
            ← Back to SaaS Portal
          </Link>
          <p>
            Already registered?{" "}
            <Link href="/login" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
