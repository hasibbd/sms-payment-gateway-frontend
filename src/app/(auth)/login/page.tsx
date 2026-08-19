"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Shield, Mail, Lock, ArrowRight, CheckCircle2, UserCheck, ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/components/providers/auth-provider";
import { authService } from "@/services/auth.service";
import { toast } from "@/hooks/use-toast";
import { getErrorMessage } from "@/lib/api/api-client";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "user1@sms.com",
      password: "123456",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    try {
      const res = await authService.login(values);
      login(res.user, res.token);
      toast({
        title: "Welcome back!",
        description: `Logged in as ${res.user.name}`,
        variant: "success",
      });

      if (res.user.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      toast({
        title: "Login Failed",
        description: getErrorMessage(err),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const setDemoRole = (role: "user" | "admin") => {
    if (role === "admin") {
      setValue("email", "admin@sms.com");
      setValue("password", "123456");
    } else {
      setValue("email", "user1@sms.com");
      setValue("password", "123456");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Logo */}
        <div className="flex flex-col items-center text-center">
          <Link href="/" className="inline-flex items-center gap-2 group mb-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Shield className="w-6 h-6" />
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Sign in to PayPulse
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            SMS Transaction Verification SaaS Gateway
          </p>
        </div>

        {/* Form Card */}
        <Card className="border-slate-200 dark:border-slate-800 shadow-xl">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
                <Input
                  type="email"
                  placeholder="name@company.com"
                  icon={<Mail className="w-4 h-4" />}
                  error={errors.email?.message}
                  {...register("email")}
                  className="mt-1"
                />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Password</label>
                  <Link
                    href="/forgot-password"
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  type="password"
                  placeholder="••••••••"
                  icon={<Lock className="w-4 h-4" />}
                  error={errors.password?.message}
                  {...register("password")}
                  className="mt-1"
                />
              </div>

              <Button type="submit" className="w-full h-11 text-sm font-semibold gap-2 mt-2" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign in to Dashboard"}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </form>

            {/* Prominent Quick Demo Credentials Switcher */}
            <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  One-Click Demo Accounts
                </span>
                <span className="text-[10px] text-blue-600 dark:text-blue-400 font-mono font-bold">
                  Password: 123456
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setDemoRole("user")}
                  className="flex flex-col items-start p-3 rounded-xl border border-blue-200 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-950/30 hover:bg-blue-100/60 dark:hover:bg-blue-900/50 transition-all text-left group"
                >
                  <div className="flex items-center gap-1.5 font-bold text-xs text-blue-700 dark:text-blue-300">
                    <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                    <span>User Merchant</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 mt-1">
                    user1@sms.com
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setDemoRole("admin")}
                  className="flex flex-col items-start p-3 rounded-xl border border-indigo-200 dark:border-indigo-900/50 bg-indigo-50/50 dark:bg-indigo-950/30 hover:bg-indigo-100/60 dark:hover:bg-indigo-900/50 transition-all text-left group"
                >
                  <div className="flex items-center gap-1.5 font-bold text-xs text-indigo-700 dark:text-indigo-300">
                    <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                    <span>System Admin</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 mt-1">
                    admin@sms.com
                  </span>
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer Link */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
          <Link href="/" className="hover:underline font-medium text-slate-600 dark:text-slate-300">
            ← Back to SaaS Portal
          </Link>
          <p>
            New Merchant?{" "}
            <Link href="/register" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
