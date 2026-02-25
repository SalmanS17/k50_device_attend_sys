# Quick Start Guide - K50 Device Integration

## 🚀 5-Minute Setup

### Step 1: Update Configuration

Edit `.env` and set your K50 device details:

```env
K50_DEVICE_IP="192.168.1.100"
K50_DEVICE_PORT="8080"
```

**Does your device require a password?**

If yes, add credentials:

```env
K50_ADMIN_USERNAME="admin"
K50_ADMIN_PASSWORD="123456"
```

See [K50_AUTH_GUIDE.md](./K50_AUTH_GUIDE.md) for help with authentication or no-API scenarios.

### Step 2: Install Backend Dependencies

```bash
npm run sync:install
```

### Step 3: Test Connection

```bash
npm run sync:test
```

Should see: `✓ All tests passed!`

### Step 4: Start Sync Service

```bash
npm run sync:start
```

Should see: `Service running...`

### Step 5: Verify Data

1. Open Supabase dashboard
2. Check `attendance` table for new records
3. Records should have `device: 'K50'`

## 🎯 Common Commands

| Command                | Purpose                           |
| ---------------------- | --------------------------------- |
| `npm run sync:install` | Install backend dependencies      |
| `npm run sync:test`    | Test K50 device connectivity      |
| `npm run sync:start`   | Start sync service (production)   |
| `npm run sync:dev`     | Start sync service (with logs)    |
| `npm run dev`          | Start frontend development server |

## 📊 Both Frontend & Backend

### Linux/Mac:

```bash
chmod +x start-dev.sh
./start-dev.sh
```

### Windows:

```bash
start-dev.bat
```

## 🔍 Troubleshooting Quick Links

**Can't connect to device?**

- Verify IP: `ping 192.168.1.100`
- Check device is powered on
- Try different port (8080, 5000, 502)

**No data syncing?**

- Run: `npm run sync:test`
- Check Supabase RLS policies allow inserts
- Verify employee PINs match user_ids

**Need help?**

- See [K50_SETUP.md](./K50_SETUP.md) for detailed guide
- Check sync service logs for errors
- Review [server/README.md](./server/README.md) for configuration options

## 📁 File Structure

```
.
├── .env                          # Config (K50 device IP, port)
├── K50_SETUP.md                 # Detailed setup guide
├── start-dev.sh                 # Linux/Mac startup script
├── start-dev.bat                # Windows startup script
├── src/
│   ├── lib/k50-utils.ts        # Frontend utilities
│   └── components/
│       └── K50DeviceStatus.tsx   # Status widget
└── server/
    ├── package.json             # Dependencies
    ├── k50-sync.js             # Main sync service
    ├── config.js               # Configuration loader
    ├── test-connection.js      # Connection tester
    └── README.md               # Backend documentation
```

## ✅ Checklist

- [ ] Found K50 device IP address
- [ ] Updated `.env` with device details
- [ ] Ran `npm run sync:install`
- [ ] Ran `npm run sync:test` ✓
- [ ] Started sync service
- [ ] See data in Supabase dashboard
- [ ] Added K50 status widget to dashboard (optional)

Done! 🎉
