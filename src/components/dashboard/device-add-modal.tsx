"use client";

import { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QRCodeSVG } from "qrcode.react";
import { Smartphone, CheckCircle, ShieldAlert, ArrowRight } from "lucide-react";
import { CopySecret } from "@/components/shared/copy-secret";
import { deviceService } from "@/services/device.service";
import { AndroidDevice } from "@/types";

interface DeviceAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function DeviceAddModal({ isOpen, onClose, onSuccess }: DeviceAddModalProps) {
  const [step, setStep] = useState<"input" | "credentials">("input");
  const [deviceName, setDeviceName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [createdDevice, setCreatedDevice] = useState<AndroidDevice | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deviceName.trim()) return;
    setIsLoading(true);
    try {
      const device = await deviceService.addDevice(deviceName);
      setCreatedDevice(device);
      setStep("credentials");
      onSuccess();
    } catch {
      // Handled
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setStep("input");
    setDeviceName("");
    setCreatedDevice(null);
    onClose();
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={handleClose}
      title={step === "input" ? "Register Android Gateway Phone" : "Device Registration Key Generated"}
      description={
        step === "input"
          ? "Connect a physical Android phone to collect and parse incoming financial SMS messages."
          : "Scan the QR code with the PayPulse Gateway Android App or enter credentials manually."
      }
      maxWidth="md"
    >
      {step === "input" ? (
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Device Name / Tag</label>
            <Input
              type="text"
              placeholder="e.g. Dhaka Store POS Phone #1"
              value={deviceName}
              onChange={(e) => setDeviceName(e.target.value)}
              className="mt-1.5"
              required
            />
            <p className="text-[11px] text-slate-400 mt-1">Identify which physical phone collects the messages.</p>
          </div>

          <div className="rounded-xl bg-slate-50 p-4 border border-slate-200 dark:bg-slate-800/60 dark:border-slate-800 space-y-2 text-xs text-slate-600 dark:text-slate-300">
            <h4 className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-blue-500" />
              Quick Setup Overview
            </h4>
            <ol className="list-decimal list-inside space-y-1 pl-1 text-[11px]">
              <li>Install PayPulse Android App APK on target device.</li>
              <li>Grant Notification listener and SMS reading permissions.</li>
              <li>Scan generated QR Code to bind device node to your account.</li>
            </ol>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !deviceName.trim()} className="gap-2">
              {isLoading ? "Generating Key..." : "Generate Registration Key"}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </form>
      ) : (
        <div className="space-y-5 pt-2">
          {/* Security Notice */}
          <div className="flex items-start gap-2.5 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs">
            <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <span>
              <strong>Secret Key Notice:</strong> Save or scan this Registration Key now. For security reasons, the raw secret registration key will not be shown again.
            </span>
          </div>

          {/* QR Code Section */}
          <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/60">
            <div className="p-3 bg-white rounded-xl shadow-xs shrink-0">
              <QRCodeSVG
                value={createdDevice?.qr_code_payload || createdDevice?.registration_key || "DEMO"}
                size={130}
              />
            </div>

            <div className="space-y-2 text-xs w-full min-w-0">
              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-400">Device ID</span>
                <p className="font-mono font-bold text-slate-900 dark:text-slate-100">{createdDevice?.device_id}</p>
              </div>

              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-400">Registration Secret Key</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <code className="font-mono text-xs text-blue-600 dark:text-blue-400 truncate flex-1 bg-white dark:bg-slate-800 p-1.5 rounded border border-slate-200 dark:border-slate-700">
                    {createdDevice?.registration_key}
                  </code>
                  <CopySecret value={createdDevice?.registration_key || ""} label="Registration Key" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button onClick={handleClose} className="gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>Done & Close</span>
            </Button>
          </div>
        </div>
      )}
    </Dialog>
  );
}
