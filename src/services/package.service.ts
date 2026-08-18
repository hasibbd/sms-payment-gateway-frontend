import { apiClient } from "@/lib/api/api-client";
import { Package } from "@/types";

export const MOCK_PACKAGES: Package[] = [
  {
    id: 1,
    name: "Starter Merchant",
    slug: "starter",
    description: "Ideal for small stores and individual merchants starting automated SMS transaction verification.",
    price: 29.0,
    billing_cycle: "monthly",
    validity_days: 30,
    device_limit: 2,
    website_limit: 3,
    sms_limit: 5000,
    verification_limit: 10000,
    features: [
      "Up to 2 Android Phone Gateway Nodes",
      "3 Connected E-commerce Websites",
      "5,000 SMS Processing per month",
      "10,000 API Verification requests",
      "Real-time bKash, Nagad & Rocket parsing",
      "Email & Webhook notifications",
      "Standard SLA Support",
    ],
    is_active: true,
  },
  {
    id: 2,
    name: "Business Pro",
    slug: "business-pro",
    description: "Built for scaling e-commerce platforms and multi-channel retailers requiring higher quotas.",
    price: 79.0,
    billing_cycle: "monthly",
    validity_days: 30,
    device_limit: 5,
    website_limit: 10,
    sms_limit: 20000,
    verification_limit: 50000,
    features: [
      "Up to 5 Android Phone Gateway Nodes",
      "10 Connected Websites / Sandbox Envs",
      "20,000 SMS Processing per month",
      "50,000 API Verification requests",
      "Multi-provider parsing (bKash, Nagad, Rocket, Bank)",
      "Instant Webhook Signature Security",
      "Detailed Verification Analytics & CSV Export",
      "Priority 24/7 Support",
    ],
    is_active: true,
  },
  {
    id: 3,
    name: "Enterprise Fleet",
    slug: "enterprise",
    description: "High-volume fintech platforms, payment facilitators, and corporate businesses.",
    price: 199.0,
    billing_cycle: "monthly",
    validity_days: 30,
    device_limit: 15,
    website_limit: 30,
    sms_limit: 100000,
    verification_limit: 250000,
    features: [
      "Up to 15 Android Phone Gateway Nodes",
      "30 Connected Websites",
      "100,000 SMS Processing per month",
      "250,000 API Verification requests",
      "Dedicated High-speed Proxy Infrastructure",
      "Custom Webhook retry rules",
      "Dedicated Account Manager & 99.9% Uptime SLA",
    ],
    is_active: true,
  },
];

export const packageService = {
  async getPackages(): Promise<Package[]> {
    try {
      const response = await apiClient.get<{ packages: Package[] }>("/user/packages");
      return response.data.packages;
    } catch {
      return MOCK_PACKAGES;
    }
  },
};
