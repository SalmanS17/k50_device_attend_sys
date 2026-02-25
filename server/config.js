/**
 * K50 Device Configuration
 * Load and validate configuration from environment variables
 */

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load from parent directory .env
dotenv.config({ path: path.join(__dirname, '../.env') });

export interface K50Config {
  supabase: {
    url: string;
    key: string;
  };
  device: {
    ip: string;
    port: number;
    timeout: number;
  };
  sync: {
    interval: number;
    batch: number;
    retries: number;
  };
  api: {
    endpoints: string[];
  };
}

// Validate required environment variables
const requiredEnvVars = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_PUBLISHABLE_KEY',
  'K50_DEVICE_IP',
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

// Parse configuration
export const config: K50Config = {
  supabase: {
    url: process.env.VITE_SUPABASE_URL!,
    key: process.env.VITE_SUPABASE_PUBLISHABLE_KEY!,
  },
  device: {
    ip: process.env.K50_DEVICE_IP!,
    port: parseInt(process.env.K50_DEVICE_PORT || '8080', 10),
    timeout: parseInt(process.env.K50_TIMEOUT || '10000', 10),
  },
  sync: {
    interval: parseInt(process.env.SYNC_INTERVAL || '300000', 10),
    batch: parseInt(process.env.SYNC_BATCH || '100', 10),
    retries: parseInt(process.env.SYNC_RETRIES || '3', 10),
  },
  api: {
    endpoints: [
      '/api/LatestAttLog',
      '/iclock/api/LatestAttLog',
      '/api/AttendanceLog',
    ],
  },
};

// Validation
if (config.device.port < 1 || config.device.port > 65535) {
  throw new Error('Invalid port number. Must be between 1 and 65535.');
}

if (config.sync.interval < 10000) {
  throw new Error('Sync interval must be at least 10000ms (10 seconds).');
}

if (config.sync.batch < 1 || config.sync.batch > 1000) {
  throw new Error('Batch size must be between 1 and 1000.');
}

export default config;
