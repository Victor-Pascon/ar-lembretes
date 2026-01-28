import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart3, MapPin } from "lucide-react";
import { formatDistanceToNow, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { QRDetailDialog } from "./QRDetailDialog";

interface QRStats {
  reminderId: string;
  title: string;
  location: string | null;
  totalVisits: number;
  lastVisit: string | null;
  cardViews: number;
  arViews: number;
}

interface QRCodeTableProps {
  data: QRStats[];
  isLoading?: boolean;
}

export function QRCodeTable({ data, isLoading }: QRCodeTableProps) {
  const [selectedQR, setSelectedQR] = useState<QRStats | null>(null);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Estatísticas por QR Code</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Nenhuma visita registrada ainda.</p>
            <p className="text-sm">
              Quando alguém escanear seus QR Codes, as estatísticas aparecerão aqui.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Estatísticas por QR Code</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>QR Code</TableHead>
                  <TableHead>Local</TableHead>
                  <TableHead className="text-center">Visitas</TableHead>
                  <TableHead className="text-center">Última Visita</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((qr) => (
                  <TableRow key={qr.reminderId}>
                    <TableCell className="font-medium">{qr.title}</TableCell>
                    <TableCell>
                      {qr.location ? (
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <MapPin className="w-3 h-3" />
                          <span className="text-sm">{qr.location}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary">{qr.totalVisits}</Badge>
                    </TableCell>
                    <TableCell className="text-center text-sm text-muted-foreground">
                      {qr.lastVisit
                        ? formatDistanceToNow(parseISO(qr.lastVisit), {
                            addSuffix: true,
                            locale: ptBR,
                          })
                        : "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedQR(qr)}
                      >
                        <BarChart3 className="w-4 h-4 mr-1" />
                        Detalhes
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <QRDetailDialog
        qr={selectedQR}
        open={!!selectedQR}
        onOpenChange={(open) => !open && setSelectedQR(null)}
      />
    </>
  );
}
