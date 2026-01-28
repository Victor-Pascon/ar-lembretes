import { Card, CardContent } from "@/components/ui/card";
import { Eye, Calendar, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface OverviewStatsProps {
  totalVisits: number;
  visitsThisMonth: number;
  avgPerQR: number;
  isLoading?: boolean;
}

export function OverviewStats({ 
  totalVisits, 
  visitsThisMonth, 
  avgPerQR,
  isLoading 
}: OverviewStatsProps) {
  const stats = [
    {
      title: "Total de Visitas",
      value: totalVisits,
      icon: Eye,
      description: "Desde o início",
    },
    {
      title: "Visitas Este Mês",
      value: visitsThisMonth,
      icon: Calendar,
      description: "Mês atual",
    },
    {
      title: "Média por QR Code",
      value: avgPerQR.toFixed(1),
      icon: TrendingUp,
      description: "Por lembrete",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-8 w-16 mb-1" />
              <Skeleton className="h-3 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </p>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-2xl font-bold text-foreground mt-2">
              {stat.value}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
