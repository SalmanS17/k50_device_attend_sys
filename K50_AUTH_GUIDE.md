# K50 Device Authentication & Access Methods

## Scenario 1: Device Requires Admin Credentials ✅ Supported

If your K50 device requires **username and password** to access the API:

### Step 1: Find Default Credentials

Default K50 admin credentials (check your device manual):

```
Username: admin
Password: 123456  (or 000000)
```

### Step 2: Update `.env` File

```env
# K50 Admin Credentials
K50_ADMIN_USERNAME="admin"
K50_ADMIN_PASSWORD="123456"
```

### Step 3: Test Connection

```bash
npm run sync:test
```

The service will use **HTTP Basic Authentication** to connect.

### Step 4: Start Sync

```bash
npm run sync:start
```

The service automatically includes credentials in API requests.

---

## Scenario 2: Device Has No Admin Access Available

If API requires admin access and **you don't have credentials**, you have several alternatives:

### Option A: Export Attendance Data as CSV

**How it works:**

1. Access K50 device directly via USB or web interface
2. Export attendance logs as **CSV/XLSX**
3. Run import script to sync to database

**Setup:**

```bash
# Copy CSV file to server/imports/
cp Attendance_2024.csv server/imports/

# Run import
npm run sync:import
```

**Expected CSV format:**

```csv
PIN,AttTime,Status
1,2026-02-25 09:00:00,In
2,2026-02-25 08:45:00,In
```

### Option B: USB Data Transfer

**Hardware:**

- USB drive connected to K50 device
- Device automatically exports logs to USB daily/hourly

**Setup:**

```bash
# Copy attendance files from USB
cp /mnt/usb/attlog.bin server/uploads/

# Run binary parser (coming in v2)
npm run sync:parse-binary
```

### Option C: MQTT Bridge (IoT Integration)

**Connect via:**

- MQTT protocol (if device supports it)
- Industrial IoT gateway
- Custom webhook from device

**Configuration:**

```env
K50_USE_MQTT=true
MQTT_BROKER="mqtt://broker.ip:1883"
MQTT_TOPIC="k50/attendance"
```

### Option D: Set Default Admin Account on Device

**Steps:**

1. **Reset device to factory settings** (if allowed)
   - Hold reset button for 10 seconds
   - Device returns to default admin/admin

2. **Set your own password:**
   - Access web interface: `http://device-ip:8080`
   - Login with default credentials
   - Change password in Settings
   - Update `.env` with new credentials

3. **Test connection:**
   ```bash
   npm run sync:test
   ```

### Option E: Network Access Without Authentication

**If device allows unauthenticated access:**

The sync service will **automatically try without credentials** if:

1. Initial authenticated request fails (401/403)
2. No credentials are set in `.env`

**Check if this works:**

```bash
# Comment out credentials in .env
# K50_ADMIN_USERNAME="admin"
# K50_ADMIN_PASSWORD="admin"

npm run sync:test
```

---

## Scenario 3: No Network API Available at All

If device has **no HTTP API or web interface** available:

### Option A: USB Reader Application

**What is it:**

- ZKTeco provides USB reader software
- Connects directly to device via USB
- Exports logs to computer

**Steps:**

1. Download ZKTeco AccessControl software
2. Connect device via USB
3. Export attendance logs
4. Run import script

```bash
npm run sync:import < exported_data.csv
```

### Option B: Device Pins on Standalone Device

**If device runs standalone:**

- Device stores data internally
- No network connectivity
- **Solution:** Install network module (DN-TZ1 or similar)
  - Adds Ethernet port
  - Enables HTTP API
  - Allows real-time sync

### Option C: Third-Party Attendance API

**If using different source:**

- School/Office management system
- Common attendance services: **iClock, Biotime, Geoid**

**Setup bridge:**

```bash
# Install translator
npm install @k50-hub/integrations

# Configure in .env
ATTENDANCE_SOURCE="geoid"
GEOID_API_KEY="..."
```

---

## Troubleshooting Authentication Issues

### Issue: 401 Unauthorized

**Symptoms:**

```
✗ Error: Request failed with status code 401
```

**Solutions:**

1. Verify username/password is correct
2. Check device documentation for default credentials
3. Try factory reset if password forgotten
4. Check if user has required permissions

### Issue: 403 Forbidden

**Symptoms:**

```
✗ Error: Request failed with status code 403
```

**Causes:**

- User account doesn't have API access permission
- Device requires different authentication method

**Solutions:**

1. Try different admin account (if multiple available)
2. Check device settings for API/web service permissions
3. Update user role in device settings (if possible)

### Issue: Device Requires SSL/TLS

**Symptoms:**

```
✗ Error: EPROTO / DEPTH_ZERO_SELF_SIGNED_CERT
```

**Solution:**
Add to `.env`:

```env
K50_INSECURE_SSL=true
```

Or in `server/k50-sync.js`:

```javascript
const axiosConfig = {
  httpsAgent: new https.Agent({ rejectUnauthorized: false }),
};
```

### Issue: Session/Token Required

**If device uses JWT/Session tokens:**

Update `.env`:

```env
K50_ADMIN_USERNAME="admin"
K50_ADMIN_PASSWORD="123456"
K50_AUTH_TYPE="bearer"  # or "cookie" or "session"
```

---

## Testing Each Method

### Test API with Credentials

```bash
npm run sync:test
```

Output should show:

```
✓ Basic network connectivity
✓ /api/LatestAttLog - Available (200)
✓ Supabase connectivity
✓ Configuration valid
```

### Test CSV Import

```bash
# Prepare test CSV
cat > test.csv << 'EOF'
PIN,AttTime,Status
1,2026-02-25 09:00:00,In
EOF

# Test import
npm run sync:import test.csv
```

### Test MQTT Bridge

```bash
# If MQTT configured
npm run sync:mqtt
```

---

## Security Best Practices

### Never commit credentials to git:

```bash
# .gitignore
.env
.env.local
.env.*.local
```

### Use environment variables:

```bash
# Instead of hardcoding
export K50_ADMIN_USERNAME="admin"
export K50_ADMIN_PASSWORD="secure123"
npm run sync:start
```

### Rotate passwords regularly:

```
Device → Change admin password quarterly
.env → Update credentials
```

### Limit network exposure:

```
- Use firewall rules
- Enable HTTPS on device (if available)
- Restrict access by IP
- Use VPN for remote access
```

---

## Summary: Quick Decision Tree

```
Does device have HTTP API?
├─ YES → Does it require authentication?
│  ├─ YES → Set K50_ADMIN_USERNAME & K50_ADMIN_PASSWORD
│  └─ NO → Leave blank, sync directly
└─ NO → Choose alternative:
   ├─ CSV/XLSX export → npm run sync:import
   ├─ USB data transfer → Parse with script
   ├─ MQTT available → Configure MQTT bridge
   └─ No options → Install network module
```

---

## Need Help?

Check:

1. Device manual for default credentials
2. Device settings menu → Network/API settings
3. ZKTeco support for your device model
4. Run `npm run sync:test` for detailed diagnostics

Or reach out with error message from logs!
