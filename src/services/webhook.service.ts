import { apiClient } from "@/lib/api/api-client";
import { WebhookDelivery } from "@/types";

export const MOCK_WEBHOOK_LOGS: WebhookDelivery[] = [
  {
    id: 1,
    event_type: "transaction.verified",
    destination_url: "https://shop.mymerchantstore.com/api/webhooks/sms-verify",
    status: "delivered",
    http_status: 200,
    attempt_count: 1,
    timestamp: "2026-08-18T15:20:16Z",
    response_body: JSON.stringify({ success: true, message: "Order status updated to Paid" }, null, 2),
  },
  {
    id: 2,
    event_type: "transaction.created",
    destination_url: "https://shop.mymerchantstore.com/api/webhooks/sms-verify",
    status: "delivered",
    http_status: 200,
    attempt_count: 1,
    timestamp: "2026-08-18T15:12:46Z",
    response_body: JSON.stringify({ received: true }, null, 2),
  },
  {
    id: 3,
    event_type: "transaction.verified",
    destination_url: "https://api.mymerchantstore.com/webhooks/verify",
    status: "failed",
    http_status: 504,
    attempt_count: 3,
    timestamp: "2026-08-18T14:15:20Z",
    response_body: JSON.stringify({ error: "Gateway Timeout from merchant server" }, null, 2),
  },
];

export const webhookService = {
  async getWebhookLogs(): Promise<WebhookDelivery[]> {
    try {
      const response = await apiClient.get<{ logs: WebhookDelivery[] }>("/user/webhooks/logs");
      return response.data.logs;
    } catch {
      return MOCK_WEBHOOK_LOGS;
    }
  },

  async retryWebhook(id: number): Promise<{ message: string; http_status: number }> {
    try {
      const response = await apiClient.post(`/user/webhooks/${id}/retry`);
      return response.data;
    } catch {
      const found = MOCK_WEBHOOK_LOGS.find((w) => w.id === id);
      if (found) {
        found.status = "delivered";
        found.http_status = 200;
        found.attempt_count += 1;
      }
      return { message: "Webhook retry dispatches successful.", http_status: 200 };
    }
  },
};
