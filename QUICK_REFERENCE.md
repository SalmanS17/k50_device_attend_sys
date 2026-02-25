# Quick Reference - Running K50 Attendance Hub

## 📋 One-Time Setup (5 minutes)

```bash
# Step 1: Install dependencies
npm install
npm run sync:install

# Step 2: Configure K50 device in .env
# Edit .env and update:
K50_DEVICE_IP="192.168.1.100"      # Your actual device IP
K50_DEVICE_PORT="8080"

# Step 3: Test connection
npm run sync:test
# Should show: ✓ All tests passed!
```

## ▶️ Run the Project

### Option 1: Both Frontend & Backend (Best for Development)

**Linux/Mac:**

```bash
./start-dev.sh
```

**Windows:**

```bash
start-dev.bat
```

**Then open:** http://localhost:5173

### Option 2: Frontend Only (Testing UI)

```bash
npm run dev
# Opens: http://localhost:5173
```

### Option 3: Backend Sync Only

```bash
npm run sync:dev
# Watch logs for sync activity
```

### Option 4: All in Separate Terminals

**Terminal 1 - Frontend:**

```bash
npm run dev
```

**Terminal 2 - Backend:**

```bash
npm run sync:dev
```

**Result:**

- Frontend: http://localhost:5173
- Backend: Syncing every 5 minutes
- Data: Real-time updates

## 🧪 Testing During Development

### Check Device is Reachable

```bash
ping 192.168.1.100
curl http://192.168.1.100:8080/api/LatestAttLog
```

### Test Connection

```bash
npm run sync:test
```

### View Sync Logs

```bash
npm run sync:dev
```

### Check Data in Supabase

1. Open https://app.supabase.com
2. Select project
3. Go to Tables → attendance
4. Should see K50 device records

### Check Data in Frontend

1. Open http://localhost:5173
2. Should show attendance records
3. Try date filter
4. Check employee list

## 🔧 Common Commands

```bash
# Development
npm run dev              # Frontend dev server
npm run sync:dev         # Backend with logs
npm run sync:test        # Test device connection

# Production
npm run build            # Build frontend
npm run sync:start       # Backend production mode

# Combined
./start-dev.sh           # Both (Linux/Mac)
start-dev.bat            # Both (Windows)
```

## ⚙️ Configuration

### Device Connection

```env
K50_DEVICE_IP="192.168.1.100"      # Device IP
K50_DEVICE_PORT="8080"              # Device port
SYNC_INTERVAL="300000"              # Sync every 5 min
```

### With Admin Credentials (If Required)

```env
K50_ADMIN_USERNAME="admin"
K50_ADMIN_PASSWORD="123456"
```

### Supabase (Already Configured)

```env
VITE_SUPABASE_URL="https://..."
VITE_SUPABASE_PUBLISHABLE_KEY="..."
```

## 📊 Check System Status

### Is Frontend Running?

```bash
# Browser check
http://localhost:5173

# Terminal should show
VITE v5... ready in xxx ms
```

### Is Backend Running?

```bash
# Log check
npm run sync:dev
# Should show sync messages every 5 minutes

# Process check
ps aux | grep sync
```

### Is Data Syncing?

```bash
# Check logs
npm run sync:dev
# Look for: ✓ Synced user

# Check Supabase
https://app.supabase.com → attendance table
# Should see recent K50 records
```

## 🐛 Troubleshooting

| Problem              | Solution                        |
| -------------------- | ------------------------------- |
| Device not reachable | `ping 192.168.1.100` - check IP |
| 401 error            | Add credentials to `.env`       |
| No data syncing      | Run `npm run sync:test`         |
| Frontend blank       | Check Supabase connection       |
| Slow sync            | Reduce `SYNC_INTERVAL` to 30000 |

## 📱 Access Points

| Service        | URL                    | Port  |
| -------------- | ---------------------- | ----- |
| Frontend (Dev) | http://localhost:5173  | 5173  |
| Vite HMR       | ws://localhost:24678   | 24678 |
| K50 Device     | http://192.168.1.100   | 8080  |
| Supabase API   | https://...supabase.co | 443   |

## ✅ Success Indicators

- [ ] `npm run sync:test` shows all ✓
- [ ] Frontend opens at localhost:5173
- [ ] Sync logs show "Found X records"
- [ ] Supabase dashboard shows K50 data
- [ ] React dashboard shows records
- [ ] Date filter works

## 📚 More Information

- **Detailed setup:** [RUN_AND_TEST.md](./RUN_AND_TEST.md)
- **Quick start:** [QUICK_START.md](./QUICK_START.md)
- **Complete setup:** [K50_SETUP.md](./K50_SETUP.md)
- **Authentication:** [K50_AUTH_GUIDE.md](./K50_AUTH_GUIDE.md)
- **Backend docs:** [server/README.md](./server/README.md)

---

**Tip:** Keep this open while developing! Print it or bookmark it for quick reference.
