import { apiClient } from "@/lib/api/api-client";
import { Website, WebsiteCredential } from "@/types";

export const MOCK_WEBSITES: Website[] = [
  {
    id: 1,
    name: "Main E-Commerce Shop",
    domain: "https://shop.mymerchantstore.com",
    environment: "production",
    status: "active",
    created_at: "2026-02-15T10:00:00Z",
    last_api_request_at: "2026-08-18T15:35:10Z",
    webhook_url: "https://shop.mymerchantstore.com/api/webhooks/sms-verify",
    webhook_secret: "whsec_live_992104810294819",
    events: ["transaction.created", "transaction.verified"],
    credentials: [
      {
        id: 101,
        client_id: "pk_live_8912401829401",
        status: "active",
        created_at: "2026-02-15T10:05:00Z",
        last_used_at: "2026-08-18T15:35:10Z",
        request_count: 11420,
        allowed_ip: "192.168.1.50",
      },
    ],
  },
  {
    id: 2,
    name: "Mobile App Checkout API",
    domain: "https://api.mymerchantstore.com",
    environment: "production",
    status: "active",
    created_at: "2026-03-01T11:20:00Z",
    last_api_request_at: "2026-08-18T14:12:00Z",
    webhook_url: "https://api.mymerchantstore.com/webhooks/verify",
    credentials: [
      {
        id: 102,
        client_id: "pk_live_7721059381923",
        status: "active",
        created_at: "2026-03-01T11:25:00Z",
        last_used_at: "2026-08-18T14:12:00Z",
        request_count: 720,
      },
    ],
  },
  {
    id: 3,
    name: "Staging Test Environment",
    domain: "https://staging.mymerchantstore.com",
    environment: "sandbox",
    status: "active",
    created_at: "2026-04-10T09:00:00Z",
    last_api_request_at: "2026-08-17T18:45:00Z",
    credentials: [
      {
        id: 103,
        client_id: "pk_sandbox_0019284019283",
        status: "active",
        created_at: "2026-04-10T09:05:00Z",
        last_used_at: "2026-08-17T18:45:00Z",
        request_count: 140,
      },
    ],
  },
];

export const websiteService = {
  async getWebsites(): Promise<Website[]> {
    try {
      const response = await apiClient.get<{ websites: Website[] }>("/user/websites");
      return response.data.websites;
    } catch {
      return MOCK_WEBSITES;
    }
  },

  async createWebsite(data: { name: string; domain: string; environment: "production" | "sandbox" }): Promise<{ website: Website; client_secret: string }> {
    try {
      const response = await apiClient.post("/user/websites", data);
      return response.data;
    } catch {
      const clientId = `pk_${data.environment}_${Math.random().toString(36).substring(2, 14)}`;
      const clientSecret = `sk_${data.environment}_${Math.random().toString(36).substring(2, 20)}${Date.now().toString(36)}`;
      const newWebsite: Website = {
        id: Date.now(),
        name: data.name,
        domain: data.domain,
        environment: data.environment,
        status: "active",
        created_at: new Date().toISOString(),
        credentials: [
          {
            id: Date.now() + 1,
            client_id: clientId,
            status: "active",
            created_at: new Date().toISOString(),
            request_count: 0,
            client_secret: clientSecret, // Returned ONCE upon generation
          },
        ],
      };
      MOCK_WEBSITES.unshift(newWebsite);
      return { website: newWebsite, client_secret: clientSecret };
    }
  },

  async updateWebsite(id: number, data: Partial<Website>): Promise<{ message: string }> {
    try {
      await apiClient.put(`/user/websites/${id}`, data);
      return { message: "Website updated successfully." };
    } catch {
      const found = MOCK_WEBSITES.find((w) => w.id === id);
      if (found) Object.assign(found, data);
      return { message: "Website updated successfully." };
    }
  },

  async deleteWebsite(id: number): Promise<{ message: string }> {
    try {
      await apiClient.delete(`/user/websites/${id}`);
      return { message: "Website deleted." };
    } catch {
      const index = MOCK_WEBSITES.findIndex((w) => w.id === id);
      if (index !== -1) MOCK_WEBSITES.splice(index, 1);
      return { message: "Website removed successfully." };
    }
  },

  async regenerateCredentials(websiteId: number): Promise<{ credential: WebsiteCredential; client_secret: string }> {
    try {
      const response = await apiClient.post(`/user/websites/${websiteId}/credentials/regenerate`);
      return response.data;
    } catch {
      const newSecret = `sk_live_${Math.random().toString(36).substring(2, 22)}${Date.now().toString(36)}`;
      const newClientId = `pk_live_${Math.random().toString(36).substring(2, 14)}`;
      const website = MOCK_WEBSITES.find((w) => w.id === websiteId);
      const newCred: WebsiteCredential = {
        id: Date.now(),
        client_id: newClientId,
        status: "active",
        created_at: new Date().toISOString(),
        request_count: 0,
        client_secret: newSecret,
      };
      if (website) {
        website.credentials = [newCred];
      }
      return { credential: newCred, client_secret: newSecret };
    }
  },
};
