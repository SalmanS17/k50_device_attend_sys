import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Employee {
  id: string;
  user_id: string;
  name: string;
  department: string;
  designation: string | null;
}

export interface AttendanceRecord {
  id: string;
  user_id: string;
  check_time: string;
  device: string;
  status: string;
}

export interface AttendanceWithEmployee extends AttendanceRecord {
  employeeName: string;
  department: string;
}

export interface DashboardStats {
  totalEmployees: number;
  presentToday: number;
  lateArrivals: number;
  absentToday: number;
}

export function useEmployees() {
  return useQuery({
    queryKey: ["employees"],
    queryFn: async (): Promise<Employee[]> => {
      const { data, error } = await supabase
        .from("employees")
        .select("*")
        .order("name");
      if (error) throw error;
      return data;
    },
  });
}

export function useAttendance(dateFilter?: string) {
  return useQuery({
    queryKey: ["attendance", dateFilter],
    queryFn: async (): Promise<AttendanceWithEmployee[]> => {
      let query = supabase
        .from("attendance")
        .select("*")
        .order("check_time", { ascending: false });

      if (dateFilter) {
        const startOfDay = `${dateFilter}T00:00:00`;
        const endOfDay = `${dateFilter}T23:59:59`;
        query = query.gte("check_time", startOfDay).lte("check_time", endOfDay);
      }

      const { data: records, error } = await query;
      if (error) throw error;

      // Fetch employees to map names
      const { data: employees } = await supabase.from("employees").select("*");
      const empMap = new Map(employees?.map((e: Employee) => [e.user_id, e]) ?? []);

      return (records ?? []).map((r) => {
        const emp = empMap.get(r.user_id);
        return {
          ...r,
          employeeName: emp?.name ?? `User ${r.user_id}`,
          department: emp?.department ?? "Unknown",
        };
      });
    },
  });
}

export function useDashboardStats(dateFilter: string) {
  const { data: attendance, isLoading: attLoading } = useAttendance(dateFilter);
  const { data: employees, isLoading: empLoading } = useEmployees();

  const stats: DashboardStats = {
    totalEmployees: employees?.length ?? 0,
    presentToday: 0,
    lateArrivals: 0,
    absentToday: 0,
  };

  if (attendance && employees) {
    const presentIds = new Set(attendance.map((r) => r.user_id));
    stats.presentToday = presentIds.size;
    stats.lateArrivals = attendance.filter((r) => r.status === "late").length;
    stats.absentToday = employees.length - presentIds.size;
  }

  return { stats, isLoading: attLoading || empLoading };
}
