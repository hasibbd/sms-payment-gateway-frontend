import { apiClient } from "@/lib/api/api-client";
import { PaginatedResponse, VerificationLog } from "@/types";

export const MOCK_VERIFICATION_LOGS: VerificationLog[] = [
  {
    id: 1,
    date: "2026-08-18T15:20:15Z",
    website_name: "Main E-Commerce Shop",
    transaction_id: "9B71A02931",
    requested_amount: 1250.0,
    provider: "bkash",
    reference: "ORDER-10051",
    result: "verified",
    response_time_ms: 42,
    request_ip: "192.168.1.50",
  },
  {
    id: 2,
    date: "2026-08-18T15:13:00Z",
    website_name: "Main E-Commerce Shop",
    transaction_id: "71029381",
    requested_amount: 4500.0,
    provider: "nagad",
    reference: "INV-9902",
    result: "verified",
    response_time_ms: 38,
    request_ip: "192.168.1.50",
  },
  {
    id: 3,
    date: "2026-08-18T15:05:00Z",
    website_name: "Mobile App Checkout API",
    transaction_id: "INVALID_TRX_999",
    requested_amount: 500.0,
    provider: "bkash",
    reference: "CART-8812",
    result: "not_found",
    response_time_ms: 25,
    request_ip: "10.0.0.12",
  },
  {
    id: 4,
    date: "2026-08-18T14:50:22Z",
    website_name: "Main E-Commerce Shop",
    transaction_id: "9B71A02931",
    requested_amount: 2000.0, // Requested 2000 vs actual 1250
    provider: "bkash",
    reference: "ORDER-10051",
    result: "amount_mismatch",
    response_time_ms: 31,
    request_ip: "192.168.1.50",
  },
  {
    id: 5,
    date: "2026-08-18T14:46:10Z",
    website_name: "Staging Test Environment",
    transaction_id: "44102938",
    requested_amount: 800.0,
    provider: "rocket",
    reference: "SUB-8812",
    result: "already_claimed",
    response_time_ms: 29,
    request_ip: "172.16.0.4",
  },
  {
    id: 6,
    date: "2026-08-18T14:15:00Z",
    website_name: "Mobile App Checkout API",
    transaction_id: "MALFORMED_REQ",
    requested_amount: 0.0,
    provider: "unknown",
    result: "invalid_request",
    response_time_ms: 18,
    request_ip: "10.0.0.12",
  },
  {
    id: 7,
    date: "2026-08-18T13:00:00Z",
    website_name: "Staging Test Environment",
    transaction_id: "REQ_BURST_001",
    requested_amount: 100.0,
    provider: "bkash",
    result: "rate_limited",
    response_time_ms: 12,
    request_ip: "172.16.0.4",
  },
];

export interface VerificationFilters {
  page?: number;
  search?: string;
  result?: string;
  website_name?: string;
  provider?: string;
}

export const verificationService = {
  async getVerificationLogs(filters: VerificationFilters = {}): Promise<PaginatedResponse<VerificationLog>> {
    try {
      const response = await apiClient.get<PaginatedResponse<VerificationLog>>("/user/verification-logs", {
        params: filters,
      });
      return response.data;
    } catch {
      let filtered = [...MOCK_VERIFICATION_LOGS];
      if (filters.result && filters.result !== "all") {
        filtered = filtered.filter((v) => v.result === filters.result);
      }
      if (filters.search) {
        const query = filters.search.toLowerCase();
        filtered = filtered.filter(
          (v) =>
            v.transaction_id.toLowerCase().includes(query) ||
            v.website_name.toLowerCase().includes(query) ||
            (v.reference && v.reference.toLowerCase().includes(query))
        );
      }
      return {
        data: filtered,
        meta: {
          current_page: filters.page || 1,
          last_page: 1,
          per_page: 10,
          total: filtered.length,
        },
      };
    }
  },
};
