import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { AuthProvider } from "@/components/providers/auth-provider";
import { ToastProvider } from "@/components/providers/toast-provider";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "PayPulse | Automated Payment Verification Gateway",
  description:
    "Real-time SMS transaction parsing, Android phone gateway node management, and automated payment verification for bKash, Nagad, Rocket, Upay & Bank SMS.",
  keywords: ["PayPulse", "SMS Payment Gateway", "bKash Automation", "Nagad Payment Verification", "Payment Gateway"],
};

import { RealtimeProvider } from "@/components/providers/realtime-provider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${fontSans.variable} ${fontMono.variable}`}>
      <body className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-50">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <QueryProvider>
            <AuthProvider>
              <RealtimeProvider>
                <ToastProvider>{children}</ToastProvider>
              </RealtimeProvider>
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
