import DashboardLayout from "@/components/DashboardLayout";
import { useEmployees } from "@/hooks/use-attendance";
import { AddEmployeeDialog } from "@/components/AddEmployeeDialog";
import { User } from "lucide-react";

export default function EmployeesPage() {
  const { data: employees = [], isLoading } = useEmployees();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Employees</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {employees.length} registered employees
            </p>
          </div>
          <AddEmployeeDialog />
        </div>

        {isLoading ? (
          <div className="text-sm text-muted-foreground">
            Loading employees...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {employees.map((emp) => (
              <div
                key={emp.id}
                className="glass-card rounded-lg p-5 hover:border-primary/30 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-medium text-sm">{emp.name}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {emp.designation}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-secondary text-secondary-foreground">
                        {emp.department}
                      </span>
                      <span className="text-xs text-muted-foreground font-mono">
                        ID: {emp.user_id}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
