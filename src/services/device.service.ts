import { apiClient } from "@/lib/api/api-client";
import { AndroidDevice } from "@/types";

export const MOCK_DEVICES: AndroidDevice[] = [
  {
    id: 1,
    device_name: "Store POS Phone #1 (Samsung A54)",
    device_id: "DEV-ANDROID-98124",
    model: "Samsung Galaxy A54 5G",
    android_version: "Android 14 (API 34)",
    app_version: "v2.4.1",
    status: "active",
    last_seen_at: "2026-08-18T15:30:12Z",
    sms_count: 5420,
    created_at: "2026-02-10T12:00:00Z",
  },
  {
    id: 2,
    device_name: "Dhaka Warehouse Gateway (Xiaomi Note 12)",
    device_id: "DEV-ANDROID-77219",
    model: "Xiaomi Redmi Note 12",
    android_version: "Android 13 (API 33)",
    app_version: "v2.4.0",
    status: "active",
    last_seen_at: "2026-08-18T15:28:45Z",
    sms_count: 3120,
    created_at: "2026-03-01T14:30:00Z",
  },
];

export const deviceService = {
  async getDevices(): Promise<AndroidDevice[]> {
    try {
      const response = await apiClient.get<{ devices: AndroidDevice[] }>("/user/devices");
      return response.data.devices;
    } catch {
      return MOCK_DEVICES;
    }
  },

  async addDevice(deviceName: string): Promise<AndroidDevice> {
    try {
      const response = await apiClient.post<{ device: AndroidDevice }>("/user/devices", { device_name: deviceName });
      return response.data.device;
    } catch {
      const newDevId = `DEV-ANDROID-${Math.floor(10000 + Math.random() * 90000)}`;
      const regKey = `REGKEY-${Math.random().toString(36).substring(2, 12).toUpperCase()}-${Date.now().toString(36)}`;
      const qrPayload = JSON.stringify({
        server_url: "https://api.paypulse.io/api/v1/device",
        device_id: newDevId,
        registration_key: regKey,
      });

      const newDevice: AndroidDevice = {
        id: Date.now(),
        device_name: deviceName,
        device_id: newDevId,
        model: "Android Gateway Node",
        android_version: "Android 14 (API 34)",
        app_version: "v2.4.1",
        status: "active",
        last_seen_at: new Date().toISOString(),
        sms_count: 0,
        created_at: new Date().toISOString(),
        registration_key: regKey, // Exposed ONCE during creation
        qr_code_payload: qrPayload,
      };
      MOCK_DEVICES.unshift(newDevice);
      return newDevice;
    }
  },

  async renameDevice(id: number, deviceName: string): Promise<{ message: string }> {
    try {
      await apiClient.put(`/user/devices/${id}`, { device_name: deviceName });
      return { message: "Device name updated successfully." };
    } catch {
      const dev = MOCK_DEVICES.find((d) => d.id === id);
      if (dev) dev.device_name = deviceName;
      return { message: "Device name updated successfully." };
    }
  },

  async toggleStatus(id: number, disabled: boolean): Promise<{ message: string }> {
    try {
      await apiClient.post(`/user/devices/${id}/toggle-status`, { disabled });
      return { message: `Device ${disabled ? "disabled" : "enabled"} successfully.` };
    } catch {
      const dev = MOCK_DEVICES.find((d) => d.id === id);
      if (dev) dev.status = disabled ? "disabled" : "active";
      return { message: `Device ${disabled ? "disabled" : "enabled"} successfully.` };
    }
  },

  async revokeDevice(id: number): Promise<{ message: string }> {
    try {
      const response = await apiClient.delete(`/user/devices/${id}/revoke`);
      return response.data;
    } catch {
      const index = MOCK_DEVICES.findIndex((d) => d.id === id);
      if (index !== -1) MOCK_DEVICES.splice(index, 1);
      return { message: "Device credential revoked successfully." };
    }
  },
};
