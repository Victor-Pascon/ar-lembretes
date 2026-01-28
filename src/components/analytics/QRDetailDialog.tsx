import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { MapPin, Smartphone, Monitor, CreditCard, View } from "lucide-react";
import { VisitsChart } from "./VisitsChart";
import { useQRDetailStats } from "@/hooks/useAnalytics";

interface QRStats {
  reminderId: string;
  title: string;
  location: string | null;
  totalVisits: number;
  lastVisit: string | null;
  cardViews: number;
  arViews: number;
}

interface QRDetailDialogProps {
  qr: QRStats | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QRDetailDialog({ qr, open, onOpenChange }: QRDetailDialogProps) {
  const { stats, isLoading } = useQRDetailStats(qr?.reminderId || "");

  if (!qr) return null;

  const cardPercentage = stats?.totalVisits 
    ? (stats.cardViews / stats.totalVisits) * 100 
    : 0;
  const arPercentage = stats?.totalVisits 
    ? (stats.arViews / stats.totalVisits) * 100 
    : 0;
  const mobilePercentage = stats?.totalVisits && (stats.mobileVisits + stats.desktopVisits) > 0
    ? (stats.mobileVisits / (stats.mobileVisits + stats.desktopVisits)) * 100 
    : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Estatísticas: {qr.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Info básica */}
          <div className="flex items-center justify-between">
            {qr.location && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{qr.location}</span>
              </div>
            )}
            <Badge variant="secondary" className="text-lg px-3 py-1">
              {stats?.totalVisits || qr.totalVisits} visitas
            </Badge>
          </div>

          {/* Gráfico de 7 dias */}
          <VisitsChart 
            data={stats?.visitsByDay || []} 
            title="Visitas nos Últimos 7 Dias"
            isLoading={isLoading}
            height={200}
          />

          {/* Modo de Visualização */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm">Modo de Visualização</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm w-16">Card</span>
                <Progress value={cardPercentage} className="flex-1" />
                <span className="text-sm text-muted-foreground w-12 text-right">
                  {cardPercentage.toFixed(0)}%
                </span>
              </div>
              <div className="flex items-center gap-2">
                <View className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm w-16">AR</span>
                <Progress value={arPercentage} className="flex-1" />
                <span className="text-sm text-muted-foreground w-12 text-right">
                  {arPercentage.toFixed(0)}%
                </span>
              </div>
            </div>
          </div>

          {/* Dispositivos */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm">Dispositivos</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Smartphone className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium">{stats?.mobileVisits || 0}</p>
                  <p className="text-xs text-muted-foreground">
                    Mobile ({mobilePercentage.toFixed(0)}%)
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Monitor className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium">{stats?.desktopVisits || 0}</p>
                  <p className="text-xs text-muted-foreground">
                    Desktop ({(100 - mobilePercentage).toFixed(0)}%)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
