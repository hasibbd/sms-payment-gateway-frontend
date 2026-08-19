"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getEchoInstance } from "@/lib/echo";
import { useAuth } from "@/components/providers/auth-provider";
import { toast } from "@/hooks/use-toast";

interface SmsReceivedEventPayload {
  id: number;
  sender: string;
  provider: string;
  sms_preview: string;
  parsing_status: string;
  transaction_id?: string;
  amount?: number;
  received_at: string;
}

interface TransactionVerifiedEventPayload {
  id: number;
  transaction_id: string;
  provider: string;
  amount: number;
  result: string;
  website_name: string;
  verified_at: string;
}

export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    const echo = getEchoInstance();
    if (!echo) return;

    // 1. Subscribe to public gateway channel
    const gatewayChannel = echo.channel("sms-gateway");

    gatewayChannel.listen(".sms.received", (data: SmsReceivedEventPayload) => {
      // Show instant toast notification
      toast({
        title: `⚡ Real-Time SMS Received (${data.provider.toUpperCase()})`,
        description: `From: ${data.sender} | TrxID: ${data.transaction_id || "Parsing..."} | Amount: ৳${data.amount || 0}`,
        variant: "success",
      });

      // Auto-invalidate logs queries in React Query
      queryClient.invalidateQueries({ queryKey: ["user-dashboard-stats"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      queryClient.invalidateQueries({ queryKey: ["sms-logs"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    });

    gatewayChannel.listen(".transaction.verified", (data: TransactionVerifiedEventPayload) => {
      toast({
        title: `✅ Real-Time Verification (${data.website_name})`,
        description: `TrxID: ${data.transaction_id} | Amount: ৳${data.amount} | Status: ${data.result.toUpperCase()}`,
        variant: data.result === "success" || data.result === "verified" ? "success" : "warning",
      });

      queryClient.invalidateQueries({ queryKey: ["verification-logs"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    });

    // 2. User-specific private channel if logged in
    if (user?.id) {
      const userChannel = echo.channel(`user.${user.id}`);
      userChannel.listen(".sms.received", () => {
        queryClient.invalidateQueries({ queryKey: ["user-dashboard-stats"] });
      });
    }

    return () => {
      echo.leaveChannel("sms-gateway");
      if (user?.id) {
        echo.leaveChannel(`user.${user.id}`);
      }
    };
  }, [user, queryClient]);

  return <>{children}</>;
}
