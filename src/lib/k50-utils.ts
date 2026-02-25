/**
 * K50 Device Integration Utilities
 * Helper functions for frontend to work with K50 sync service
 */

export interface K50Device {
  ip: string;
  port: number;
  lastSync: Date | null;
  status: "connected" | "disconnected" | "syncing";
  lastError?: string;
}

export interface SyncStatus {
  isRunning: boolean;
  lastSync: Date | null;
  syncInterval: number;
  totalRecordsSynced: number;
  errors: number;
}

/**
 * Format date for display
 */
export const formatLastSync = (date: Date | null): string => {
  if (!date) return "Never";
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  return `${days} day${days > 1 ? "s" : ""} ago`;
};

/**
 * Get K50 device health status
 */
export const getDeviceHealth = (device: K50Device): string => {
  if (device.status === "connected") {
    if (device.lastSync) {
      const timeSinceSync = new Date().getTime() - device.lastSync.getTime();
      if (timeSinceSync > 600000) return "warning"; // 10 minutes
      return "healthy";
    }
    return "warning";
  }
  return "error";
};

/**
 * Status badge color mapping
 */
export const getStatusColor = (status: K50Device["status"]): string => {
  switch (status) {
    case "connected":
      return "bg-green-100 text-green-800";
    case "syncing":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-red-100 text-red-800";
  }
};

/**
 * Check if K50 sync service is responding
 */
export const checkDeviceStatus = async (
  ip: string,
  port: number,
  timeout: number = 5000,
): Promise<boolean> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(`http://${ip}:${port}/api/LatestAttLog`, {
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    return false;
  }
};

/**
 * Format sync interval to readable string
 */
export const formatSyncInterval = (ms: number): string => {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
};

/**
 * Attendance record with device source info
 */
export interface AttendanceWithDevice {
  id: string;
  user_id: string;
  employeeName: string;
  check_time: string;
  device: string;
  deviceIp?: string;
  status: string;
  created_at: string;
}

/**
 * Validate K50 configuration
 */
export const validateK50Config = (ip: string, port: number): string[] => {
  const errors: string[] = [];

  // Validate IP
  const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
  if (!ipRegex.test(ip)) {
    errors.push("Invalid IP address format");
  }

  // Validate port range
  if (port < 1 || port > 65535) {
    errors.push("Port must be between 1 and 65535");
  }

  return errors;
};
