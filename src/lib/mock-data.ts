import { format, subDays, startOfDay, addHours, addMinutes } from "date-fns";

export interface Employee {
  userId: string;
  name: string;
  department: string;
  designation?: string;
}

export interface AttendanceRecord {
  userId: string;
  employeeName: string;
  department: string;
  checkTime: string;
  device: string;
  status: "on-time" | "late" | "absent";
}

export interface DashboardStats {
  totalEmployees: number;
  presentToday: number;
  lateArrivals: number;
  absentToday: number;
}

const DEPARTMENTS = ["Accounts", "Engineering", "HR", "Operations", "Marketing", "Sales"];
const DEVICES = ["K50-Main", "K50-Gate2"];

const EMPLOYEES: Employee[] = [
  { userId: "1", name: "Ali Khan", department: "Accounts", designation: "Senior Accountant" },
  { userId: "2", name: "Sara Ahmed", department: "Engineering", designation: "Software Engineer" },
  { userId: "3", name: "Hassan Raza", department: "HR", designation: "HR Manager" },
  { userId: "4", name: "Fatima Noor", department: "Operations", designation: "Operations Lead" },
  { userId: "5", name: "Omar Sheikh", department: "Marketing", designation: "Marketing Analyst" },
  { userId: "6", name: "Ayesha Malik", department: "Engineering", designation: "Frontend Developer" },
  { userId: "7", name: "Bilal Tariq", department: "Sales", designation: "Sales Executive" },
  { userId: "8", name: "Zainab Hussain", department: "Accounts", designation: "Junior Accountant" },
  { userId: "9", name: "Usman Ghani", department: "Engineering", designation: "Backend Developer" },
  { userId: "10", name: "Mariam Iqbal", department: "HR", designation: "Recruiter" },
  { userId: "11", name: "Kamran Siddiqui", department: "Operations", designation: "Logistics Coordinator" },
  { userId: "12", name: "Nadia Farooq", department: "Marketing", designation: "Content Writer" },
  { userId: "13", name: "Tahir Abbas", department: "Engineering", designation: "DevOps Engineer" },
  { userId: "14", name: "Sana Javed", department: "Sales", designation: "Account Manager" },
  { userId: "15", name: "Rizwan Ali", department: "Accounts", designation: "Finance Director" },
];

function generateAttendanceForDate(date: Date): AttendanceRecord[] {
  const records: AttendanceRecord[] = [];
  const workStart = addHours(startOfDay(date), 9); // 9:00 AM

  EMPLOYEES.forEach((emp) => {
    const isAbsent = Math.random() < 0.1;
    if (isAbsent) return;

    const minutesOffset = Math.floor(Math.random() * 60) - 10; // -10 to +50 min
    const checkTime = addMinutes(workStart, minutesOffset);
    const isLate = minutesOffset > 15;

    records.push({
      userId: emp.userId,
      employeeName: emp.name,
      department: emp.department,
      checkTime: checkTime.toISOString(),
      device: DEVICES[Math.floor(Math.random() * DEVICES.length)],
      status: isLate ? "late" : "on-time",
    });
  });

  return records;
}

// Generate 7 days of data
const allAttendance: AttendanceRecord[] = [];
for (let i = 0; i < 7; i++) {
  allAttendance.push(...generateAttendanceForDate(subDays(new Date(), i)));
}

export function getEmployees(): Employee[] {
  return EMPLOYEES;
}

export function getAttendance(dateFilter?: string): AttendanceRecord[] {
  if (dateFilter) {
    return allAttendance
      .filter((r) => r.checkTime.startsWith(dateFilter))
      .sort((a, b) => new Date(b.checkTime).getTime() - new Date(a.checkTime).getTime());
  }
  return [...allAttendance].sort(
    (a, b) => new Date(b.checkTime).getTime() - new Date(a.checkTime).getTime()
  );
}

export function getTodayAttendance(): AttendanceRecord[] {
  const today = format(new Date(), "yyyy-MM-dd");
  return getAttendance(today);
}

export function getDashboardStats(): DashboardStats {
  const todayRecords = getTodayAttendance();
  const presentIds = new Set(todayRecords.map((r) => r.userId));
  const lateCount = todayRecords.filter((r) => r.status === "late").length;

  return {
    totalEmployees: EMPLOYEES.length,
    presentToday: presentIds.size,
    lateArrivals: lateCount,
    absentToday: EMPLOYEES.length - presentIds.size,
  };
}
