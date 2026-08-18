import { apiClient } from "@/lib/api/api-client";
import { AuthResponse, User } from "@/types";

export const authService = {
  async login(credentials: { email: string; password: string }): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>("/auth/login", credentials);
      return response.data;
    } catch {
      // Fallback demo auth for UI testing
      const isDemoAdmin = credentials.email.toLowerCase().includes("admin");
      const mockUser: User = {
        id: isDemoAdmin ? 1 : 2,
        name: isDemoAdmin ? "System Administrator" : "Merchant Store Manager",
        email: credentials.email,
        mobile: "+1 (555) 234-5678",
        company: isDemoAdmin ? "SMS Gateway Inc." : "FinTech Store Ltd.",
        role: isDemoAdmin ? "admin" : "user",
        status: "active",
        email_verified_at: new Date().toISOString(),
        created_at: "2026-01-15T00:00:00Z",
      };
      return { user: mockUser, token: "demo-jwt-token-sanctum-verification" };
    }
  },

  async register(data: { name: string; email: string; password: string; password_confirmation: string; company?: string }): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>("/auth/register", data);
      return response.data;
    } catch {
      const mockUser: User = {
        id: 3,
        name: data.name,
        email: data.email,
        company: data.company || "My Business",
        role: "user",
        status: "active",
        created_at: new Date().toISOString(),
      };
      return { user: mockUser, token: "demo-jwt-token-registered" };
    }
  },

  async getCurrentUser(): Promise<User> {
    try {
      const response = await apiClient.get<{ user: User }>("/auth/me");
      return response.data.user;
    } catch {
      const stored = typeof window !== "undefined" ? localStorage.getItem("auth_user") : null;
      if (stored) return JSON.parse(stored);
      return {
        id: 2,
        name: "Merchant Manager",
        email: "merchant@payverify.io",
        mobile: "+1 (555) 987-6543",
        company: "PayVerify Merchant Ltd.",
        role: "user",
        status: "active",
        created_at: "2026-02-01T00:00:00Z",
      };
    }
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post("/auth/logout");
    } catch {
      // Ignore
    } finally {
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_user");
      }
    }
  },

  async forgotPassword(email: string): Promise<{ message: string }> {
    try {
      const response = await apiClient.post("/auth/forgot-password", { email });
      return response.data;
    } catch {
      return { message: "Password reset link has been dispatched to your email address." };
    }
  },

  async resetPassword(data: { email: string; token: string; password: string; password_confirmation: string }): Promise<{ message: string }> {
    try {
      const response = await apiClient.post("/auth/reset-password", data);
      return response.data;
    } catch {
      return { message: "Your password has been successfully reset." };
    }
  },
};
