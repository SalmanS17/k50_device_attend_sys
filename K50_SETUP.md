# K50 Device Integration Setup Guide

## Overview

This guide walks you through connecting your ZKTeco K50 attendance device to the K50 Attendance Hub system.

## Architecture

```
┌────────────────┐
│  ZKTeco K50    │
│    Device      │
└────────┬────────┘
         │ HTTP API
         ↓
┌────────────────────────┐
│  K50 Sync Service      │  (Node.js)
│  (server/k50-sync.js)  │
└────────┬───────────────┘
         │ Supabase API
         ↓
┌────────────────────────┐
│  Supabase Database     │
│  (attendance table)    │
└────────┬───────────────┘
         │ Real-time
         ↓
┌────────────────────────┐
│  React Dashboard       │
│  (Attendance Hub UI)   │
└────────────────────────┘
```

## Step 1: Verify K50 Device Network Setup

### Find Your K50 Device IP Address

**Option A: From Device Display**

1. Press Menu on your K50 device
2. Navigate to Network Settings
3. Note the IP address (e.g., 192.168.1.100)

**Option B: From Router**

1. Access your router admin panel
2. Look for connected devices
3. Find the ZKTeco K50 device
4. Note its IP address

**Option C: Network Scanning**

```bash
# Linux/Mac
nmap -p 8080 192.168.1.0/24

# Windows (PowerShell)
1..254 | ForEach-Object {
  Test-NetConnection -ComputerName "192.168.1.$_" -Port 8080 -InformationLevel Quiet
}
```

### Test Device Connectivity

```bash
# Ping the device
ping 192.168.1.100

# Test HTTP endpoint
curl http://192.168.1.100:8080/api/LatestAttLog
```

If successful, you'll see a JSON response with attendance records.

## Step 2: Configure Environment Variables

Edit the `.env` file in the project root:

```env
# K50 Device Configuration
K50_DEVICE_IP="192.168.1.100"        # Your device IP
K50_DEVICE_PORT="8080"               # Device port (check documentation)
SYNC_INTERVAL="300000"               # 5 minutes in milliseconds
```

**Common Port Numbers:**

- `8080` - Most common web interface port
- `5000` - Alternative web port
- `502` - Legacy modbus port
- `161` - SNMP port

## Step 3: Install and Start Sync Service

### Install Dependencies

```bash
npm run sync:install
```

### Start the Service

**Production (background process):**

```bash
npm run sync:start
```

**Development (with logs):**

```bash
npm run sync:dev
```

You should see output like:

```
╔════════════════════════════════════════╗
║  K50 Attendance Synchronization Service║
╚════════════════════════════════════════╝
Supabase URL: https://...
K50 Device: http://192.168.1.100:8080
Sync Interval: 300 seconds
Starting...

[2026-02-25T10:30:45.123Z] Fetching attendance from K50 device...
Found 15 attendance records to sync...
✓ Synced user 1 at 2026-02-25T09:00:00Z
✓ Synced user 2 at 2026-02-25T09:15:00Z
...
[Sync Summary] Success: 15, Errors: 0
```

## Step 4: Map Employee IDs (Optional)

If your K50 device uses different PIN numbers than your employee user_ids:

### In `server/k50-sync.js`, update employee mapping:

```javascript
const employeeMapping = {
  1: "1", // Device PIN 1 → user_id 1
  2: "2",
  100: "5", // Device PIN 100 → user_id 5
  // Add more mappings as needed
};
```

This ensures PIN "100" on the device matches user_id "5" in your database.

## Step 5: Verify Sync is Working

### Check Supabase Dashboard

