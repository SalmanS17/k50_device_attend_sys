# K50 Attendance Hub

A real-time employee attendance tracking system powered by ZKTeco K50 device with Supabase backend and React frontend.

## 📋 Features

- 📊 **Real-time Dashboard** - Live attendance tracking with daily statistics
- 📱 **K50 Device Integration** - Automatic sync from ZKTeco K50 devices
- 📅 **Date Filtering** - View attendance records by date range
- 👥 **Employee Management** - Track employees across departments
- 🎯 **Attendance Status** - Track on-time, late, and absent records
- 🔄 **Auto Sync** - Background service syncs attendance every 5 minutes
- 📈 **Analytics** - Dashboard stats (present, absent, late arrivals)

## 🛠️ Tech Stack

- **Frontend**: React + TypeScript + Vite
- **UI Components**: shadcn/ui + Radix UI
- **Styling**: Tailwind CSS
- **Backend**: Node.js + Supabase
- **Database**: PostgreSQL (Supabase)
- **Real-time**: Supabase Realtime

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- npm or bun
- Supabase account
- ZKTeco K50 device on network

### Installation

```bash
# Install frontend dependencies
npm install

# Install backend sync service
npm run sync:install
```

### Configuration

Create `.env` with your settings:

```env
# Supabase
VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="your-public-key"

# K50 Device
K50_DEVICE_IP="192.168.1.100"
K50_DEVICE_PORT="8080"
SYNC_INTERVAL="300000"
```

### Running

**Frontend only:**
```bash
npm run dev
```

**Backend sync service:**
```bash
npm run sync:start
```

**Both together (Linux/Mac):**
```bash
./start-dev.sh
```

**Both together (Windows):**
```bash
start-dev.bat
```

## 📂 Project Structure

```
k50-attendance-hub/
├── src/
│   ├── components/          # React components
│   │   ├── K50DeviceStatus.tsx
│   │   ├── AttendanceTable.tsx
│   │   ├── DashboardLayout.tsx
│   │   └── ui/              # shadcn/ui components
│   ├── pages/               # Page components
│   ├── hooks/               # React hooks
│   ├── lib/                 # Utilities
│   │   └── k50-utils.ts    # K50 device utilities
│   └── integrations/        # External integrations
│       └── supabase/        # Supabase client
├── server/                  # Backend sync service
│   ├── k50-sync.js        # Main sync service
│   ├── config.js          # Configuration
│   └── test-connection.js # Connection tester
├── supabase/               # Database migrations
├── K50_SETUP.md           # Detailed K50 setup guide
├── QUICK_START.md         # Quick reference
└── SETUP_COMPLETE.md      # Setup summary
```

## 📖 Documentation

- **[QUICK_START.md](./QUICK_START.md)** - 5-minute quick start guide
- **[K50_SETUP.md](./K50_SETUP.md)** - Comprehensive setup and troubleshooting
- **[SETUP_COMPLETE.md](./SETUP_COMPLETE.md)** - Complete setup summary
- **[server/README.md](./server/README.md)** - Backend service documentation

## 🔧 Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start frontend dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run sync:install` | Install backend dependencies |
| `npm run sync:start` | Start sync service |
| `npm run sync:dev` | Start sync with logs |
| `npm run sync:test` | Test K50 device connectivity |
| `npm run lint` | Run ESLint |
| `npm run test` | Run tests |

## 🔌 K50 Device Integration

The system includes an automated sync service (`server/k50-sync.js`) that:

1. Connects to your K50 device via HTTP API
2. Fetches latest attendance records
3. Syncs them to Supabase database
4. Updates the dashboard in real-time

**Sync runs every 5 minutes** (configurable via `SYNC_INTERVAL`)

### Testing Connection

```bash
npm run sync:test
```

This runs diagnostics to verify:
- Network connectivity to device
- API endpoint availability
- Supabase connectivity
- Configuration validity

## 📊 Database Schema

### Employees Table
```sql
CREATE TABLE employees (
  id UUID PRIMARY KEY,
  user_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  department TEXT NOT NULL,
  designation TEXT,
  created_at TIMESTAMP
);
```

### Attendance Table
```sql
CREATE TABLE attendance (
  id UUID PRIMARY KEY,
  user_id TEXT NOT NULL,
  check_time TIMESTAMP NOT NULL,
  device TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TIMESTAMP,
  UNIQUE(user_id, check_time)
);
```

## 🔐 Security

- Row Level Security (RLS) enabled on all tables
- Public read access for dashboard views
- Authenticated users can insert/update/delete
- Realtime sync for attendance table

## 🚀 Deployment

### Docker

```bash
# Build image
docker build -t k50-attendance-hub .

# Run container
docker run -p 5173:5173 --env-file .env k50-attendance-hub
```

### Vercel / Netlify

1. Push code to GitHub
2. Connect repository to Vercel/Netlify
3. Set environment variables
4. Deploy

For backend sync service:
- Deploy to Heroku, Railway, or own VPS
- Keep `.env` with device credentials
- Service runs continuously in background

## 🐛 Troubleshooting

### No data syncing?

1. Check device connectivity: `npm run sync:test`
2. Verify device IP in `.env`
3. Check Supabase RLS policies
4. Review sync logs: `npm run sync:dev`

### Frontend not showing data?

1. Check Supabase tables have data
2. Verify API connectivity
3. Check browser console for errors
4. Ensure Supabase credentials in `.env`

See [K50_SETUP.md](./K50_SETUP.md#troubleshooting) for detailed troubleshooting.

## 📝 License

MIT

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create feature branch
3. Make changes
4. Submit pull request

## 📞 Support

For issues or questions:
- Check the documentation in `/docs`
- Review troubleshooting guides
- Check backend logs: `npm run sync:dev`
- Verify Supabase project configuration
