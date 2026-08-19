"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { packageService } from "@/services/package.service";
import { Package } from "@/types";
import { formatCurrency, formatNumber } from "@/lib/utils";
import {
  Shield,
  Smartphone,
  Globe,
  Zap,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Check,
  UserCheck,
  ShieldAlert,
  Play,
  Server,
  RefreshCcw,
  CheckCircle,
  Clock,
  Send,
  Building2,
  CreditCard,
  Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function SaaSPagePortal() {
  const [lang, setLang] = useState<"en" | "bn">("en");

  // Interactive Demo Sandbox State
  const [demoProvider, setDemoProvider] = useState<"bkash" | "nagad" | "rocket" | "upay" | "bank">("bkash");
  const [demoPhone, setDemoPhone] = useState("01711223344");
  const [demoAmount, setDemoAmount] = useState("1500.00");
  const [demoTrxId, setDemoTrxId] = useState("9B8A7C6D");
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationState, setSimulationState] = useState<{
    step: number; // 0: idle, 1: sms received, 2: regex parsed, 3: reverb broadcast, 4: order verified
    trx_id?: string;
    amount?: string;
    phone?: string;
    provider?: string;
  } | null>(null);

  const { data: packages = [] } = useQuery({
    queryKey: ["public-packages"],
    queryFn: () => packageService.getPackages(),
  });

  const t = {
    en: {
      badge: "Automated Payment Gateway & Real-Time Verification Platform",
      heroTitlePrefix: "Automated Payment Gateway &",
      heroTitleSuffix: "Real-Time Payment Verification",
      heroDescription:
        "Transform your Android mobile phone into a high-speed payment gateway node. Collect payment SMS messages, extract transaction IDs automatically, and verify merchant orders via REST APIs and Webhooks.",
      viewPackages: "View Packages",
      loginDemo: "Login Demo (`admin@sms.com`)",
      demoAccountTitle: "Live One-Click Demo Accounts",
      demoAccountSub: "Admin: admin@sms.com | User: user1@sms.com",
      tryLogin: "Try Login →",
      navFeatures: "Platform Features",
      navPackages: "Packages",
      navHowItWorks: "How It Works",
      navDemo: "Live Demo",
      navLogin: "Login Portal",
      navRegister: "Start Free Trial",
      mfsSupportedTitle: "Supported Mobile Financial Services & Banking SMS Parsing",
      packagesSubTitle: "Flexible Subscription Pricing",
      packagesTitle: "Choose Your Gateway Package Tier",
      packagesDesc: "Scale your merchant store verification capacity. Upgrade or downgrade anytime with instant quota activation.",
      monthlyBilling: "Monthly Billing",
      yearlyBilling: "Annual (20% Discount)",
      mostPopular: "Most Popular Choice",
      idealMerchant: "Ideal for active merchant e-commerce stores",
      perMonth: "/ month",
      includedFeatures: "Included Features:",
      buyRegister: "Buy & Register Account",
      featuresSubTitle: "Architected for High Reliability",
      featuresTitle: "Why Top Merchants Choose PayPulse",
      feature1Title: "Android Phone Ingestion Node",
      feature1Desc: "Install our lightweight background Android APK on any smartphone. The app automatically forwards received SMS messages directly to your cloud API with sub-second latency.",
      feature2Title: "Automated Smart SMS Extraction",
      feature2Desc: "Our smart parser automatically detects transaction IDs (TrxID), sender phone numbers, amounts, and payment providers (bKash, Nagad, Rocket, Upay) without manual entry.",
      feature3Title: "Instant Merchant Webhooks & API Integration",
      feature3Desc: "Receive real-time payment notifications directly on your WooCommerce or custom e-commerce checkout. Verify payments instantly with secure API keys.",
      howTitle: "Seamless Automated Workflow",
      howHeading: "How PayPulse SMS Gateway Works",
      step1Title: "1. Smartphone Node Setup",
      step1Desc: "Install our background Android app on your merchant smartphone. Connect your device securely in seconds.",
      step2Title: "2. Payment SMS Received",
      step2Desc: "Customer completes payment via bKash, Nagad, Rocket, Upay, or Bank Transfer. Phone receives official SMS notification.",
      step3Title: "3. Real-Time Smart Parsing",
      step3Desc: "PayPulse smart parser extracts Transaction ID, Amount, Customer Phone, and Date/Time within milliseconds.",
      step4Title: "4. Webhook Push & Order Paid",
      step4Desc: "Sub-second webhook callback is dispatched to your website. Order is automatically marked as Paid in your database.",
      demoHeading: "Interactive Gateway Sandbox Demo",
      demoSub: "Simulate an incoming SMS message and watch the real-time extraction and verification pipeline in action.",
      simBtn: "Simulate Payment SMS & Verify Order",
      randomBtn: "Generate Random TrxID",
      footerText: "© 2026 PayPulse Inc. All rights reserved.",
      devicesUnit: "Devices",
      storesUnit: "Stores",
      smsUnit: "SMS",
      requestsUnit: "Requests",
    },
    bn: {
      badge: "স্বয়ংক্রিয় পেমেন্ট গেটওয়ে এবং রিয়েল-টাইম পেমেন্ট ভেরিফিকেশন",
      heroTitlePrefix: "স্বয়ংক্রিয় পেমেন্ট গেটওয়ে এবং",
      heroTitleSuffix: "রিয়েল-টাইম পেমেন্ট ভেরিফিকেশন",
      heroDescription:
        "আপনার অ্যান্ড্রয়েড মোবাইল ফোনকে একটি দ্রুতগতির পেমেন্ট গেটওয়ে নোডে রূপান্তর করুন। অটোমেটিক পেমেন্ট SMS গ্রহণ, TrxID ও এমাউন্ট এক্সট্রাক্ট এবং মার্চেন্ট অর্ডার ভেরিফাই করুন REST API এবং Webhook-এর মাধ্যমে।",
      viewPackages: "প্যাকেজ সমূহ দেখুন",
      loginDemo: "লগইন ডেমো (`admin@sms.com`)",
      demoAccountTitle: "লাইভ ওয়ান-ক্লিক ডেমো অ্যাকাউন্টস",
      demoAccountSub: "এডমিন: admin@sms.com | ইউজার: user1@sms.com",
      tryLogin: "লগইন করুন →",
      navFeatures: "ফিচার সমূহ",
      navPackages: "প্যাকেজ সমূহ",
      navHowItWorks: "যেভাবে কাজ করে",
      navDemo: "লাইভ ডেমো",
      navLogin: "লগইন পোর্টাল",
      navRegister: "ফ্রি ট্রায়াল শুরু করুন",
      mfsSupportedTitle: "সমর্থিত মোবাইল ফাইন্যান্সিয়াল সার্ভিসেস এবং ব্যাংকিং এসএমএস পার্সিং",
      packagesSubTitle: "সহজ সাবস্ক্রিপশন প্রাইসিং",
      packagesTitle: "আপনার গেটওয়ে প্যাকেজ নির্বাচন করুন",
      packagesDesc: "আপনার মার্চেন্ট স্টোরের ভেরিফিকেশন ক্ষমতা বৃদ্ধি করুন। যেকোনো সময় ইন্সট্যান্ট কোটা অ্যাক্টিভেশনের মাধ্যমে আপগ্রেড বা ডাউনগ্রেড করুন।",
      monthlyBilling: "মাসিক বিলিং",
      yearlyBilling: "বার্ষিক (২০% ডিসকাউন্ট)",
      mostPopular: "সর্বাধিক জনপ্রিয় প্যাকেজ",
      idealMerchant: "সক্রিয় মার্চেন্ট এবং ই-কমার্স স্টোরের জন্য আদর্শ",
      perMonth: "/ মাস",
      includedFeatures: "অন্তর্ভুক্ত সুবিধা সমূহ:",
      buyRegister: "প্যাকেজ কিনুন ও অ্যাকাউন্ট খুলুন",
      featuresSubTitle: "উচ্চ বিশ্বস্ততার সাথে তৈরি",
      featuresTitle: "কেন শীর্ষ মার্চেন্টরা PayPulse বেছে নেন",
      feature1Title: "অ্যান্ড্রয়েড ফোন ইনজেসশন নোড",
      feature1Desc: "যেকোনো অ্যান্ড্রয়েড স্মার্টফোনে আমাদের লাইটওয়েট ব্যাকগ্রাউন্ড এপিকে ইনস্টল করুন। অ্যাপটি স্বয়ংক্রিয়ভাবে রিসিভ হওয়া এসএমএস সরাসরি আপনার ক্লাউড এপিআই-তে পাঠায়।",
      feature2Title: "স্বয়ংক্রিয় স্মার্ট SMS এক্সট্রাকশন",
      feature2Desc: "আমাদের স্মার্ট পার্সার ম্যানুয়াল এনট্রি ছাড়াই স্বয়ংক্রিয়ভাবে ট্রানজেকশন আইডি (TrxID), প্রেরকের ফোন নম্বর, পরিমাণ এবং প্রোভাইডার শনাক্ত করে।",
      feature3Title: "ইনস্ট্যান্ট মার্চেন্ট ওয়েবহুক ও এপিআই কানেকশন",
      feature3Desc: "আপনার ওয়ার্ডপ্রেস বা কাস্টম ই-কমার্স চেকআউটে সরাসরি রিয়েল-টাইম নোটিফিকেশন পান। নিমেষেই পেমেন্ট ভেরিফাই করুন।",
      howTitle: "সহজ এবং আধুনিক স্বয়ংক্রিয় কার্যপ্রণালী",
      howHeading: "PayPulse SMS গেটওয়ে যেভাবে কাজ করে",
      step1Title: "১. স্মার্টফোন নোড সেটআপ",
      step1Desc: "আপনার মার্চেন্ট অ্যান্ড্রয়েড ফোনে আমাদের অ্যাপ ইনস্টল করুন এবং নিরাপদ টোকেন দিয়ে ডিভাইস কানেক্ট করুন।",
      step2Title: "২. পেমেন্ট SMS রিসিভ",
      step2Desc: "কাস্টমার বিকাশ, নগদ, রকেট বা ব্যাংকে পেমেন্ট সম্পন্ন করলে আপনার ফোনে অফিশিয়াল পেমেন্ট কনফার্মেশন এসএমএস আসবে।",
      step3Title: "৩. রিয়েল-টাইম স্মার্ট পার্সিং",
      step3Desc: "PayPulse স্মার্ট পার্সার মিলি-সেকেন্ডের মধ্যে Transaction ID, Amount, Customer Phone এবং তারিখ পৃথক করবে।",
      step4Title: "৪. ওয়েবহুক পুশ ও অর্ডার পেইড",
      step4Desc: "সাব-সেকেন্ড ওয়েবহুক কলব্যাক আপনার ওয়েবসাইটে চলে যাবে এবং ডাটাবেজে অর্ডারটি স্বয়ংক্রিয়ভাবে Paid হয়ে যাবে।",
      demoHeading: "ইন্টারেক্টিভ গেটওয়ে স্যান্ডবক্স ডেমো",
      demoSub: "একটি টেস্ট পেমেন্ট এসএমএস সিমুলেট করুন এবং সরাসরি রিয়েল-টাইম ভেরিফিকেশন পাইপলাইন পরীক্ষা করুন।",
      simBtn: "পেমেন্ট SMS সিমুলেট ও অর্ডার ভেরিফাই করুন",
      randomBtn: "নতুন ট্রানজেকশন আইডি তৈরি করুন",
      footerText: "© ২০২৬ PayPulse Inc. সর্বস্বত্ব সংরক্ষিত।",
      devicesUnit: "ডিভাইস",
      storesUnit: "স্টোর",
      smsUnit: "এসএমএস",
      requestsUnit: "রিকোয়েস্ট",
    },
  }[lang];

  const handleGenerateRandomTrx = () => {
    const chars = "ABCDEF0123456789";
    let result = "9B";
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setDemoTrxId(result);
  };

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setSimulationState({ step: 1, provider: demoProvider });

    setTimeout(() => {
      setSimulationState({ step: 2, provider: demoProvider });
      setTimeout(() => {
        setSimulationState({ step: 3, provider: demoProvider });
        setTimeout(() => {
          setSimulationState({
            step: 4,
            trx_id: demoTrxId,
            amount: demoAmount,
            phone: demoPhone,
            provider: demoProvider,
          });
          setIsSimulating(false);
        }, 800);
      }, 800);
    }, 800);
  };

  // Fallback demo packages if backend packages array is empty
  const displayPackages: Package[] =
    packages.length > 0
      ? packages
      : [
          {
            id: 1,
            name: lang === "bn" ? "স্টার্টার মার্চেন্ট" : "Starter Merchant",
            slug: "starter",
            price: 19,
            billing_cycle: "monthly",
            validity_days: 30,
            device_limit: 1,
            website_limit: 2,
            sms_limit: 5000,
            verification_limit: 10000,
            features:
              lang === "bn"
                ? [
                    "১টি অ্যান্ড্রয়েড ডিভাইস ইনজেসশন নোড",
                    "২টি কানেক্টেড মার্চেন্ট স্টোর",
                    "৫,০০০ SMS / মাস প্রসেসিং",
                    "১০,০০০ ভেরিফিকেশন API কল",
                    "স্ট্যান্ডার্ড ওয়েবহুক কলব্যাক",
                    "বিকাশ এবং নগদ অটো পার্সিং",
                  ]
                : [
                    "1 Android Device Ingestion Node",
                    "2 Connected Merchant Stores",
                    "5,000 SMS / Month Processing",
                    "10,000 Verification API Calls",
                    "Standard Webhook Callbacks",
                    "bKash & Nagad Parsing",
                  ],
            is_active: true,
          },
          {
            id: 2,
            name: lang === "bn" ? "গ্রোথ মার্চেন্ট" : "Growth Merchant",
            slug: "growth",
            price: 49,
            billing_cycle: "monthly",
            validity_days: 30,
            device_limit: 3,
            website_limit: 5,
            sms_limit: 25000,
            verification_limit: 50000,
            features:
              lang === "bn"
                ? [
                    "৩টি অ্যান্ড্রয়েড ডিভাইস ইনজেসশন নোড",
                    "৫টি কানেক্টেড মার্চেন্ট স্টোর",
                    "২৫,০০০ SMS / মাস প্রসেসিং",
                    "৫০,০০০ ভেরিফিকেশন API কল",
                    "ইনস্ট্যান্ট ওয়েবহুক রিট্রাই",
                    "বিকাশ, নগদ, রকেট, উপায় পার্সিং",
                    "২৪/৭ প্রায়োরিটি নোড ডায়াগনস্টিকস",
                  ]
                : [
                    "3 Android Device Ingestion Nodes",
                    "5 Connected Merchant Stores",
                    "25,000 SMS / Month Processing",
                    "50,000 Verification API Calls",
                    "Instant Webhook Retries",
                    "bKash, Nagad, Rocket, Upay Parsing",
                    "24/7 Priority Node Diagnostics",
                  ],
            is_active: true,
          },
          {
            id: 3,
            name: lang === "bn" ? "এন্টারপ্রাইজ প্রো" : "Enterprise Pro",
            slug: "enterprise",
            price: 149,
            billing_cycle: "monthly",
            validity_days: 30,
            device_limit: 10,
            website_limit: 20,
            sms_limit: 100000,
            verification_limit: 250000,
            features:
              lang === "bn"
                ? [
                    "১০টি অ্যান্ড্রয়েড ডিভাইস ইনজেসশন নোড",
                    "২০টি কানেক্টেড মার্চেন্ট স্টোর",
                    "১,০০,০০০ SMS / মাস প্রসেসিং",
                    "২,৫০,০০০ ভেরিফিকেশন API কল",
                    "সাব-সেকেন্ড ওয়েবহুক লেটেন্সি",
                    "সকল MFS এবং ব্যাংক SMS ফরম্যাট",
                    "ডেডিকেটেড অ্যাকাউন্ট সাপোর্ট",
                    "কাস্টম SLA গ্যারান্টি",
                  ]
                : [
                    "10 Android Device Ingestion Nodes",
                    "20 Connected Merchant Stores",
                    "100,000 SMS / Month Processing",
                    "250,000 Verification API Calls",
                    "Sub-second Webhook Latency",
                    "All MFS & Bank SMS Formats",
                    "Dedicated Account Support",
                    "Custom SLA Guarantee",
                  ],
            is_active: true,
          },
        ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-600 selection:text-white">
      {/* Background Radial Gradients */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-blue-600/20 via-indigo-600/10 to-transparent blur-3xl opacity-70" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-600/10 blur-3xl opacity-50" />
      </div>

      {/* Top Header Navbar */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-slate-950/80 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform">
              <Shield className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-extrabold text-white tracking-tight">PayPulse</span>
              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">
                Payment Gateway
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-300">
            <a href="#features" className="hover:text-white transition-colors">
              {t.navFeatures}
            </a>
            <a href="#how-it-works" className="hover:text-white transition-colors">
              {t.navHowItWorks}
            </a>
            <a href="#demo" className="hover:text-white transition-colors">
              {t.navDemo}
            </a>
            <a href="#packages" className="hover:text-white transition-colors">
              {t.navPackages}
            </a>
          </nav>

          {/* Language Switcher & Action CTAs */}
          <div className="flex items-center gap-3">
            {/* Language Switcher Toggle */}
            <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-xl">
              <button
                onClick={() => setLang("en")}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                  lang === "en" ? "bg-blue-600 text-white shadow-xs" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                🇺🇸 EN
              </button>
              <button
                onClick={() => setLang("bn")}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                  lang === "bn" ? "bg-blue-600 text-white shadow-xs" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                🇧🇩 বাংলা
              </button>
            </div>

            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white hover:bg-slate-900 text-xs hidden sm:inline-flex">
                {t.navLogin}
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-blue-600/30 gap-1">
                <span>{t.navRegister}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-6 animate-pulse">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{t.badge}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight max-w-4xl mx-auto leading-tight">
          {t.heroTitlePrefix} <br className="hidden sm:inline" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
            {t.heroTitleSuffix}
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed">
          {t.heroDescription}
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="#demo">
            <Button size="lg" className="h-12 px-8 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-xl shadow-blue-600/30 gap-2">
              <Play className="w-4 h-4 text-emerald-400" />
              <span>{t.navDemo}</span>
            </Button>
          </a>
          <Link href="/login">
            <Button size="lg" variant="outline" className="h-12 px-8 border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-slate-200 font-semibold text-sm gap-2">
              <ShieldAlert className="w-4 h-4 text-indigo-400" />
              <span>{t.loginDemo}</span>
            </Button>
          </Link>
        </div>

        {/* Demo Credentials Quick Banner */}
        <div className="mt-10 p-4 max-w-xl mx-auto rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-left">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-white">{t.demoAccountTitle}</p>
              <p className="text-[11px] text-slate-400">{t.demoAccountSub}</p>
            </div>
          </div>
          <Link href="/login">
            <Button size="sm" variant="outline" className="text-xs h-8 border-blue-500/40 text-blue-300 hover:bg-blue-500/10">
              {t.tryLogin}
            </Button>
          </Link>
        </div>
      </section>

      {/* MFS Providers Showcase Banner */}
      <section className="relative z-10 py-8 border-y border-slate-800/60 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-6">
            {t.mfsSupportedTitle}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-10 opacity-90">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400 font-extrabold text-sm">
              <span>bKash Merchant</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 font-extrabold text-sm">
              <span>Nagad Merchant</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 font-extrabold text-sm">
              <span>DBBL Rocket</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 font-extrabold text-sm">
              <span>UCB Upay</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-extrabold text-sm">
              <span>Bank SMS (Islami, City, BRAC)</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 1: HOW IT WORKS */}
      <section id="how-it-works" className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-slate-800/60">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">
            {t.howTitle}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-2">
            {t.howHeading}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3 relative overflow-hidden group hover:border-blue-500/50 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-lg">
              <Smartphone className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">{t.step1Title}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">{t.step1Desc}</p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3 relative overflow-hidden group hover:border-indigo-500/50 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold text-lg">
              <Send className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">{t.step2Title}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">{t.step2Desc}</p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3 relative overflow-hidden group hover:border-purple-500/50 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold text-lg">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">{t.step3Title}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">{t.step3Desc}</p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3 relative overflow-hidden group hover:border-emerald-500/50 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-lg">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">{t.step4Title}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">{t.step4Desc}</p>
          </div>
        </div>
      </section>

      {/* SECTION 2: INTERACTIVE MFS DEMO SANDBOX */}
      <section id="demo" className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-slate-800/60">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center justify-center gap-1.5">
            <Sparkles className="w-4 h-4" /> Live Interactive Sandbox
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-2">
            {t.demoHeading}
          </h2>
          <p className="text-sm text-slate-400 mt-3">{t.demoSub}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Demo Controls Card */}
          <div className="lg:col-span-6 p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-2">Select MFS Provider</label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {[
                  { id: "bkash", name: "bKash", color: "text-pink-400 bg-pink-500/10 border-pink-500/30" },
                  { id: "nagad", name: "Nagad", color: "text-orange-400 bg-orange-500/10 border-orange-500/30" },
                  { id: "rocket", name: "Rocket", color: "text-purple-400 bg-purple-500/10 border-purple-500/30" },
                  { id: "upay", name: "Upay", color: "text-amber-400 bg-amber-500/10 border-amber-500/30" },
                  { id: "bank", name: "Bank", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" },
                ].map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setDemoProvider(p.id as any)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                      demoProvider === p.id ? p.color + " ring-2 ring-blue-500/50" : "bg-slate-950 border-slate-800 text-slate-400"
                    }`}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-slate-300 font-semibold">Customer Mobile Phone</label>
                <Input
                  type="text"
                  value={demoPhone}
                  onChange={(e) => setDemoPhone(e.target.value)}
                  className="mt-1 font-mono text-xs bg-slate-950 border-slate-800 text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold">Payment Amount (BDT)</label>
                <Input
                  type="text"
                  value={demoAmount}
                  onChange={(e) => setDemoAmount(e.target.value)}
                  className="mt-1 font-mono text-xs bg-slate-950 border-slate-800 text-white"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs text-slate-300 font-semibold">Transaction ID (TrxID)</label>
                <button
                  onClick={handleGenerateRandomTrx}
                  className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1 font-mono"
                >
                  <RefreshCcw className="w-3 h-3" />
                  <span>{t.randomBtn}</span>
                </button>
              </div>
              <Input
                type="text"
                value={demoTrxId}
                onChange={(e) => setDemoTrxId(e.target.value)}
                className="font-mono text-xs bg-slate-950 border-slate-800 text-blue-400 font-bold"
              />
            </div>

            <Button
              onClick={handleRunSimulation}
              disabled={isSimulating}
              className="w-full h-12 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs gap-2 shadow-lg shadow-emerald-600/25"
            >
              <Play className="w-4 h-4 text-emerald-200" />
              <span>{isSimulating ? "Processing Real-Time Verification..." : t.simBtn}</span>
            </Button>
          </div>

          {/* Live Pipeline Visualizer */}
          <div className="lg:col-span-6 p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center justify-between border-b border-slate-800 pb-3">
              <span>Real-Time Verification Pipeline Log</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Status: Live WebSocket Active
              </span>
            </h3>

            {simulationState ? (
              <div className="space-y-3 font-mono text-xs">
                {/* Step 1 */}
                <div
                  className={`p-3 rounded-xl border ${
                    simulationState.step >= 1
                      ? "bg-slate-900 border-blue-500/40 text-blue-300"
                      : "bg-slate-950 border-slate-800 text-slate-600"
                  } flex items-center gap-3`}
                >
                  <Smartphone className="w-4 h-4 text-blue-400 shrink-0" />
                  <div className="flex-1">
                    <p className="font-bold">Step 1: SMS Node Ingested</p>
                    <p className="text-[11px] text-slate-400 font-sans">
                      Received SMS from {demoProvider.toUpperCase()} on Android Device Node #1
                    </p>
                  </div>
                  {simulationState.step >= 1 && <CheckCircle2 className="w-4 h-4 text-blue-400" />}
                </div>

                {/* Step 2 */}
                <div
                  className={`p-3 rounded-xl border ${
                    simulationState.step >= 2
                      ? "bg-slate-900 border-indigo-500/40 text-indigo-300"
                      : "bg-slate-950 border-slate-800 text-slate-600"
                  } flex items-center gap-3`}
                >
                  <Zap className="w-4 h-4 text-indigo-400 shrink-0" />
                  <div className="flex-1">
                    <p className="font-bold">Step 2: Smart AI Engine Extracted</p>
                    <p className="text-[11px] text-slate-400 font-sans">
                      TrxID: <span className="text-blue-300">{demoTrxId}</span> | Amount: <span className="text-emerald-400">৳{demoAmount}</span>
                    </p>
                  </div>
                  {simulationState.step >= 2 && <CheckCircle2 className="w-4 h-4 text-indigo-400" />}
                </div>

                {/* Step 3 */}
                <div
                  className={`p-3 rounded-xl border ${
                    simulationState.step >= 3
                      ? "bg-slate-900 border-purple-500/40 text-purple-300"
                      : "bg-slate-950 border-slate-800 text-slate-600"
                  } flex items-center gap-3`}
                >
                  <Server className="w-4 h-4 text-purple-400 shrink-0" />
                  <div className="flex-1">
                    <p className="font-bold">Step 3: Instant Real-Time Sync</p>
                    <p className="text-[11px] text-slate-400 font-sans">
                      Emitted live payment notification event via WebSocket channel
                    </p>
                  </div>
                  {simulationState.step >= 3 && <CheckCircle2 className="w-4 h-4 text-purple-400" />}
                </div>

                {/* Step 4 */}
                <div
                  className={`p-3 rounded-xl border ${
                    simulationState.step >= 4
                      ? "bg-emerald-950/60 border-emerald-500/60 text-emerald-300"
                      : "bg-slate-950 border-slate-800 text-slate-600"
                  } flex items-center gap-3`}
                >
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div className="flex-1">
                    <p className="font-bold text-emerald-400">Step 4: Webhook Delivered (HTTP 200)</p>
                    <p className="text-[11px] text-emerald-200/80 font-sans">
                      Merchant Order #8412 automatically updated status to <span className="font-bold text-emerald-300">PAID</span>
                    </p>
                  </div>
                  {simulationState.step >= 4 && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-slate-500 text-xs space-y-2">
                <Play className="w-8 h-8 text-slate-700 mx-auto" />
                <p>Click "Simulate Payment SMS & Verify Order" to start the live pipeline test.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Packages & Pricing Section */}
      <section id="packages" className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">
            {t.packagesSubTitle}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-2">
            {t.packagesTitle}
          </h2>
          <p className="text-sm text-slate-400 mt-3">
            {t.packagesDesc}
          </p>
        </div>

        {/* Packages Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayPackages.map((pkg) => {
            const isPopular = pkg.slug === "growth" || pkg.name.toLowerCase().includes("growth") || pkg.name.includes("গ্রোথ");
            const finalPrice = pkg.price;

            return (
              <div
                key={pkg.id}
                className={`relative flex flex-col rounded-3xl p-6 transition-all duration-300 ${
                  isPopular
                    ? "bg-slate-900 border-2 border-blue-500/80 shadow-2xl shadow-blue-500/20 scale-105 z-20"
                    : "bg-slate-900/60 border border-slate-800 hover:border-slate-700"
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[11px] font-extrabold uppercase tracking-wider shadow-lg whitespace-nowrap">
                    {t.mostPopular}
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-xl font-bold text-white">{pkg.name}</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {t.idealMerchant}
                  </p>

                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-white">
                      {formatCurrency(finalPrice)}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">{t.perMonth}</span>
                  </div>
                </div>

                {/* Resource Quota Badges */}
                <div className="grid grid-cols-2 gap-2 mb-6 p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 font-medium">Android Nodes</span>
                    <span className="font-bold text-blue-400">{pkg.device_limit} {t.devicesUnit}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 font-medium">Websites</span>
                    <span className="font-bold text-blue-400">{pkg.website_limit} {t.storesUnit}</span>
                  </div>
                  <div className="flex flex-col mt-1">
                    <span className="text-[10px] text-slate-400 font-medium">SMS Limit</span>
                    <span className="font-bold text-emerald-400">{formatNumber(pkg.sms_limit)} {t.smsUnit}</span>
                  </div>
                  <div className="flex flex-col mt-1">
                    <span className="text-[10px] text-slate-400 font-medium">API Calls</span>
                    <span className="font-bold text-emerald-400">{formatNumber(pkg.verification_limit)} {t.requestsUnit}</span>
                  </div>
                </div>

                {/* Features List */}
                <div className="flex-1 space-y-3 mb-6 text-xs text-slate-300">
                  <span className="font-semibold text-slate-400 uppercase tracking-wider text-[10px] block mb-2">
                    {t.includedFeatures}
                  </span>
                  {(pkg.features || [
                    "Multi-device Node Ingestion",
                    "Webhooks & REST APIs",
                    "24/7 Service Monitoring",
                  ]).map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2.5">
                      <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-blue-400">
                        <Check className="w-3 h-3" />
                      </div>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                {/* Buy / Register CTA */}
                <Link href={`/register?plan=${pkg.slug}`}>
                  <Button
                    className={`w-full h-11 font-bold text-xs gap-2 rounded-xl shadow-lg transition-all ${
                      isPopular
                        ? "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30"
                        : "bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
                    }`}
                  >
                    <span>{t.buyRegister}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* Platform Features Grid */}
      <section id="features" className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/60">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">
            {t.featuresSubTitle}
          </span>
          <h2 className="text-3xl font-extrabold text-white tracking-tight mt-2">
            {t.featuresTitle}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="bg-slate-900/60 border-slate-800">
            <CardContent className="p-6 space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">{t.feature1Title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {t.feature1Desc}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/60 border-slate-800">
            <CardContent className="p-6 space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">{t.feature2Title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {t.feature2Desc}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/60 border-slate-800">
            <CardContent className="p-6 space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-400">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">{t.feature3Title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {t.feature3Desc}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800/80 bg-slate-950 py-12 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-white font-bold">
              <Shield className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-white text-sm">PayPulse Payment Gateway</span>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <Link href="/login" className="hover:text-slate-300">
              {t.navLogin}
            </Link>
            <Link href="/register" className="hover:text-slate-300">
              {t.navRegister}
            </Link>
            <a href="#how-it-works" className="hover:text-slate-300">
              {t.navHowItWorks}
            </a>
            <a href="#demo" className="hover:text-slate-300">
              {t.navDemo}
            </a>
            <a href="#packages" className="hover:text-slate-300">
              {t.navPackages}
            </a>
          </div>

          <p>{t.footerText}</p>
        </div>
      </footer>
    </div>
  );
}
