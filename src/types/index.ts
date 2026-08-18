export type UserRole = "user" | "admin";

export interface User {
  id: number;
  name: string;
  email: string;
  mobile?: string;
  company?: string;
  role: UserRole;
  status: "active" | "suspended" | "pending";
  email_verified_at?: string | null;
  created_at: string;
  current_subscription?: Subscription | null;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface Package {
  id: number;
  name: string;
  slug: string;
  description?: string;
  price: number;
  billing_cycle: "monthly" | "yearly" | "lifetime";
  validity_days: number;
  device_limit: number;
  website_limit: number;
  sms_limit: number;
  verification_limit: number;
  features: string[];
  is_active: boolean;
}

export interface SubscriptionUsage {
  devices_used: number;
  websites_used: number;
  sms_used: number;
  verifications_used: number;
}

export interface Subscription {
  id: number;
  subscription_id: string;
  user_id: number;
  package_id: number;
  package?: Package;
  status: "active" | "expired" | "canceled" | "pending";
  starts_at: string;
  expires_at: string;
  usage?: SubscriptionUsage;
  created_at: string;
}

export interface AndroidDevice {
  id: number;
  device_name: string;
  device_id: string;
  model: string;
  android_version: string;
  app_version: string;
  status: "active" | "offline" | "disabled" | "revoked";
  last_seen_at?: string | null;
  sms_count: number;
  created_at: string;
  registration_key?: string; // Only returned on creation/regeneration
  qr_code_payload?: string;
}

export interface WebsiteCredential {
  id: number;
  client_id: string;
  status: "active" | "revoked";
  created_at: string;
  last_used_at?: string | null;
  request_count: number;
  allowed_ip?: string | null;
  client_secret?: string; // Only returned once upon generation
}

export interface Website {
  id: number;
  name: string;
  domain: string;
  environment: "production" | "sandbox";
  status: "active" | "disabled";
  created_at: string;
  last_api_request_at?: string | null;
  credentials?: WebsiteCredential[];
  webhook_url?: string | null;
  webhook_secret?: string | null;
  events?: string[];
}

export interface SmsMessage {
  id: number;
  received_at: string;
  sender: string;
  device_id?: string;
  device_name: string;
  provider: "bkash" | "nagad" | "rocket" | "upay" | "citybank" | "bracbank" | "other";
  sms_preview: string;
  parsing_status: "success" | "failed" | "pending" | "ignored";
  transaction_id?: string | null;
  amount?: number | null;
  raw_message?: string;
  error_message?: string | null;
  parsed_payload?: Record<string, unknown>;
}

export interface Transaction {
  id: number;
  transaction_id: string;
  provider: "bkash" | "nagad" | "rocket" | "upay" | "citybank" | "bracbank" | "other";
  type: "cash_in" | "cash_out" | "send_money" | "payment" | "add_money";
  amount: number;
  customer_phone?: string | null;
  reference?: string | null;
  device_name: string;
  transaction_time: string;
  status: "verified" | "unverified" | "claimed" | "failed";
  sms_id?: number;
  raw_sms_preview?: string;
  verification_count?: number;
}

export type VerificationResult =
  | "verified"
  | "not_found"
  | "amount_mismatch"
  | "already_claimed"
  | "invalid_request"
  | "rate_limited";

export interface VerificationLog {
  id: number;
  date: string;
  website_name: string;
  transaction_id: string;
  requested_amount: number;
  provider: string;
  reference?: string | null;
  result: VerificationResult;
  response_time_ms: number;
  request_ip: string;
}

export interface WebhookDelivery {
  id: number;
  event_type: "transaction.created" | "transaction.verified" | "transaction.claimed";
  destination_url: string;
  status: "delivered" | "failed" | "retrying";
  http_status: number;
  attempt_count: number;
  timestamp: string;
  response_body?: string;
}

export interface InvoiceItem {
  description: string;
  amount: number;
}

export interface Invoice {
  id: number;
  invoice_number: string;
  created_at: string;
  due_date: string;
  package_name: string;
  amount: number;
  discount: number;
  tax: number;
  total: number;
  status: "paid" | "unpaid" | "overdue" | "canceled";
  items: InvoiceItem[];
  payment_reference?: string | null;
  payment_method?: string | null;
  payment_url?: string;
}

export interface Payment {
  id: number;
  payment_id: string;
  invoice_number: string;
  amount: number;
  method: string;
  status: "completed" | "pending" | "failed";
  paid_at: string;
  transaction_ref: string;
}

export interface DashboardStats {
  subscription: {
    package_name: string;
    status: string;
    starts_at: string;
    expires_at: string;
    remaining_days: number;
  };
  usage: SubscriptionUsage & {
    device_limit: number;
    website_limit: number;
    sms_limit: number;
    verification_limit: number;
  };
  stats: {
    sms_today: number;
    sms_month: number;
    transactions_detected: number;
    successful_parsing: number;
    parsing_failures: number;
    verification_requests: number;
    verification_success: number;
    webhook_success: number;
    webhook_failure: number;
  };
  charts: {
    daily_volume: Array<{ date: string; sms: number; transactions: number; verifications: number }>;
    provider_distribution: Array<{ name: string; value: number }>;
  };
}

export interface AdminStats {
  overview: {
    total_users: number;
    active_users: number;
    active_subscriptions: number;
    expired_subscriptions: number;
    total_revenue: number;
    monthly_revenue: number;
    unpaid_invoices: number;
    active_devices: number;
    active_websites: number;
    sms_processed: number;
    transactions_detected: number;
    verification_requests: number;
  };
  charts: {
    revenue_trend: Array<{ month: string; revenue: number }>;
    user_growth: Array<{ month: string; users: number }>;
    sms_processing: Array<{ day: string; volume: number }>;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}
