import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, Clock, Wifi, WifiOff } from "lucide-react";
import {
  formatLastSync,
  formatSyncInterval,
  getStatusColor,
} from "@/lib/k50-utils";

interface K50StatusProps {
  deviceIp?: string;
  devicePort?: number;
  syncInterval?: number;
}

export function K50DeviceStatus({
  deviceIp = "192.168.1.100",
  devicePort = 8080,
  syncInterval = 300000,
}: K50StatusProps) {
  const [deviceStatus, setDeviceStatus] = useState<
    "connected" | "disconnected" | "checking"
  >("checking");
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkDevice = async () => {
      try {
        setDeviceStatus("checking");
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(
          `http://${deviceIp}:${devicePort}/api/LatestAttLog`,
          { signal: controller.signal, method: "GET" },
        );

        clearTimeout(timeoutId);

        if (response.ok) {
          setDeviceStatus("connected");
          setLastSync(new Date());
          setError(null);
        } else {
          setDeviceStatus("disconnected");
          setError(`Device returned status ${response.status}`);
        }
      } catch (err) {
        setDeviceStatus("disconnected");
        setError(err instanceof Error ? err.message : "Connection failed");
      }
    };

    checkDevice();
    const interval = setInterval(checkDevice, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [deviceIp, devicePort]);

  const statusConfig = {
    connected: {
      color: "bg-green-100 text-green-800",
      icon: CheckCircle2,
      label: "Connected",
    },
    disconnected: {
      color: "bg-red-100 text-red-800",
      icon: WifiOff,
      label: "Disconnected",
    },
    checking: {
      color: "bg-yellow-100 text-yellow-800",
      icon: Clock,
      label: "Checking...",
    },
  };

  const config = statusConfig[deviceStatus];
  const Icon = config.icon;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Wifi className="w-5 h-5" />
              K50 Device Status
            </CardTitle>
            <CardDescription>
              {deviceIp}:{devicePort}
            </CardDescription>
          </div>
          <Badge variant="outline" className={config.color}>
            <Icon className="w-3 h-3 mr-1" />
            {config.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">
              Last Sync
            </p>
            <p className="text-lg font-semibold">{formatLastSync(lastSync)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">
              Sync Interval
            </p>
            <p className="text-lg font-semibold">
              {formatSyncInterval(syncInterval)}
            </p>
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {deviceStatus === "connected" && (
          <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
            ✓ Device is actively syncing attendance records to the database
          </div>
        )}

        {deviceStatus === "disconnected" && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
            ✗ Unable to connect to device. Check network connection and device
            IP in settings.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