1. Open [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Tables → attendance**
4. Verify new records appear
5. Check `device` column shows 'K50'

### Check Service Logs

Monitor the sync service output for errors:

```bash
# If running in development
npm run sync:dev

# Look for:
# ✓ Synced {user_id} at {time}
# ✗ Error messages
```

## Step 6: Add K50 Status Widget to Dashboard

### Use in Your Pages

```tsx
import { K50DeviceStatus } from "@/components/K50DeviceStatus";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <K50DeviceStatus
        deviceIp="192.168.1.100"
        devicePort={8080}
        syncInterval={300000}
      />
      {/* ... rest of dashboard ... */}
    </div>
  );
}
```

## Troubleshooting

### Issue: "Cannot connect to K50 device"

**Check network connectivity:**

```bash
ping 192.168.1.100
```

**Check if device requires authentication:**

If you get a 401 (Unauthorized) error, the device needs a password.

1. Find the default admin credentials (check device manual)
   - Common: `admin / 123456` or `admin / 000000`

2. Add to `.env`:

   ```env
   K50_ADMIN_USERNAME="admin"
   K50_ADMIN_PASSWORD="123456"
   ```

3. Test again:
   ```bash
   npm run sync:test
   ```

For more authentication help, see [K50_AUTH_GUIDE.md](./K50_AUTH_GUIDE.md)

**Verify device port:**

- Check K50 manual for correct port
- Try common ports: 8080, 5000, 502

**Verify firewall:**

```bash
# Linux
sudo ufw allow 8080
sudo ufw allow 5000

# Windows (Admin PowerShell)
netsh advfirewall firewall add rule name="K50 Port 8080" dir=in action=allow protocol=tcp localport=8080
```

**Device has no HTTP API?**

If your device doesn't have a web interface, see [K50_AUTH_GUIDE.md](./K50_AUTH_GUIDE.md) for alternatives:

- CSV/XLSX import
- USB data transfer
- MQTT bridge
- Third-party API integration

### Issue: "No records syncing"

**Check device has data:**

```bash
# Test API directly
curl http://192.168.1.100:8080/api/LatestAttLog -v
```

**Verify employee PINs:**

- K50 Device: Employee records with PINs 1, 2, 3...
- Database: Employee records with matching user_ids
- Use `employeeMapping` in k50-sync.js if they don't match

**Check Supabase RLS policies:**

1. Go to Supabase Dashboard
2. Tables → attendance → RLS
3. Ensure "Authenticated users can insert attendance" policy exists

### Issue: "Duplicate records"

This is normal! The sync service uses UPSERT, so it won't create duplicates if run multiple times. Each record is unique by `(user_id, check_time)`.

### Issue: "Wrong timestamps"

K50 devices may have timezone issues. Service handles multiple formats automatically, but check:

1. Device system time is correct
2. Database timezone settings in Supabase
3. Browser timezone for display

## Performance Optimization

### Adjust Sync Interval

In `.env`:

```env
SYNC_INTERVAL="60000"    # 1 minute - more frequent updates
SYNC_INTERVAL="600000"   # 10 minutes - less frequent updates
```

### Batch Processing

For large installations with many devices, consider:

1. Running multiple sync services (one per device)
2. Using message queue (Redis, RabbitMQ)
3. Implementing sync pagination

## Running as Service (Linux/Mac)

### Create systemd service

Create `/etc/systemd/system/k50-sync.service`:

```ini
[Unit]
Description=K50 Attendance Sync Service
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/home/user/k50-attendance-hub-main
ExecStart=/usr/bin/npm --prefix server start
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Enable and start:

```bash
sudo systemctl enable k50-sync
sudo systemctl start k50-sync
sudo systemctl status k50-sync
```

## Docker Deployment

### Build image

```bash
docker build -t k50-sync -f server/Dockerfile .
```

### Run container

```bash
docker run \
  --name k50-sync \
  --env-file .env \
  --restart unless-stopped \
  k50-sync
```

## Next Steps

- [ ] Find K50 device IP address
- [ ] Update `.env` with device details
- [ ] Install and start sync service
- [ ] Verify data in Supabase dashboard
- [ ] Add K50 status widget to dashboard
- [ ] Monitor sync service logs regularly

## Support

For issues:

1. Check service logs: `npm run sync:dev`
2. Verify device API: `curl http://{IP}:{PORT}/api/LatestAttLog`
3. Check Supabase tables and RLS policies
4. Consult K50 device manual for API documentation
