# Running and Testing K50 Attendance Hub

Complete guide to install, run, and test the entire project.

## 📋 Prerequisites

- **Node.js** 16+ installed ([download](https://nodejs.org))
- **npm** or **bun** (comes with Node.js)
- **Supabase project** with tables configured
- **K50 device** on your network (optional for testing UI)
- **Git** (to clone or manage code)

**Check versions:**

```bash
node --version    # Should be v16+
npm --version     # Should be v8+
```

---

## 🚀 Step 1: Install Dependencies

### Install Frontend Dependencies

```bash
npm install
```

This installs all React, Vite, and UI components (takes ~2-3 minutes).

**Expected output:**

```
added 502 packages
```

### Install Backend Sync Service

```bash
npm run sync:install
```

This installs the K50 sync service dependencies (takes ~1-2 minutes).

**Expected output:**

```
added 65 packages
```

---

## ⚙️ Step 2: Configure the Project

### 2.1 Update K50 Device Settings

Edit `.env` file with your device details:

```env
# Find your K50 device IP address
K50_DEVICE_IP="192.168.1.100"      # ← CHANGE THIS
K50_DEVICE_PORT="8080"              # ← VERIFY THIS
SYNC_INTERVAL="300000"              # 5 minutes (optional)
```

**How to find your K50 device IP:**

**Option A - From Device Menu:**

1. Press Menu on K50 device
2. Go to System → Network Settings
3. Note the IP address

**Option B - From Router:**

1. Open router admin panel (usually 192.168.1.1)
2. Check Connected Devices
3. Find "ZKTeco" or device name
4. Note the IP

**Option C - Network Scan:**

```bash
# Linux/Mac
nmap -p 8080 192.168.1.0/24 | grep open

# Windows (PowerShell as Admin)
1..254 | % { Test-NetConnection -ComputerName "192.168.1.$_" -Port 8080 -WarningAction SilentlyContinue }
```

### 2.2 Configure Device Authentication (If Required)

If your device requires admin login, uncomment and update:

```env
K50_ADMIN_USERNAME="admin"
K50_ADMIN_PASSWORD="123456"
```

**Find default credentials:**

- Check device manual
- Common defaults: `admin / 123456` or `admin / 000000`
- Try without credentials first (many devices don't require it)

---

## 🧪 Step 3: Test Connection

### Test Device Connectivity

**Before running anything, verify the device is reachable:**

```bash
# Test 1: Ping the device
ping 192.168.1.100

# Test 2: Check if web service responds
curl http://192.168.1.100:8080/

# Test 3: Test API endpoint
curl http://192.168.1.100:8080/api/LatestAttLog
```

Expected: Device responds (doesn't have to be successful JSON, just responding is good)

### Test Connection with Sync Service

```bash
npm run sync:test
```

**This runs comprehensive diagnostics:**

- ✅ Network connectivity to device
- ✅ API endpoint availability
- ✅ Supabase connectivity
- ✅ Configuration validity
- ✅ Authentication (if configured)

**Expected output:**

```
╔═══════════════════════════════════════╗
║  K50 Device Connection Tester         ║
╚═══════════════════════════════════════╝

Device URL: http://192.168.1.100:8080
Timeout: 5000ms

[1/4] Testing basic network connectivity...
✓ Device is responding (Status: 200)

[2/4] Testing API endpoints...
✓ /api/LatestAttLog - Available (Status: 200)
  Data: 42 records found

✓ /iclock/api/LatestAttLog - Available (Status: 200)

[3/4] Testing Supabase connectivity...
✓ Supabase is accessible

[4/4] Checking environment configuration...
✓ K50_DEVICE_IP: 192.168.1.100
✓ K50_DEVICE_PORT: 8080
✓ SUPABASE_URL: https://...

╔═══════════════════════════════════════╗
║  ✓ All tests passed!                  ║
║  Ready to start sync service          ║
╚═══════════════════════════════════════╝
```

**If test fails:**

- ❌ Device not responding → Check IP, ping it
- ❌ API not available → Device may not have HTTP API (see [K50_AUTH_GUIDE.md](./K50_AUTH_GUIDE.md))
- ❌ 401 Unauthorized → Device needs credentials, add them to `.env`
- ❌ Supabase error → Check credentials in `.env`

---

## ▶️ Step 4: Run the Project

Choose one of these options:

### Option A: Run Everything Together (Recommended for Development)

**Linux/Mac:**

```bash
./start-dev.sh
```

**Windows:**

```bash
start-dev.bat
```

This runs both frontend and backend:

- Frontend: http://localhost:5173
- Backend: Running in background
- Logs: Check terminal

### Option B: Run Frontend Only

```bash
npm run dev
```

**Opens:**

- Frontend: http://localhost:5173
- Can view UI and mock data
- No real device data yet

**See the app:**

1. Frontend terminal shows:
   ```
   VITE v5.4.19 ready in xxx ms
   ➜  Local:   http://localhost:5173/
   ```
2. Open browser to http://localhost:5173
3. You'll see the dashboard (with demo data if no sync running)

### Option C: Run Backend/Sync Service Only

```bash
npm run sync:dev
```

Starts the sync service with live logs. Shows every sync attempt:

```
[2026-02-25T14:30:45.123Z] Fetching attendance from K50 device...
Device URL: http://192.168.1.100:8080
Found 15 attendance records to sync...
✓ Synced user 1 at 2026-02-25T09:00:00Z
✓ Synced user 2 at 2026-02-25T09:15:00Z
[Sync Summary] Success: 15, Errors: 0
```

Service will sync every 5 minutes automatically (or as configured in `.env`).

### Option D: Run Backend in Production Mode (Background)

```bash
npm run sync:start
```

Starts sync service in background (no logs in terminal). Check with:

```bash
ps aux | grep k50-sync
```

Stop with:

```bash
pkill -f "k50-sync"
# or Ctrl+C in background
```

---

## ✅ Step 5: Verify Everything is Working

### 5.1 Check Frontend is Running

Open browser: http://localhost:5173

You should see:

- K50 Attendance Hub dashboard
- Empty tables if no device data yet
- Date filter options
- Stats cards (present, absent, late)

### 5.2 Check Sync Service is Running

Check logs:

```bash
# If you ran with npm run sync:dev, check terminal
# Should show sync messages every 5 minutes

tail -f /tmp/backend.log    # If using start-dev.sh
```

### 5.3 Verify Data in Supabase

1. Open [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Tables → attendance**
4. Check for records:
   - Column `device` should show `K50`
   - Column `check_time` should have today's timestamps
   - Column `user_id` should match employee IDs

**If no data:**

- Check sync logs for errors
- Verify device has attendance records
- Run `npm run sync:test` to diagnose

### 5.4 Check Employee Data

In Supabase:

1. Go to **Tables → employees**
2. Should see 15 test employees:
   - Ali Khan, Sara Ahmed, Hassan Raza, etc.
   - Departments: Accounts, Engineering, HR, etc.

---

## 🔄 How the Data Flows

```
Device → (every 5 min) → Sync Service → Supabase ← React App (real-time)
                            ↓
                           Logs
```

**Example workflow:**

1. 09:00 - Employee checks in on K50 device ✓
2. 09:05 - Sync service fetches from device ✓
3. 09:05 - Data saved to Supabase ✓
4. 09:05 - Dashboard updates (real-time) ✓

---

## 🧪 Testing Scenarios

### Scenario 1: Test Without Device (UI Only)

Perfect for development/testing UI without a real device.

**Setup:**

```bash
# Just run frontend (no sync needed)
npm run dev
```

**Test:**

1. Open http://localhost:5173
2. UI shows mock data from database
3. Date filter works
4. Employee list loads

**Note:** Data comes from Supabase (pre-populated with test employees)

### Scenario 2: Test with Device (Full End-to-End)

Testing actual device integration.

**Setup:**

```bash
# Terminal 1: Run frontend
npm run dev

# Terminal 2: Run sync service
npm run sync:dev
```

**Test steps:**

1. Check device has employees (PIN 1-15 or as configured)
2. Have employees do check-ins on K50 device
3. Watch sync service logs for: `✓ Synced user X`
4. Open dashboard, see new records appear
5. Filter by date, check records match

**Expected result:**

- Sync service logs show "Found X records"
- Supabase dashboard shows new attendance entries
- React dashboard shows the data

### Scenario 3: Test Authentication

If device requires admin credentials.

**Setup:**

```bash
# Edit .env
K50_ADMIN_USERNAME="admin"
K50_ADMIN_PASSWORD="123456"

# Test
npm run sync:test
```

**You should see:**

```
Using admin credentials for authentication...
✓ API endpoints accessible
```

---

## 📊 Common Commands Reference

### Frontend Commands

```bash
npm run dev              # Start dev server (localhost:5173)
npm run build            # Build for production
npm run preview          # Preview production build
npm run lint             # Check code quality
npm run test             # Run unit tests
npm run test:watch       # Run tests in watch mode
```

### Sync Service Commands

```bash
npm run sync:install     # Install backend dependencies
npm run sync:test        # Test device connection
npm run sync:dev         # Start with live logs
npm run sync:start       # Start in production mode
```

### Combined Commands

```bash
./start-dev.sh           # Run both (Linux/Mac)
start-dev.bat            # Run both (Windows)
```

---

## 🐛 Troubleshooting During Testing

### Issue: Frontend Loads But No Data

**Possible causes:**

1. Sync service not running
2. Supabase connection issue
3. Employee/attendance tables empty

**Debug:**

```bash
# Check if sync is running
ps aux | grep sync

# Check sync logs
npm run sync:dev

# Check Supabase tables manually
# Open Supabase dashboard → Tables
```

### Issue: Sync Service Fails to Connect

**Possible causes:**

1. Wrong K50 device IP
2. Device is offline
3. Firewall blocking connection

**Debug:**

```bash
# Test ping
ping 192.168.1.100

# Test device API
curl http://192.168.1.100:8080/api/LatestAttLog

# Run full diagnostic
npm run sync:test
```

### Issue: 401/403 Authentication Error

**Possible causes:**

1. Device requires credentials (not set in .env)
2. Wrong username/password

**Fix:**

```env
# Edit .env with correct credentials
K50_ADMIN_USERNAME="admin"
K50_ADMIN_PASSWORD="correct-password"
```

### Issue: Duplicate or Wrong Data

**Check:**

1. Employee ID mapping (if PIDs don't match user_ids)
2. Timestamp timezone settings
3. Check `employeeMapping` in `server/k50-sync.js`

---

## 📈 Performance Tips

### For Development

```bash
# Use watch mode for tests
npm run test:watch

# Use dev server with hot reload
npm run dev
```

### For Testing with Device

```bash
# Reduce sync interval for faster testing
SYNC_INTERVAL="30000" npm run sync:dev  # 30 seconds

# Or edit .env
K50_INTERVAL="30000"  # 30 seconds instead of 5 minutes
```

### For Production

```bash
# Build optimized version
npm run build

# Deploy built files (./dist)
# Keep sync service running in background
npm run sync:start
```

---

## 🚀 Next Steps After Testing

1. **Verify everything works:**
   - [ ] Frontend loads
   - [ ] Device connects
   - [ ] Data syncs to Supabase
   - [ ] Dashboard shows data

2. **Configure for your team:**
   - [ ] Update employee list
   - [ ] Map K50 device PINs to user_ids (if different)
   - [ ] Set correct sync interval
   - [ ] Configure backup/export schedule

3. **Deploy:**
   - [ ] Frontend: Deploy to Vercel/Netlify
   - [ ] Sync service: Keep running on server/VPS
   - [ ] Database: Backup Supabase regularly

4. **Monitor:**
   - [ ] Set up error alerts
   - [ ] Monitor sync logs daily
   - [ ] Check for missed records
   - [ ] Verify data accuracy

---

## ✨ Success Checklist

- [ ] Node.js and npm installed
- [ ] Dependencies installed (`npm install`)
- [ ] `.env` configured with K50 device IP
- [ ] Sync test passes (`npm run sync:test`)
- [ ] Frontend running on localhost:5173
- [ ] Sync service running (logs show activity)
- [ ] Data appears in Supabase dashboard
- [ ] Data appears in React dashboard
- [ ] Date filter works
- [ ] Employee list shows

**If all checked:** You're ready to use the system! 🎉

---

## Need Help?

1. **Quick issues:** Check [QUICK_START.md](./QUICK_START.md)
2. **Setup issues:** See [K50_SETUP.md](./K50_SETUP.md)
3. **Auth issues:** See [K50_AUTH_GUIDE.md](./K50_AUTH_GUIDE.md)
4. **Backend issues:** Check [server/README.md](./server/README.md)
5. **Error logs:** Run with `npm run sync:dev` to see detailed logs

---

## Common Error Messages & Fixes

| Error                | Cause                      | Fix                                             |
| -------------------- | -------------------------- | ----------------------------------------------- |
| `ECONNREFUSED`       | Device offline/wrong IP    | Check IP: `ping 192.168.1.100`                  |
| `401 Unauthorized`   | Requires credentials       | Add `K50_ADMIN_USERNAME` & `K50_ADMIN_PASSWORD` |
| `ENOTFOUND`          | DNS/IP wrong               | Verify device IP is correct                     |
| `TIMEOUT`            | Device slow/not responding | Increase `K50_TIMEOUT` in .env                  |
| `No records syncing` | Device has no data         | Check device manually for records               |
| `Empty dashboard`    | No data in Supabase        | Check sync logs, verify sync:test               |

---

Enjoy! 🎉
