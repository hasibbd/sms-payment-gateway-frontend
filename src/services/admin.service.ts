import { apiClient } from "@/lib/api/api-client";
import { AdminStats, Package, PaginatedResponse, SmsParserConfig, User } from "@/types";
import { MOCK_PACKAGES } from "./package.service";

export const MOCK_ADMIN_STATS: AdminStats = {
  overview: {
    total_users: 148,
    active_users: 132,
    active_subscriptions: 118,
    expired_subscriptions: 14,
    total_revenue: 48920.0,
    monthly_revenue: 8450.0,
    unpaid_invoices: 4,
    active_devices: 284,
    active_websites: 412,
    sms_processed: 1240500,
    transactions_detected: 984120,
    verification_requests: 1850400,
  },
  charts: {
    revenue_trend: [
      { month: "Mar", revenue: 4200 },
      { month: "Apr", revenue: 5400 },
      { month: "May", revenue: 6100 },
      { month: "Jun", revenue: 7200 },
      { month: "Jul", revenue: 7900 },
      { month: "Aug", revenue: 8450 },
    ],
    user_growth: [
      { month: "Mar", users: 45 },
      { month: "Apr", users: 68 },
      { month: "May", users: 92 },
      { month: "Jun", users: 115 },
      { month: "Jul", users: 130 },
      { month: "Aug", users: 148 },
    ],
    sms_processing: [
      { day: "Mon", volume: 38400 },
      { day: "Tue", volume: 42100 },
      { day: "Wed", volume: 45000 },
      { day: "Thu", volume: 41200 },
      { day: "Fri", volume: 49800 },
      { day: "Sat", volume: 52000 },
      { day: "Sun", volume: 39500 },
    ],
  },
};

export const MOCK_ADMIN_USERS: User[] = [
  {
    id: 1,
    name: "System Administrator",
    email: "admin@sms.com",
    role: "admin",
    status: "active",
    created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: 2,
    name: "Demo Merchant User",
    email: "user1@sms.com",
    role: "user",
    status: "active",
    mobile: "+880 1800000000",
    company: "SMS Gateway Store",
    created_at: "2026-02-01T00:00:00Z",
  },
];

