"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { authService } from "@/services/auth.service";
import { toast } from "@/hooks/use-toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);

    try {
      const res = await authService.forgotPassword(email);
      setSubmitted(true);
      toast({
        title: "Reset Email Dispatched",
        description: res.message,
        variant: "success",
      });
    } catch {
      toast({
        title: "Request Failed",
        description: "Could not send reset password link.",
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
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Forgot Password?</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enter your account email to receive a password reset instructions link.
          </p>
        </div>

        <Card className="border-slate-200 dark:border-slate-800 shadow-xl">
          <CardContent className="p-6">
            {submitted ? (
              <div className="text-center py-4 space-y-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 mx-auto">
                  <Send className="w-6 h-6" />
                </div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Check Your Email</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  We have dispatched password reset instructions to <strong className="text-slate-800 dark:text-slate-200">{email}</strong>.
                </p>
                <Link href="/login" className="inline-block pt-2">
                  <Button variant="outline" size="sm">
                    Return to Login
                  </Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
                  <Input
                    type="email"
                    placeholder="name@company.com"
                    icon={<Mail className="w-4 h-4" />}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>

                <Button type="submit" className="w-full h-11 text-sm font-semibold gap-2" disabled={isLoading}>
                  {isLoading ? "Sending..." : "Send Password Reset Link"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-xs">
          <Link href="/login" className="inline-flex items-center gap-1.5 font-medium text-slate-600 dark:text-slate-400 hover:underline">
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
