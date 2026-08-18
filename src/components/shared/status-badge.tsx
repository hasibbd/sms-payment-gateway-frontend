import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { VerificationResult } from "@/types";

interface StatusBadgeProps {
  status: string | VerificationResult;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const normalized = status.toLowerCase();

  switch (normalized) {
    // General / Active
    case "active":
    case "success":
    case "verified":
    case "paid":
    case "delivered":
    case "completed":
      return <Badge variant="success">{status.replace(/_/g, " ").toUpperCase()}</Badge>;

    // Warning / Pending
    case "pending":
    case "offline":
    case "retrying":
    case "unverified":
    case "sandbox":
      return <Badge variant="warning">{status.replace(/_/g, " ").toUpperCase()}</Badge>;

    // Destructive / Failed
    case "failed":
    case "disabled":
    case "revoked":
    case "suspended":
    case "expired":
    case "canceled":
    case "unpaid":
    case "overdue":
    case "not_found":
    case "amount_mismatch":
    case "already_claimed":
    case "invalid_request":
    case "rate_limited":
      return <Badge variant="destructive">{status.replace(/_/g, " ").toUpperCase()}</Badge>;

    default:
      return <Badge variant="default">{status.replace(/_/g, " ").toUpperCase()}</Badge>;
  }
}
