"use client";

import Link from "next/link";
import { MailCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
      <div className="w-full max-w-md text-center space-y-6">
        <Card className="border-slate-200 dark:border-slate-800 shadow-xl">
          <CardContent className="p-8 space-y-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500 mx-auto">
              <MailCheck className="w-8 h-8" />
            </div>

            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Verify Your Email Address</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              We have sent a verification link to your registered email address. Please click the link to activate your SMS gateway endpoints.
            </p>

            <div className="pt-2 flex flex-col gap-2">
              <Link href="/dashboard">
                <Button className="w-full gap-2">
                  <span>Continue to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
