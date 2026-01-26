import { QrCode, Bell, MapPin, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardStatsProps {
  totalReminders: number;
  activeReminders: number;
  totalLocations: number;
  isLoading?: boolean;
}

export function DashboardStats({
  totalReminders,
  activeReminders,
  totalLocations,
  isLoading = false,
}: DashboardStatsProps) {
  const stats = [
    {
      label: "Total de Lembretes",
      value: totalReminders,
      icon: Bell,
      color: "from-primary to-accent",
      iconColor: "text-primary",
    },
    {
      label: "Lembretes Ativos",
      value: activeReminders,
      icon: CheckCircle,
      color: "from-emerald-500 to-teal-500",
      iconColor: "text-emerald-500",
    },
    {
      label: "QR Codes Gerados",
      value: totalReminders,
      icon: QrCode,
      color: "from-violet-500 to-purple-500",
      iconColor: "text-violet-500",
    },
    {
      label: "Locais Cadastrados",
      value: totalLocations,
      icon: MapPin,
      color: "from-orange-500 to-amber-500",
      iconColor: "text-orange-500",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="border-border">
            <CardContent className="p-4">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card 
          key={stat.label} 
          className="border-border hover:shadow-lg transition-all duration-300 group overflow-hidden relative"
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {stat.label}
              </span>
              <stat.icon className={`w-4 h-4 ${stat.iconColor}`} />
            </div>
            <p className="text-3xl font-bold text-foreground">{stat.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
