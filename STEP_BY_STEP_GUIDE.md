# K50 Attendance Hub - Complete Step-by-Step Setup & Testing

Follow these steps **exactly in order** to get the system running and test everything.

---

## Phase 1: Preparation (10 minutes)

### Step 1.1: Verify Prerequisites

Open a terminal/command prompt and run:

```bash
node --version
# Should show v16.0.0 or higher

npm --version
# Should show v8.0.0 or higher
```

If either fails, install Node.js from https://nodejs.org

### Step 1.2: Navigate to Project Directory

```bash
# On Windows
cd Downloads\k50-attendance-hub-main

# On Mac/Linux
cd ~/Downloads/k50-attendance-hub-main

# Verify you're in the right place
ls
# Should show: src/, server/, .env, package.json, etc.
```

### Step 1.3: Find Your K50 Device IP Address

**You need this before continuing!**

#### Method 1: Check Device Menu (Fastest)

1. Walk to K50 device
2. Press **Menu** button
3. Navigate to **System** → **Network Settings**
4. Look for "IP Address" or "Network Config"
5. Write it down: `192.168.1.___`

#### Method 2: Check Your Router

1. Open router admin panel (usually http://192.168.1.1)
2. Login with your router password
3. Find "Connected Devices" or "DHCP Clients"
4. Look for "ZKTeco" or device name
5. Write it down: `192.168.1.___`

#### Method 3: Network Scan

```bash
# Linux/Mac - Try this in terminal:
nmap -p 8080 192.168.1.0/24 | grep open

# If nmap not installed:
brew install nmap    # Mac
sudo apt install nmap # Linux

# Windows - PowerShell (as Admin):
1..254 | ForEach-Object {
  if (Test-NetConnection -ComputerName "192.168.1.$_" -Port 8080 -WarningAction SilentlyContinue | Select-Object TcpTestSucceeded) {
    Write-Host "Found: 192.168.1.$_"
  }
}
```

**Once you have the IP, write it here:**

```
My K50 Device IP: ___________________
My K50 Device Port: _____________ (Usually 8080)
```

---

## Phase 2: Installation (15 minutes)

### Step 2.1: Install Frontend Dependencies

In your project directory, run:

```bash
npm install
```

**What's happening:**

- Downloads all React, UI, and development packages
- Creates `node_modules/` folder
- Takes 2-3 minutes

**Expected output at the end:**

```
added 502 packages in 2.5s
```

❌ **If stuck:** Kill with Ctrl+C, check your internet, try again

### Step 2.2: Install Backend Dependencies

```bash
npm run sync:install
```

**What's happening:**

- Downloads node.js packages for sync service
- Creates `server/node_modules/`
- Takes 1-2 minutes

**Expected output:**

```
added 65 packages in 1.2s
```

---

## Phase 3: Configuration (5 minutes)

### Step 3.1: Edit Configuration File

Open the `.env` file in your editor (any text editor works):

**Windows:** Right-click `.env` → Open with → Notepad
**Mac:** `open -t .env` in terminal
**Linux:** `nano .env` in terminal

### Step 3.2: Update Device IP

Find this line:

```env
K50_DEVICE_IP="192.168.1.100"
```

Replace `192.168.1.100` with **your actual device IP**:

```env
K50_DEVICE_IP="192.168.1.YOUR_IP"
```

Example - if your device is on 192.168.1.50:

```env
K50_DEVICE_IP="192.168.1.50"
```

### Step 3.3: Verify Device Port

Make sure this line is correct (usually it is):

```env
K50_DEVICE_PORT="8080"
```

If your device uses a different port, change it:

```env
K50_DEVICE_PORT="5000"    # Or whatever port your device uses
```

### Step 3.4: Save the File

Save and close. File should look like:

```env
VITE_SUPABASE_PROJECT_ID="your_project_id"
VITE_SUPABASE_PUBLISHABLE_KEY="your_publishable_key_here"
VITE_SUPABASE_URL="https://your-project-id.supabase.co"

K50_DEVICE_IP="192.168.1.50"        # ← YOUR IP
K50_DEVICE_PORT="8080"
SYNC_INTERVAL="300000"

# K50_ADMIN_USERNAME="admin"        # Leave commented for now
# K50_ADMIN_PASSWORD="admin"
```

---

## Phase 4: Connection Testing (10 minutes)

### Step 4.1: Basic Connectivity Test

Open a new terminal and test if device is reachable:

```bash
ping 192.168.1.50
# Replace 192.168.1.50 with YOUR device IP
```

**Expected:**

```
Pinging 192.168.1.50 ...
Reply from 192.168.1.50: bytes=32 time=5ms TTL=64
```

**If it fails:**

- ❌ Device is offline - turn it on
- ❌ Wrong IP - double-check the device IP
- ❌ Network issue - check WiFi/ethernet connection

### Step 4.2: Test with curl

Test if the device's web service responds:

```bash
curl http://192.168.1.50:8080/
```

**Expected:** Some HTML or response (doesn't matter what exactly)

**If it fails:**

- Device doesn't have HTTP service
- Wrong port - try 5000 instead of 8080
- Firewall blocking - check device settings

### Step 4.3: Comprehensive Connection Test

Now run the full diagnostic:

```bash
npm run sync:test
```

This will test:

1. Network connectivity
2. API endpoints
3. Supabase access
4. Configuration validity

**Expected output:**

```
╔═══════════════════════════════════════╗
║  K50 Device Connection Tester         ║
╚═══════════════════════════════════════╝

Device URL: http://192.168.1.50:8080
Timeout: 5000ms

[1/4] Testing basic network connectivity...
✓ Device is responding (Status: 200)

[2/4] Testing API endpoints...
✓ /api/LatestAttLog - Available (Status: 200)
  Data: 15 records found

[3/4] Testing Supabase connectivity...
✓ Supabase is accessible

[4/4] Checking environment configuration...
✓ K50_DEVICE_IP: 192.168.1.50
✓ K50_DEVICE_PORT: 8080
✓ SUPABASE_URL: https://...
✓ SUPABASE_KEY: (set)

╔═══════════════════════════════════════╗
║  ✓ All tests passed!                  ║
║  Ready to start sync service          ║
╚═══════════════════════════════════════╝

Run: npm run sync:start
```

**If test fails:**

❌ **Connection refused:**

```
Cannot connect to K50 device at http://192.168.1.50:8080
Please check device IP and port
```

**Fix:** Verify correct IP, device is on, port is correct

❌ **401 Unauthorized:**

```
API returned 401 Unauthorized
```

**Fix:** Device needs credentials. Add to .env:

```env
K50_ADMIN_USERNAME="admin"
K50_ADMIN_PASSWORD="123456"
```

❌ **Supabase error:**

```
Cannot connect to Supabase
```

**Fix:** Check Supabase credentials in .env are correct

---

## Phase 5: Run the Project (Second Time Running)

### Step 5.1: Choose Your Setup

Pick **ONE** option below:

#### ✅ Option A: Everything Together (Best)

**On Mac/Linux:**

```bash
./start-dev.sh
```

**On Windows:**

```bash
start-dev.bat
```

This launches both:

- ✅ Frontend on http://localhost:5173
- ✅ Backend syncing in background

**Expected output:**

```
╔════════════════════════════════════════╗
║  K50 Attendance Hub - Development      ║
╚════════════════════════════════════════╝
Configuration:
K50_DEVICE_IP="192.168.1.50"
K50_DEVICE_PORT="8080"
VITE_SUPABASE_URL=...

Starting services...
▶ Starting Frontend (Vite)...
  Frontend PID: 12345
▶ Starting K50 Sync Service...
  Backend PID: 12346

✓ Services started!

Frontend: http://localhost:5173
Sync Service: Running in background
```

Then open browser to: http://localhost:5173

---

#### ✅ Option B: Separate Terminals (More Control)

**Terminal 1 - Start Frontend:**

```bash
npm run dev
```

**Wait for:**

```
VITE v5.4.19  ready in 245 ms

➜  Local:   http://localhost:5173/
```

**Terminal 2 - Start Backend:**

```bash
npm run sync:dev
```

**Wait for:**

```
╔════════════════════════════════════════╗
║  K50 Attendance Synchronization Service║
╚════════════════════════════════════════╝
Supabase URL: https://...
K50 Device: http://192.168.1.50:8080
Sync Interval: 300 seconds
Starting...

Service running. Press Ctrl+C to stop.
```

Then in a browser, open: http://localhost:5173

---

### Step 5.2: Open the Application

In any web browser, go to:

```
http://localhost:5173
```

**You should see:**

- K50 Attendance Hub Title
- Dashboard with stats cards
- Empty attendance table (will fill with data)
- Date filter
- Employee list

---

## Phase 6: Verification Testing

### Step 6.1: Check Frontend is Working

In browser at http://localhost:5173:

- [ ] Page loaded without error
- [ ] Title shows "K50 Attendance Hub"
- [ ] Can see dashboard layout
- [ ] Buttons are clickable
- [ ] Date filter works (try selecting a date)

### Step 6.2: Check Sync Service is Running

In your backend terminal, watch for messages like:

```
[2026-02-25T14:30:45.123Z] Fetching attendance from K50 device...
Found 15 attendance records to sync...
✓ Synced user 1 at 2026-02-25T09:00:00Z
✓ Synced user 2 at 2026-02-25T09:15:00Z
[Sync Summary] Success: 15, Errors: 0
```

**Every 5 minutes** you should see new sync messages.

### Step 6.3: Check Data in Supabase

1. Open https://app.supabase.com
2. Select your project
3. Click **Tables** on left sidebar
4. Click **attendance** table
5. You should see records with:
   - `device` column = "K50"
   - `check_time` = recent timestamps
   - `user_id` = 1, 2, 3, etc.
   - `status` = "on-time"

**Example data in table:**

| id     | user_id | check_time          | device | status  | created_at    |
| ------ | ------- | ------------------- | ------ | ------- | ------------- |
| abc123 | 1       | 2026-02-25 09:00:00 | K50    | on-time | 2026-02-25... |
| def456 | 2       | 2026-02-25 09:15:00 | K50    | on-time | 2026-02-25... |

### Step 6.4: Check Data in Frontend Dashboard

In browser at http://localhost:5173:

- [ ] Attendance table shows records
- [ ] Shows employee names
- [ ] Shows check times
- [ ] Shows attendance status
- [ ] Date filter limits results

**Example dashboard:**

```
Attendance Records

[Date Filter ▼]

Present Today: 12    Late Arrivals: 2    Absent: 1

[Table with columns: Employee, Department, Check Time, Status]
Ali Khan        Accounts       09:00 AM      On-time
Sara Ahmed      Engineering    09:15 AM      On-time
Hassan Raza     HR             09:45 AM      On-time
```

---

## Phase 7: Final Testing

### Step 7.1: Real Device Integration Test (If Device Available)

**On the actual K50 device:**

1. Have an employee do a check-in
2. Wait up to 5 minutes
3. Watch sync service logs - you should see:
   ```
   ✓ Synced user 1 at [timestamp]
   ```
4. Refresh browser dashboard
5. New record should appear

**Great!** System is working end-to-end.

### Step 7.2: Mock Data Test (For Testing Without Device)

If you don't have the device handy right now:

1. First, add some test data directly to Supabase:
   - Go to Supabase dashboard
   - Table: attendance
   - Click "Insert row"
   - Fill in: PIN (user_id), check_time, status
   - Click Save

2. Refresh browser dashboard
3. New record should appear immediately

This verifies the frontend is reading from Supabase correctly.

### Step 7.3: Filter Testing

In the dashboard:

1. Try **Date Filter**
   - Select different dates
   - Records should update

2. Try **Employee List**
   - Click on Employees tab
   - Should show 15 test employees
   - Names, departments, designations

3. Try **Dashboard Stats**
   - Check "Present Today" count
   - Check "Late Arrivals" count
   - Check "Absent" count

---

## Phase 8: Success! 🎉

### Complete Checklist

- [ ] Node.js and npm installed
- [ ] All dependencies installed (`npm install` & `npm run sync:install`)
- [ ] `.env` configured with your K50 device IP
- [ ] `npm run sync:test` shows all ✓ passed
- [ ] Frontend running on http://localhost:5173
- [ ] Backend sync service running (logs show activity)
- [ ] Data visible in Supabase dashboard
- [ ] Data visible in React dashboard
- [ ] Date filter works
- [ ] Employee list loads
- [ ] Real-time sync verified (optional)

**If all checked, you're done!** 🎉

---

## Keeping It Running

### For Development

Keep both terminals open:

```bash
# Terminal 1
npm run dev

# Terminal 2
npm run sync:dev
```

### For Production

Use a single command that runs both:

```bash
./start-dev.sh    # Mac/Linux
start-dev.bat     # Windows
```

Or run separately in background:

```bash
npm run sync:start  # Backend in background
npm run build       # Build frontend
npm run preview     # Run frontend
```

---

## Stop Running Services

### Stop Frontend

- Terminal: Press **Ctrl+C**

### Stop Backend

- Terminal: Press **Ctrl+C**

### Both at Once

- If using start-dev script: Press **Ctrl+C**
- Or close the terminal window

---

## Common Issues & Quick Fixes

| Issue                 | What to Do                               |
| --------------------- | ---------------------------------------- |
| Page blank/no loading | Open browser console (F12), check errors |
| No data showing       | Run `npm run sync:test` to diagnose      |
| Device not found      | Check IP with `ping 192.168.1.X`         |
| 401 error             | Add credentials to `.env`                |
| Data not refreshing   | Check if sync service is running         |
| Can't install         | Check internet, try `npm install` again  |

---

## Next Steps

1. **Keep system running** - Keep both frontend and backend going
2. **Monitor logs** - Check backend logs for any errors
3. **Add real data** - Have employees use K50 device to check in
4. **Verify accuracy** - Check records match device
5. **Deploy** - When ready, deploy frontend and keep backend running

---

**Questions?** Check the other guides:

- [RUN_AND_TEST.md](./RUN_AND_TEST.md) - Detailed reference
- [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) - Command cheat sheet
- [K50_SETUP.md](./K50_SETUP.md) - Setup detailed guide
- [K50_AUTH_GUIDE.md](./K50_AUTH_GUIDE.md) - Authentication help

**You're all set!** 🚀
