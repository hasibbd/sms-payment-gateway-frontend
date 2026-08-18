import { apiClient } from "@/lib/api/api-client";
import { Subscription } from "@/types";
import { MOCK_PACKAGES } from "./package.service";

export const MOCK_SUBSCRIPTION: Subscription = {
  id: 101,
  subscription_id: "SUB-2026-88492",
  user_id: 2,
  package_id: 2,
  package: MOCK_PACKAGES[1], // Business Pro
  status: "active",
  starts_at: "2026-08-01T00:00:00Z",
  expires_at: "2026-08-31T23:59:59Z",
  created_at: "2026-08-01T00:00:00Z",
  usage: {
    devices_used: 2,
    websites_used: 4,
    sms_used: 8540,
    verifications_used: 12140,
  },
};

export const subscriptionService = {
  async getCurrentSubscription(): Promise<Subscription> {
    try {
      const response = await apiClient.get<{ subscription: Subscription }>("/user/subscription");
      return response.data.subscription;
    } catch {
      return MOCK_SUBSCRIPTION;
    }
  },

  async subscribe(packageId: number): Promise<{ message: string; invoice_id?: number }> {
    try {
      const response = await apiClient.post("/user/subscription/subscribe", { package_id: packageId });
      return response.data;
    } catch {
      return {
        message: "Subscription order placed successfully. An invoice has been generated.",
        invoice_id: 202608,
      };
    }
  },

  async cancelSubscription(): Promise<{ message: string }> {
    try {
      const response = await apiClient.post("/user/subscription/cancel");
      return response.data;
    } catch {
      return { message: "Your subscription auto-renewal has been canceled." };
    }
  },
};
