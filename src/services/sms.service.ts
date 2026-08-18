import { apiClient } from "@/lib/api/api-client";
import { PaginatedResponse, SmsMessage } from "@/types";

export const MOCK_SMS_LOGS: SmsMessage[] = [
  {
    id: 1001,
    received_at: "2026-08-18T15:20:10Z",
    sender: "bKash",
    device_name: "Store POS Phone #1 (Samsung A54)",
    provider: "bkash",
    sms_preview: "You have received Tk 1,250.00 from 01711223344. Ref ORDER-10051. Fee Tk 0.00. Balance Tk 45,210.50. TrxID 9B71A02931 at 18/08/2026 15:20",
    parsing_status: "success",
    transaction_id: "9B71A02931",
    amount: 1250.0,
    raw_message:
      "You have received Tk 1,250.00 from 01711223344. Ref ORDER-10051. Fee Tk 0.00. Balance Tk 45,210.50. TrxID 9B71A02931 at 18/08/2026 15:20",
    parsed_payload: {
      provider: "bKash",
      type: "cash_in",
      amount: 1250.0,
      customer_phone: "01711223344",
      reference: "ORDER-10051",
      transaction_id: "9B71A02931",
    },
  },
  {
    id: 1002,
    received_at: "2026-08-18T15:12:45Z",
    sender: "NAGAD",
    device_name: "Dhaka Warehouse Gateway",
    provider: "nagad",
    sms_preview: "Cash In Received Amount: Tk 4,500.00 from 01899112233. TxnID: 71029381. Date: 18-08-2026. Ref: INV-9902",
    parsing_status: "success",
    transaction_id: "71029381",
    amount: 4500.0,
    raw_message: "Cash In Received Amount: Tk 4,500.00 from 01899112233. TxnID: 71029381. Date: 18-08-2026. Ref: INV-9902",
  },
  {
    id: 1003,
    received_at: "2026-08-18T14:45:00Z",
    sender: "16216",
    device_name: "Store POS Phone #1 (Samsung A54)",
    provider: "rocket",
    sms_preview: "You received Tk 800.00 A/C: 019223344558 from 01922334455. TxnId: 44102938. Balance: Tk 12,900.00.",
    parsing_status: "success",
    transaction_id: "44102938",
    amount: 800.0,
  },
  {
    id: 1004,
    received_at: "2026-08-18T14:10:20Z",
    sender: "8801700000000",
    device_name: "Store POS Phone #1 (Samsung A54)",
    provider: "other",
    sms_preview: "Promotional SMS: Recharge Tk 50 and get 1GB data free for 3 days.",
    parsing_status: "ignored",
    error_message: "Non-financial message ignored by AI regex rules.",
  },
  {
    id: 1005,
    received_at: "2026-08-18T13:30:15Z",
    sender: "CITYBANK",
    device_name: "Dhaka Warehouse Gateway",
    provider: "citybank",
    sms_preview: "A/C *1092 credited by BDT 15,000.00 via EFT. Ref: SALARY-AUG. Available Bal: BDT 145,000.00.",
    parsing_status: "success",
    transaction_id: "EFT-881920",
    amount: 15000.0,
  },
];

export interface SmsFilters {
  page?: number;
  search?: string;
  provider?: string;
  parsing_status?: string;
  device_id?: string;
  date_from?: string;
  date_to?: string;
}

export const smsService = {
  async getSmsLogs(filters: SmsFilters = {}): Promise<PaginatedResponse<SmsMessage>> {
    try {
      const response = await apiClient.get<PaginatedResponse<SmsMessage>>("/user/sms-logs", { params: filters });
      return response.data;
    } catch {
      let filtered = [...MOCK_SMS_LOGS];
      if (filters.provider && filters.provider !== "all") {
        filtered = filtered.filter((s) => s.provider === filters.provider);
      }
      if (filters.parsing_status && filters.parsing_status !== "all") {
        filtered = filtered.filter((s) => s.parsing_status === filters.parsing_status);
      }
      if (filters.search) {
        const query = filters.search.toLowerCase();
        filtered = filtered.filter(
          (s) =>
            s.sender.toLowerCase().includes(query) ||
            s.sms_preview.toLowerCase().includes(query) ||
            (s.transaction_id && s.transaction_id.toLowerCase().includes(query))
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
