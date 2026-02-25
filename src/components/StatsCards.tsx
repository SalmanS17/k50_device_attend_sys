import { Users, UserCheck, Clock, UserX } from "lucide-react";
import type { DashboardStats } from "@/hooks/use-attendance";

interface StatsCardsProps {
  stats: DashboardStats;
}

const CARDS = [
  { key: "totalEmployees" as const, label: "Total Employees", icon: Users, color: "text-foreground" },
  { key: "presentToday" as const, label: "Present Today", icon: UserCheck, color: "text-primary" },
  { key: "lateArrivals" as const, label: "Late Arrivals", icon: Clock, color: "text-warning" },
  { key: "absentToday" as const, label: "Absent Today", icon: UserX, color: "text-destructive" },
];

export default function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {CARDS.map((card) => (
        <div key={card.key} className="glass-card rounded-lg p-5 glow-primary">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {card.label}
            </span>
            <card.icon className={`h-4 w-4 ${card.color}`} />
          </div>
          <p className={`text-3xl font-semibold font-mono ${card.color}`}>
            {stats[card.key]}
          </p>
        </div>
      ))}
    </div>
  );
}
