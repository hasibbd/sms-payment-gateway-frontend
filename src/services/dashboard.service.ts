import { apiClient } from "@/lib/api/api-client";
import { DashboardStats } from "@/types";

export const MOCK_DASHBOARD_STATS: DashboardStats = {
  subscription: {
    package_name: "Business Pro Plan",
    status: "active",
    starts_at: "2026-08-01T00:00:00Z",
    expires_at: "2026-08-31T23:59:59Z",
    remaining_days: 13,
  },
  usage: {
    devices_used: 2,
    device_limit: 5,
    websites_used: 4,
    website_limit: 10,
    sms_used: 8540,
    sms_limit: 20000,
    verifications_used: 12140,
    verification_limit: 50000,
  },
  stats: {
    sms_today: 412,
    sms_month: 8540,
    transactions_detected: 8410,
    successful_parsing: 8395,
    parsing_failures: 15,
    verification_requests: 12140,
    verification_success: 11980,
    webhook_success: 11950,
    webhook_failure: 30,
  },
  charts: {
    daily_volume: [
      { date: "Aug 12", sms: 310, transactions: 295, verifications: 420 },
      { date: "Aug 13", sms: 380, transactions: 365, verifications: 510 },
      { date: "Aug 14", sms: 450, transactions: 440, verifications: 680 },
      { date: "Aug 15", sms: 420, transactions: 410, verifications: 590 },
      { date: "Aug 16", sms: 490, transactions: 480, verifications: 730 },
      { date: "Aug 17", sms: 530, transactions: 515, verifications: 810 },
      { date: "Aug 18", sms: 412, transactions: 405, verifications: 620 },
    ],
    provider_distribution: [
      { name: "bKash", value: 58 },
      { name: "Nagad", value: 27 },
      { name: "Rocket", value: 10 },
      { name: "CityBank / Other", value: 5 },
    ],
  },
};

export const dashboardService = {
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const response = await apiClient.get<DashboardStats>("/user/stats");
      return response.data;
    } catch {
      return MOCK_DASHBOARD_STATS;
    }
  },
};
