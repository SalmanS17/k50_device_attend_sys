# ✅ K50 Backend Integration - Complete Setup Summary

Your K50 Attendance Hub is now fully configured to connect to your ZKTeco K50 device!

## 📦 What Was Created

### Backend Sync Service (`/server`)

- **k50-sync.js** - Main service that syncs attendance data from K50 device
- **config.js** - Configuration loader for environment variables
- **test-connection.js** - Diagnostic tool to verify device connectivity
- **package.json** - Dependencies (axios, supabase, dotenv)
- **README.md** - Detailed backend documentation
- **node_modules/** - All required packages

### Configuration

- **.env** - Updated with K50 device settings
  - `K50_DEVICE_IP` - Device network address
  - `K50_DEVICE_PORT` - Device web service port
  - `SYNC_INTERVAL` - How often to fetch data (default 5 minutes)

### Frontend Components

- **src/lib/k50-utils.ts** - Helper utilities for device integration
- **src/components/K50DeviceStatus.tsx** - Status widget for dashboard

### Documentation

- **K50_SETUP.md** - Comprehensive setup and troubleshooting guide
- **QUICK_START.md** - 5-minute quick start guide
- **server/README.md** - Backend service documentation

### Startup Scripts

- **start-dev.sh** - Linux/Mac script to run frontend + backend together
- **start-dev.bat** - Windows script for same purpose

## 🎯 Next Steps

### 1. **Configure Your Device** (1 minute)

Edit `.env` and set your K50 device details:

```env
K50_DEVICE_IP="192.168.1.100"      # 👈 Change this!
K50_DEVICE_PORT="8080"              # Verify port (usually 8080)
```

**Find your device IP:**

- Check K50 device menu → Network Settings
- Or check your router's connected devices list

### 2. **Test Device Connection** (1 minute)

```bash
npm run sync:test
```

Should output: `✓ All tests passed!`

If it fails, see [K50_SETUP.md](./K50_SETUP.md#troubleshooting)

### 3. **Start Sync Service** (options below)

**Option A: Backend Only**

```bash
npm run sync:start
```

**Option B: Frontend + Backend Together**

```bash
# Linux/Mac
./start-dev.sh

# Windows
start-dev.bat
```

**Option C: Development with Live Reload**

```bash
npm run sync:dev
```

### 4. **Verify Data Flow**

1. Open Supabase Dashboard
2. Go to Tables → attendance
3. Check for new records with `device: 'K50'`

## 📊 How It Works

```
┌─────────────┐
│  K50 Device │ (attendance.csv or API)
└──────┬──────┘
       │ HTTP API
       ↓
┌────────────────────┐
│  k50-sync.js       │ (Node.js service)
│  - Queries device  │
│  - Maps employee   │ Every 5 minutes
│  - Syncs to DB     │
└──────┬─────────────┘
       │ Supabase API
       ↓
┌──────────────────────┐
│  Supabase Database   │
│  attendance table    │
└──────┬───────────────┘
       │ Real-time
       ↓
┌──────────────────────┐
│  React Dashboard     │
│  (Live updates)      │
└──────────────────────┘
```

## 📋 File Structure

```
k50-attendance-hub/
├── .env                           ← UPDATE THIS!
├── QUICK_START.md                (you are here)
├── K50_SETUP.md                  (detailed guide)
├── start-dev.sh                  (run both frontend + backend)
├── start-dev.bat                 (Windows version)
├── package.json                  (updated with sync scripts)
│
├── src/
│   ├── lib/
│   │   └── k50-utils.ts         (device utilities)
│   └── components/
│       └── K50DeviceStatus.tsx   (status widget)
│
└── server/                        (NEW - sync service)
    ├── k50-sync.js              (main service)
    ├── config.js                 (config loader)
    ├── test-connection.js        (tester)
    ├── package.json
    ├── README.md
    └── node_modules/
```

## 🔧 Available Commands

```bash
# Sync Service
npm run sync:install    # Install dependencies (already done)
npm run sync:test       # Test device connectivity
npm run sync:start      # Run sync service
npm run sync:dev        # Run with live reload & logs

# Frontend
npm run dev            # Start Vite dev server
npm run build          # Build for production

# Convenience
./start-dev.sh        # Run both frontend + backend (Linux/Mac)
start-dev.bat         # Run both frontend + backend (Windows)
```

## ⚙️ Configuration Options

In `.env`:

```env
# Device connection
K50_DEVICE_IP="192.168.1.100"      # IP address
K50_DEVICE_PORT="8080"              # Web service port
K50_TIMEOUT="10000"                 # Request timeout in ms

# Sync behavior
SYNC_INTERVAL="300000"              # 5 minutes (in milliseconds)
SYNC_BATCH="100"                    # Records per sync
SYNC_RETRIES="3"                    # Retry failed syncs

# Supabase (already configured)
VITE_SUPABASE_URL="..."
VITE_SUPABASE_PUBLISHABLE_KEY="..."
```

## 🔍 Monitoring & Troubleshooting

### View Sync Logs

```bash
npm run sync:dev
# Watch for:
# ✓ Synced {user_id} - Success
# ✗ Error processing - Issue
```

### Check Supabase Data

1. Supabase Dashboard → attendance table
2. Filter by `device = 'K50'`
3. Check timestamps and employee IDs

### If Nothing Syncs

1. **Run diagnostic:**

   ```bash
   npm run sync:test
   ```

2. **Verify device:**

   ```bash
   ping 192.168.1.100
   curl http://192.168.1.100:8080/api/LatestAttLog
   ```

3. **Check logs:** Look for error messages in sync:dev output

4. **See detailed guide:** [K50_SETUP.md](./K50_SETUP.md#troubleshooting)

## 🎓 Usage Examples

### Add Status Widget to Dashboard

```tsx
import { K50DeviceStatus } from "@/components/K50DeviceStatus";

export function Dashboard() {
  return (
    <div>
      <K50DeviceStatus deviceIp="192.168.1.100" devicePort={8080} />
      {/* Other dashboard content */}
    </div>
  );
}
```

### Map Custom Employee IDs

In `server/k50-sync.js`:

```javascript
const employeeMapping = {
  1: "1", // K50 PIN 1 → system user_id 1
  2: "2",
  100: "5", // K50 PIN 100 → system user_id 5
};
```

## 📞 Support

- **Quick issues?** → See [QUICK_START.md](./QUICK_START.md)
- **Detailed setup?** → See [K50_SETUP.md](./K50_SETUP.md)
- **Backend docs?** → See [server/README.md](./server/README.md)
- **Connection errors?** → Run `npm run sync:test` and check troubleshooting section

## ✅ Setup Checklist

- [ ] Updated `.env` with K50 device IP and port
- [ ] Ran `npm run sync:test` and confirmed ✓
- [ ] Started sync service (`npm run sync:start`)
- [ ] Verified data appears in Supabase dashboard
- [ ] (Optional) Added K50DeviceStatus widget to dashboard

**All done!** 🎉 Your K50 device is now syncing attendance data to your attendance hub!

---

**Need help?** Check the troubleshooting section in [K50_SETUP.md](./K50_SETUP.md) or review the service logs with `npm run sync:dev`.
