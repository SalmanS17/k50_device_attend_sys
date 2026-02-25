#!/usr/bin/env node

/**
 * K50 Device Connection Tester
 * Tests connectivity to the K50 device before starting sync service
 */

import axios from "axios";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../.env") });

const K50_IP = process.env.K50_DEVICE_IP || "192.168.1.100";
const K50_PORT = process.env.K50_DEVICE_PORT || "8080";
const K50_TIMEOUT = parseInt(process.env.K50_TIMEOUT || "5000", 10);
const K50_USERNAME = process.env.K50_ADMIN_USERNAME || "";
const K50_PASSWORD = process.env.K50_ADMIN_PASSWORD || "";

const K50_BASE_URL = `http://${K50_IP}:${K50_PORT}`;

const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
};

function log(color, text) {
  console.log(`${colors[color]}${text}${colors.reset}`);
}

async function testDeviceConnection() {
  log("cyan", "╔═══════════════════════════════════════╗");
  log("cyan", "║  K50 Device Connection Tester         ║");
  log("cyan", "╚═══════════════════════════════════════╝\n");

  log("blue", `Device URL: ${K50_BASE_URL}`);
  log("blue", `Timeout: ${K50_TIMEOUT}ms\n`);

  // Test 1: Basic connectivity (ping)
  log("yellow", "[1/4] Testing basic network connectivity...");
  try {
    const response = await axios.get(`${K50_BASE_URL}/`, {
      timeout: K50_TIMEOUT,
      validateStatus: () => true,
    });
    log("green", `✓ Device is responding (Status: ${response.status})`);
  } catch (error) {
    if (error.code === "ECONNREFUSED") {
      log("red", `✗ Connection refused - Device is not responding`);
    } else if (error.code === "ENOTFOUND") {
      log("red", `✗ Host not found - Check device IP address`);
    } else {
      log("red", `✗ Error: ${error.message}`);
    }
    log("red", `\nDebugging tips:`);
    log("red", `  - Verify IP: ${K50_IP}`);
    log("red", `  - Verify Port: ${K50_PORT}`);
    log("red", `  - Check device is powered on`);
    log("red", `  - Check network connectivity: ping ${K50_IP}`);
    process.exit(1);
  }

  // Test 2: API endpoint availability
  log("yellow", "\n[2/4] Testing API endpoints...");
  const endpoints = [
    "/api/LatestAttLog",
    "/iclock/api/LatestAttLog",
    "/api/AttendanceLog",
  ];

  // Build auth header if credentials provided
  const axiosConfig = {
    timeout: K50_TIMEOUT,
    validateStatus: () => true,
  };

  if (K50_USERNAME && K50_PASSWORD) {
    const credentials = Buffer.from(`${K50_USERNAME}:${K50_PASSWORD}`).toString(
      "base64",
    );
    axiosConfig.headers = {
      Authorization: `Basic ${credentials}`,
    };
    log("blue", `Using admin credentials for testing...\n`);
  }

  let foundWorkingEndpoint = false;
  for (const endpoint of endpoints) {
    try {
      const response = await axios.get(
        `${K50_BASE_URL}${endpoint}`,
        axiosConfig,
      );

      if (response.status < 500) {
        log("green", `✓ ${endpoint} - Available (Status: ${response.status})`);
        foundWorkingEndpoint = true;

        if (response.status === 200 && response.data) {
          const recordCount = Array.isArray(response.data)
            ? response.data.length
            : response.data?.length || response.data?.data?.length || "unknown";
          log("green", `  Data: ${recordCount} records found`);
        }
      } else {
        log(
          "yellow",
          `⚠ ${endpoint} - Server error (Status: ${response.status})`,
        );
      }
    } catch (error) {
      log("yellow", `⚠ ${endpoint} - Not available`);
    }
  }

  if (!foundWorkingEndpoint) {
    log("red", `\n✗ No working API endpoints found`);
    log("red", `Possible causes:`);
    log("red", `  - K50 web interface is disabled`);
    log("red", `  - Different API path for your device model`);
    log("red", `  - Device requires authentication`);
    process.exit(1);
  }

  // Test 3: Supabase connectivity
  log("yellow", "\n[3/4] Testing Supabase connectivity...");
  const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
  const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    log("red", "✗ Supabase credentials not found in .env");
    log(
      "red",
      "Please set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY",
    );
    process.exit(1);
  }

  try {
    const response = await axios.get(
      `${SUPABASE_URL}/rest/v1/attendance?limit=1`,
      {
        headers: {
          Authorization: `Bearer ${SUPABASE_KEY}`,
          apikey: SUPABASE_KEY,
        },
        timeout: K50_TIMEOUT,
      },
    );
    log("green", `✓ Supabase is accessible`);
  } catch (error) {
    log("red", `✗ Cannot connect to Supabase`);
    log("red", `Error: ${error.message}`);
    log("red", `Check credentials in .env file`);
    process.exit(1);
  }

  // Test 4: Environment check
  log("yellow", "\n[4/4] Checking environment configuration...");
  const checks = [
    { label: "K50_DEVICE_IP", value: K50_IP, required: true },
    { label: "K50_DEVICE_PORT", value: K50_PORT, required: true },
    { label: "SUPABASE_URL", value: SUPABASE_URL, required: true },
    {
      label: "SUPABASE_KEY",
      value: SUPABASE_KEY ? "Set" : "Not set",
      required: true,
    },
    {
      label: "SYNC_INTERVAL",
      value: process.env.SYNC_INTERVAL || "300000 (default)",
      required: false,
    },
  ];

  for (const check of checks) {
    if (check.value) {
      log(
        "green",
        `✓ ${check.label}: ${check.value.toString().substring(0, 50)}`,
      );
    } else if (check.required) {
      log("red", `✗ ${check.label}: Not set (required)`);
    }
  }

  // Success!
  log("green", "\n╔═══════════════════════════════════════╗");
  log("green", "║  ✓ All tests passed!                  ║");
  log("green", "║  Ready to start sync service          ║");
  log("green", "╚═══════════════════════════════════════╝");
  log("cyan", `\nRun: npm run sync:start`);
}

testDeviceConnection().catch((error) => {
  log("red", `\nUnexpected error: ${error.message}`);
  process.exit(1);
});
