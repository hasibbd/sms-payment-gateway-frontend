import { apiClient } from "@/lib/api/api-client";
import { Invoice, PaginatedResponse, Payment } from "@/types";

export const MOCK_INVOICES: Invoice[] = [
  {
    id: 202608,
    invoice_number: "INV-2026-008",
    created_at: "2026-08-01T10:30:00Z",
    due_date: "2026-08-07T23:59:59Z",
    package_name: "Business Pro Plan",
    amount: 79.0,
    discount: 0.0,
    tax: 3.95,
    total: 82.95,
    status: "paid",
    payment_reference: "PAY-BKASH-99120",
    payment_method: "bKash Online Payment",
    items: [
      { description: "Business Pro Package (30 Days Validity)", amount: 79.0 },
      { description: "5 Android Gateway Node Licenses", amount: 0.0 },
      { description: "10 Website API Credentials", amount: 0.0 },
    ],
  },
  {
    id: 202607,
    invoice_number: "INV-2026-007",
    created_at: "2026-07-01T09:15:00Z",
    due_date: "2026-07-07T23:59:59Z",
    package_name: "Business Pro Plan",
    amount: 79.0,
    discount: 5.0,
    tax: 3.7,
    total: 77.7,
    status: "paid",
    payment_reference: "PAY-NAGAD-44102",
    payment_method: "Nagad Gateway",
    items: [
      { description: "Business Pro Package Renewal", amount: 79.0 },
      { description: "Early Renewal Coupon Discount", amount: -5.0 },
    ],
  },
  {
    id: 202606,
    invoice_number: "INV-2026-006",
    created_at: "2026-06-01T11:00:00Z",
    due_date: "2026-06-07T23:59:59Z",
    package_name: "Starter Merchant Plan",
    amount: 29.0,
    discount: 0.0,
    tax: 1.45,
    total: 30.45,
    status: "paid",
    payment_reference: "PAY-CARD-11928",
    payment_method: "Credit Card (Visa)",
    items: [{ description: "Starter Merchant Subscription", amount: 29.0 }],
  },
];

export const MOCK_PAYMENTS: Payment[] = [
  {
    id: 1,
    payment_id: "PAY-BKASH-99120",
    invoice_number: "INV-2026-008",
    amount: 82.95,
    method: "bKash Gateway",
    status: "completed",
    paid_at: "2026-08-01T10:35:12Z",
    transaction_ref: "8X99A10029",
  },
  {
    id: 2,
    payment_id: "PAY-NAGAD-44102",
    invoice_number: "INV-2026-007",
    amount: 77.7,
    method: "Nagad Gateway",
    status: "completed",
    paid_at: "2026-07-01T09:20:00Z",
    transaction_ref: "NGD7710293",
  },
];

export const billingService = {
  async getInvoices(page = 1): Promise<PaginatedResponse<Invoice>> {
    try {
      const response = await apiClient.get<PaginatedResponse<Invoice>>("/user/invoices", { params: { page } });
      return response.data;
    } catch {
      return {
        data: MOCK_INVOICES,
        meta: { current_page: page, last_page: 1, per_page: 10, total: MOCK_INVOICES.length },
      };
    }
  },

  async getInvoiceById(id: number): Promise<Invoice> {
    try {
      const response = await apiClient.get<{ invoice: Invoice }>(`/user/invoices/${id}`);
      return response.data.invoice;
    } catch {
      const found = MOCK_INVOICES.find((i) => i.id === id);
      return found || MOCK_INVOICES[0];
    }
  },

  async initiatePayment(invoiceId: number): Promise<{ payment_url: string; payment_session: string }> {
    try {
      const response = await apiClient.post(`/user/invoices/${invoiceId}/pay`);
      return response.data;
    } catch {
      return {
        payment_url: `https://checkout.payverify.io/session/inv_${invoiceId}`,
        payment_session: `SESS_${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      };
    }
  },
};
