import axios from "axios";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const K50_IP = process.env.K50_DEVICE_IP || "192.168.1.100";
const K50_PORT = process.env.K50_DEVICE_PORT || "8080";
const SYNC_INTERVAL = parseInt(process.env.SYNC_INTERVAL || "300000"); // Default 5 minutes

// Optional admin credentials for K50 device (if required)
const K50_USERNAME = process.env.K50_ADMIN_USERNAME || "";
const K50_PASSWORD = process.env.K50_ADMIN_PASSWORD || "";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const K50_BASE_URL = `http://${K50_IP}:${K50_PORT}`;

// Employee ID mapping if devices IDs differ from system IDs (customize as needed)
const employeeMapping = {
  // Example: '1': '1', '2': '2', etc.
  // Add mappings if ZKTeco device PIN differs from your user_id
};

async function fetchAttendanceFromK50() {
  try {
    console.log(
      `[${new Date().toISOString()}] Fetching attendance from K50 device...`,
    );
    console.log(`Device URL: ${K50_BASE_URL}`);

    // Build request config with optional auth
    const axiosConfig = {
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    };

    // Add Basic Auth if credentials provided
    if (K50_USERNAME && K50_PASSWORD) {
      const credentials = Buffer.from(
        `${K50_USERNAME}:${K50_PASSWORD}`,
      ).toString("base64");
      axiosConfig.headers.Authorization = `Basic ${credentials}`;
      console.log("Using admin credentials for authentication...");
    }

    // Try common ZKTeco API endpoints
    let response;
    try {
      response = await axios.get(
        `${K50_BASE_URL}/api/LatestAttLog`,
        axiosConfig,
      );
    } catch (error) {
      // Try alternate endpoint
      console.log("Trying alternate endpoint...");
      try {
        response = await axios.get(
          `${K50_BASE_URL}/iclock/api/LatestAttLog`,
          axiosConfig,
        );
      } catch (altError) {
        // Try without auth if that failed
        if (K50_USERNAME && K50_PASSWORD) {
          console.log("Auth failed, trying without credentials...");
          delete axiosConfig.headers.Authorization;
          response = await axios.get(
            `${K50_BASE_URL}/iclock/api/LatestAttLog`,
            axiosConfig,
          );
        } else {
          throw altError;
        }
      }
    }

    const records = Array.isArray(response.data)
      ? response.data
      : response.data?.data || response.data?.records || [];

    if (records.length === 0) {
      console.log("No new attendance records found.");
      return;
    }

    console.log(`Found ${records.length} attendance records to sync...`);

    // Sync each record to Supabase
    let successCount = 0;
    let errorCount = 0;

    for (const record of records) {
      try {
        // Map device PIN to system user_id
        const userId =
          employeeMapping[String(record.pin)] || String(record.pin);

        // Parse timestamp - ZKTeco typically uses various formats
        let checkTime;
        if (typeof record.attTime === "string") {
          checkTime = new Date(record.attTime).toISOString();
        } else if (typeof record.att_time === "string") {
          checkTime = new Date(record.att_time).toISOString();
        } else if (typeof record.timestamp === "number") {
          checkTime = new Date(record.timestamp * 1000).toISOString();
        } else {
          checkTime = new Date().toISOString();
        }

        // Determine status based on time if available
        let status = "on-time";
        if (record.status) {
          status = record.status.toLowerCase();
        } else if (record.att_status) {
          status = record.att_status.toLowerCase();
        }

        const { error } = await supabase.from("attendance").upsert(
          {
            user_id: userId,
            check_time: checkTime,
            device: "K50",
            status: status,
          },
          {
            onConflict: "user_id,check_time",
          },
        );

        if (error) {
          console.error(
            `✗ Error syncing record for user ${userId}:`,
            error.message,
          );
          errorCount++;
        } else {
          console.log(`✓ Synced ${userId} at ${checkTime}`);
          successCount++;
        }
      } catch (err) {
        console.error("Failed to process record:", err.message);
        errorCount++;
      }
    }

    console.log(
      `\n[Sync Summary] Success: ${successCount}, Errors: ${errorCount}`,
    );
    console.log(`Next sync in ${SYNC_INTERVAL / 1000} seconds\n`);
  } catch (error) {
    console.error(`✗ K50 Sync Error: ${error.message}`);
    if (error.code === "ECONNREFUSED") {
      console.error(`Cannot connect to K50 device at ${K50_BASE_URL}`);
      console.error("Please check:");
      console.error(`  1. Device IP: ${K50_IP}`);
      console.error(`  2. Device Port: ${K50_PORT}`);
      console.error("  3. Device is powered on and connected to network");
    }
  }
}

// Handle graceful shutdown
process.on("SIGINT", () => {
  console.log("\nShutting down K50 Sync Service...");
  process.exit(0);
});

// Start service
console.log("╔════════════════════════════════════════╗");
console.log("║  K50 Attendance Synchronization Service║");
console.log("╚════════════════════════════════════════╝");
console.log(`Supabase URL: ${SUPABASE_URL}`);
console.log(`K50 Device: ${K50_BASE_URL}`);
console.log(`Sync Interval: ${SYNC_INTERVAL / 1000} seconds`);
console.log("Starting...\n");

// Initial sync
fetchAttendanceFromK50();

// Periodic sync
setInterval(fetchAttendanceFromK50, SYNC_INTERVAL);

console.log("Service running. Press Ctrl+C to stop.");
