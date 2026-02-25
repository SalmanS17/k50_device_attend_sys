import DashboardLayout from "@/components/DashboardLayout";
import AttendanceTable from "@/components/AttendanceTable";
import DateFilter from "@/components/DateFilter";
import { useAttendance } from "@/hooks/use-attendance";
import { useState } from "react";

export default function AttendancePage() {
  const [dateFilter, setDateFilter] = useState("");
  const { data: records = [], isLoading } = useAttendance(dateFilter || undefined);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Attendance Records</h1>
            <p className="text-sm text-muted-foreground mt-1">Complete attendance history from ZKTeco K50</p>
          </div>
          <DateFilter value={dateFilter} onChange={setDateFilter} />
        </div>
        <AttendanceTable records={records} loading={isLoading} />
      </div>
    </DashboardLayout>
  );
}
