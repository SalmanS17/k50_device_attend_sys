import { useState } from "react";
import { format } from "date-fns";
import DashboardLayout from "@/components/DashboardLayout";
import StatsCards from "@/components/StatsCards";
import AttendanceTable from "@/components/AttendanceTable";
import DateFilter from "@/components/DateFilter";
import { useAttendance, useDashboardStats } from "@/hooks/use-attendance";

const Index = () => {
  const [dateFilter, setDateFilter] = useState(format(new Date(), "yyyy-MM-dd"));
  const { stats, isLoading: statsLoading } = useDashboardStats(dateFilter);
  const { data: records = [], isLoading } = useAttendance(dateFilter);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Attendance overview — {format(new Date(), "EEEE, MMMM d, yyyy")}
          </p>
        </div>

        <StatsCards stats={stats} />

        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Attendance Log</h2>
          <DateFilter value={dateFilter} onChange={setDateFilter} />
        </div>

        <AttendanceTable records={records} title="" loading={isLoading} />
      </div>
    </DashboardLayout>
  );
};

export default Index;
