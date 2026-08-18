import { apiClient } from "@/lib/api/api-client";
import { PaginatedResponse, Transaction } from "@/types";

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 501,
    transaction_id: "9B71A02931",
    provider: "bkash",
    type: "cash_in",
    amount: 1250.0,
    customer_phone: "01711223344",
    reference: "ORDER-10051",
    device_name: "Store POS Phone #1 (Samsung A54)",
    transaction_time: "2026-08-18T15:20:10Z",
    status: "verified",
    sms_id: 1001,
    raw_sms_preview: "You have received Tk 1,250.00 from 01711223344. Ref ORDER-10051. TrxID 9B71A02931",
    verification_count: 2,
  },
  {
    id: 502,
    transaction_id: "71029381",
    provider: "nagad",
    type: "cash_in",
    amount: 4500.0,
    customer_phone: "01899112233",
    reference: "INV-9902",
    device_name: "Dhaka Warehouse Gateway",
    transaction_time: "2026-08-18T15:12:45Z",
    status: "verified",
    sms_id: 1002,
    raw_sms_preview: "Cash In Received Amount: Tk 4,500.00 from 01899112233. TxnID: 71029381. Ref: INV-9902",
    verification_count: 1,
  },
  {
    id: 503,
    transaction_id: "44102938",
    provider: "rocket",
    type: "cash_in",
    amount: 800.0,
    customer_phone: "01922334455",
    reference: "SUB-8812",
    device_name: "Store POS Phone #1 (Samsung A54)",
    transaction_time: "2026-08-18T14:45:00Z",
    status: "claimed",
    sms_id: 1003,
    raw_sms_preview: "You received Tk 800.00 A/C: 019223344558 from 01922334455. TxnId: 44102938",
    verification_count: 3,
  },
  {
    id: 504,
    transaction_id: "EFT-881920",
    provider: "citybank",
    type: "add_money",
    amount: 15000.0,
    customer_phone: "N/A",
    reference: "SALARY-AUG",
    device_name: "Dhaka Warehouse Gateway",
    transaction_time: "2026-08-18T13:30:15Z",
    status: "unverified",
    sms_id: 1005,
    verification_count: 0,
  },
  {
    id: 505,
    transaction_id: "8C10294829",
    provider: "bkash",
    type: "payment",
    amount: 3200.0,
    customer_phone: "01688990011",
    reference: "CART-9912",
    device_name: "Store POS Phone #1 (Samsung A54)",
    transaction_time: "2026-08-18T12:10:00Z",
    status: "verified",
    verification_count: 1,
  },
];

export interface TransactionFilters {
  page?: number;
  search?: string;
  provider?: string;
  status?: string;
  type?: string;
  date_from?: string;
  date_to?: string;
}

export const transactionService = {
  async getTransactions(filters: TransactionFilters = {}): Promise<PaginatedResponse<Transaction>> {
    try {
      const response = await apiClient.get<PaginatedResponse<Transaction>>("/user/transactions", { params: filters });
      return response.data;
    } catch {
      let filtered = [...MOCK_TRANSACTIONS];
      if (filters.provider && filters.provider !== "all") {
        filtered = filtered.filter((t) => t.provider === filters.provider);
      }
      if (filters.status && filters.status !== "all") {
        filtered = filtered.filter((t) => t.status === filters.status);
      }
      if (filters.search) {
        const query = filters.search.toLowerCase();
        filtered = filtered.filter(
          (t) =>
            t.transaction_id.toLowerCase().includes(query) ||
            (t.reference && t.reference.toLowerCase().includes(query)) ||
            (t.customer_phone && t.customer_phone.includes(query))
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