export const adminService = {
  async getAdminStats(): Promise<AdminStats> {
    try {
      const response = await apiClient.get<AdminStats>("/admin/stats");
      return response.data;
    } catch {
      return MOCK_ADMIN_STATS;
    }
  },

  async getUsers(page = 1, search = ""): Promise<PaginatedResponse<User>> {
    try {
      const response = await apiClient.get<PaginatedResponse<User>>("/admin/users", { params: { page, search } });
      return response.data;
    } catch {
      let filtered = [...MOCK_ADMIN_USERS];
      if (search) {
        const query = search.toLowerCase();
        filtered = filtered.filter(
          (u) => u.name.toLowerCase().includes(query) || u.email.toLowerCase().includes(query)
        );
      }
      return {
        data: filtered,
        meta: { current_page: page, last_page: 1, per_page: 10, total: filtered.length },
      };
    }
  },

  async toggleUserStatus(userId: number): Promise<{ message: string; status: string }> {
    try {
      const response = await apiClient.post(`/admin/users/${userId}/toggle-status`);
      return response.data;
    } catch {
      const user = MOCK_ADMIN_USERS.find((u) => u.id === userId);
      if (user) {
        user.status = user.status === "active" ? "suspended" : "active";
      }
      return { message: "User account status updated.", status: user?.status || "active" };
    }
  },

  async extendSubscription(userId: number, days: number): Promise<{ message: string }> {
    try {
      const response = await apiClient.post(`/admin/users/${userId}/extend-subscription`, { days });
      return response.data;
    } catch {
      return { message: `Subscription extended by ${days} days.` };
    }
  },

  async savePackage(pkgData: Partial<Package>): Promise<{ message: string; package: Package }> {
    try {
      if (pkgData.id) {
        const response = await apiClient.put(`/admin/packages/${pkgData.id}`, pkgData);
        return response.data;
      }
      const response = await apiClient.post("/admin/packages", pkgData);
      return response.data;
    } catch {
      const existing = MOCK_PACKAGES.find((p) => p.id === pkgData.id);
      if (existing) {
        Object.assign(existing, pkgData);
        return { message: "Package updated successfully.", package: existing };
      }
      const newPkg: Package = {
        id: Date.now(),
        name: pkgData.name || "Custom Plan",
        slug: pkgData.slug || "custom",
        price: pkgData.price || 49,
        billing_cycle: pkgData.billing_cycle || "monthly",
        validity_days: pkgData.validity_days || 30,
        device_limit: pkgData.device_limit || 3,
        website_limit: pkgData.website_limit || 5,
        sms_limit: pkgData.sms_limit || 10000,
        verification_limit: pkgData.verification_limit || 20000,
        features: pkgData.features || ["Custom Feature List"],
        is_active: true,
      };
      MOCK_PACKAGES.push(newPkg);
      return { message: "Package created successfully.", package: newPkg };
    }
  },

  async getParsers(): Promise<SmsParserConfig[]> {
    try {
      const response = await apiClient.get<{ data: SmsParserConfig[] }>("/admin/parsers");
      return response.data.data;
    } catch {
      return [
        {
          id: "1",
          name: "bKash Merchant Parser",
          code: "bkash",
          provider: "bkash",
          sender_pattern: "bKash",
          trx_id_regex: "/TrxID\\s+([A-Z0-9]+)/i",
          amount_regex: "/Tk\\s+([0-9,]+(\\.[0-9]{2})?)/i",
          allowed_package_ids: ["starter", "growth", "enterprise"],
          is_active: true,
          priority: 1,
        },
        {
          id: "2",
          name: "Nagad Merchant Parser",
          code: "nagad",
          provider: "nagad",
          sender_pattern: "Nagad",
          trx_id_regex: "/TxnID:\\s*([A-Z0-9]+)/i",
          amount_regex: "/Amount:\\s*Tk\\s*([0-9,]+(\\.[0-9]{2})?)/i",
          allowed_package_ids: ["starter", "growth", "enterprise"],
          is_active: true,
          priority: 2,
        },
        {
          id: "3",
          name: "DBBL Rocket Parser",
          code: "rocket",
          provider: "rocket",
          sender_pattern: "16216",
          trx_id_regex: "/TxnId:\\s*([0-9]+)/i",
          amount_regex: "/Tk\\s*([0-9,]+(\\.[0-9]{2})?)/i",
          allowed_package_ids: ["growth", "enterprise"],
          is_active: true,
          priority: 3,
        },
        {
          id: "4",
          name: "UCB Upay Parser",
          code: "upay",
          provider: "upay",
          sender_pattern: "Upay",
          trx_id_regex: "/TrxID:\\s*([A-Z0-9]+)/i",
          amount_regex: "/Tk\\s*([0-9,]+(\\.[0-9]{2})?)/i",
          allowed_package_ids: ["growth", "enterprise"],
          is_active: true,
          priority: 4,
        },
        {
          id: "5",
          name: "Bank SMS Parser (Islami/City/BRAC)",
          code: "bank",
          provider: "bank",
          sender_pattern: "BankSMS",
          trx_id_regex: "/Ref:\\s*([A-Z0-9]+)/i",
          amount_regex: "/Cr\\s*BDT\\s*([0-9,]+(\\.[0-9]{2})?)/i",
          allowed_package_ids: ["enterprise"],
          is_active: true,
          priority: 5,
        },
      ];
    }
  },

  async saveParser(parserData: Partial<SmsParserConfig>): Promise<{ message: string; data: SmsParserConfig }> {
    if (parserData.id) {
      const response = await apiClient.put(`/admin/parsers/${parserData.id}`, parserData);
      return response.data;
    }
    const response = await apiClient.post("/admin/parsers", parserData);
    return response.data;
  },

  async toggleParserStatus(parserId: string | number): Promise<{ message: string; data: SmsParserConfig }> {
    const response = await apiClient.post(`/admin/parsers/${parserId}/toggle-status`);
    return response.data;
  },

  async testParser(payload: {
    sender: string;
    message: string;
    trx_id_regex?: string;
    amount_regex?: string;
    phone_regex?: string;
    date_time_regex?: string;
    type_regex?: string;
  }): Promise<{
    data: {
      sender: string;
      message: string;
      extracted_trx_id: string | null;
      extracted_amount: number | null;
      extracted_phone: string | null;
      extracted_date_time: string | null;
      extracted_type: string | null;
      is_valid_match: boolean;
    };
  }> {
    const response = await apiClient.post("/admin/parsers/test", payload);
    return response.data;
  },
};
