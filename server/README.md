# K50 Attendance Synchronization Service

Automated synchronization service that fetches attendance data from ZKTeco K50 devices and syncs to Supabase.

## Prerequisites

- Node.js 16+
- ZKTeco K50 device on the network
- Supabase project configured
- `.env` file with K50 device credentials

## Installation

```bash
npm run sync:install
```

## Configuration

Update the `.env` file in the root directory with your K50 device details:

```env
K50_DEVICE_IP="192.168.1.100"        # IP address of your K50 device
K50_DEVICE_PORT="8080"               # Port (usually 8080 or 5000)
SYNC_INTERVAL="300000"               # Sync interval in milliseconds (default 5 minutes)

# Optional: Admin credentials if device requires authentication
K50_ADMIN_USERNAME="admin"           # Default is usually "admin"
K50_ADMIN_PASSWORD="123456"          # Check your device manual for default password
```

### Without Authentication

If device doesn't require authentication, simply omit the credentials:

```env
K50_DEVICE_IP="192.168.1.100"
K50_DEVICE_PORT="8080"
SYNC_INTERVAL="300000"
# No credentials needed
```

### With Authentication

If device requires admin login:

```env
K50_DEVICE_IP="192.168.1.100"
K50_DEVICE_PORT="8080"
K50_ADMIN_USERNAME="admin"
K50_ADMIN_PASSWORD="your-password"
```

The service will use **HTTP Basic Authentication** automatically.

### Device Without API Access

If your device doesn't have network API:

- See [K50_AUTH_GUIDE.md](../K50_AUTH_GUIDE.md) for alternative methods
- Options include CSV import, USB data transfer, MQTT bridge

## Running the Service

### Production Mode

```bash
npm run sync:start
```

### Development Mode (with auto-reload)

```bash
npm run sync:dev
```

## How It Works

1. Connects to the ZKTeco K50 device via HTTP API
2. Fetches latest attendance logs
3. Maps device PIN to employee user_id (customizable in k50-sync.js)
4. Syncs records to Supabase `attendance` table
5. Prevents duplicates with UPSERT operation
6. Runs automatically every 5 minutes (configurable)

## Customization

### Employee ID Mapping

If your K50 device PIN doesn't match your system's user_id, edit `employeeMapping` in `k50-sync.js`:

```javascript
const employeeMapping = {
  1: "1", // Device PIN 1 → user_id 1
  2: "2",
  100: "5", // Device PIN 100 → user_id 5
};
```

### API Endpoints

The service automatically tries these endpoints:

- `http://{IP}:{PORT}/api/LatestAttLog`
- `http://{IP}:{PORT}/iclock/api/LatestAttLog`

For other endpoints, modify the `fetchAttendanceFromK50()` function.

## Troubleshooting

### "Cannot connect to K50 device"

- Verify K50 device IP and port in `.env`
- Check device is powered on and connected to network
- Test connectivity: `ping {K50_DEVICE_IP}`

### No records syncing

- Check K50 device API documentation
- Verify employee PIN exists in K50 and in database
- Check Supabase table for RLS policies allowing inserts

### Wrong timestamps

- K50 devices support various timestamp formats
- Service automatically detects: ISO strings, Unix timestamps, custom formats
- Check device time settings match your timezone

## Database Schema

Expected Supabase `attendance` table:

- `id` (UUID)
- `user_id` (TEXT) - Employee ID
- `check_time` (TIMESTAMP) - Clock in/out time
- `device` (TEXT) - Device identifier (K50)
- `status` (TEXT) - on-time, late, etc.
- `created_at` (TIMESTAMP)

## Logs

Service logs include:

- ✓ Successful syncs
- ✗ Errors and failures
- Sync summary (success/error count)
- Connection diagnostics

## Docker Deployment

To run in Docker, create a `Dockerfile`:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY server/package*.json ./
RUN npm install --production
COPY server/k50-sync.js .
COPY .env .
CMD ["node", "k50-sync.js"]
```

Build and run:

```bash
docker build -t k50-sync .
docker run --env-file .env k50-sync
```

## Support

For ZKTeco K50 API documentation, consult the device manual or manufacturer support.
