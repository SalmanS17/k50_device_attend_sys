import { format } from "date-fns";
import type { AttendanceWithEmployee } from "@/hooks/use-attendance";

interface AttendanceTableProps {
  records: AttendanceWithEmployee[];
  title?: string;
  loading?: boolean;
}

export default function AttendanceTable({ records, title = "Attendance Log", loading }: AttendanceTableProps) {
  return (
    <div className="glass-card rounded-lg overflow-hidden">
      <div className="px-5 py-4 border-b border-border">
        <h2 className="text-sm font-semibold">{title}</h2>
        <p className="text-xs text-muted-foreground mt-0.5">{records.length} records</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Employee</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">ID</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Department</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Check-in</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Device</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-muted-foreground">
                  Loading...
                </td>
              </tr>
            ) : records.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-muted-foreground">
                  No attendance records found
                </td>
              </tr>
            ) : (
              records.map((record) => (
                <tr key={record.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3 font-medium">{record.employeeName}</td>
                  <td className="px-5 py-3 font-mono text-muted-foreground">{record.user_id}</td>
                  <td className="px-5 py-3 text-muted-foreground">{record.department}</td>
                  <td className="px-5 py-3 font-mono text-xs">
                    {format(new Date(record.check_time), "MMM dd, yyyy — hh:mm a")}
                  </td>
                  <td className="px-5 py-3 font-mono text-xs text-muted-foreground">{record.device}</td>
                  <td className="px-5 py-3">
                    <StatusBadge status={record.status} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    "on-time": "bg-primary/15 text-primary border-primary/20",
    late: "bg-warning/15 text-warning border-warning/20",
    absent: "bg-destructive/15 text-destructive border-destructive/20",
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${styles[status] ?? styles["on-time"]}`}>
      {status === "on-time" ? "On Time" : status === "late" ? "Late" : "Absent"}
    </span>
  );
}
