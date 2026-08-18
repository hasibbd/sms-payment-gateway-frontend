import { apiClient } from "@/lib/api/api-client";
import { AdminStats, Package, PaginatedResponse, User } from "@/types";
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
    email: "admin@payverify.io",
    role: "admin",
    status: "active",
    created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: 2,
    name: "Merchant Store Manager",
    email: "merchant@payverify.io",
    role: "user",
    status: "active",
    mobile: "+1 (555) 234-5678",
    company: "FinTech Store Ltd.",
    created_at: "2026-02-01T00:00:00Z",
  },
  {
    id: 3,
    name: "Rahim Tech Ltd",
    email: "rahim@techstore.bd",
    role: "user",
    status: "active",
    mobile: "+880 1711 000111",
    company: "Rahim E-Commerce",
    created_at: "2026-03-12T00:00:00Z",
  },
  {
    id: 4,
    name: "Fashion Hub Online",
    email: "billing@fashionhub.com",
    role: "user",
    status: "suspended",
    company: "Fashion Hub BD",
    created_at: "2026-04-05T00:00:00Z",
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
};
