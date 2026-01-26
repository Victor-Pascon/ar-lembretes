import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  MoreVertical, 
  Edit, 
  Palette, 
  Eye, 
  Trash2, 
  MapPin,
  Copy,
  Download,
  Image
} from "lucide-react";
import { QRCodeDisplay } from "./QRCodeDisplay";
import type { ReminderWithLocation } from "@/hooks/useReminders";
import { toast } from "@/hooks/use-toast";

interface ReminderCardProps {
  reminder: ReminderWithLocation;
  onEdit: (reminder: ReminderWithLocation) => void;
  onCustomizeQR: (reminder: ReminderWithLocation) => void;
  onPreviewAR: (reminder: ReminderWithLocation) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, isActive: boolean) => void;
}

export function ReminderCard({
  reminder,
  onEdit,
  onCustomizeQR,
  onPreviewAR,
  onDelete,
  onToggleStatus,
}: ReminderCardProps) {
  const navigate = useNavigate();
  const [isToggling, setIsToggling] = useState(false);

  const handleToggle = async (checked: boolean) => {
    setIsToggling(true);
    try {
      await onToggleStatus(reminder.id, checked);
      toast({
        title: checked ? "Lembrete ativado" : "Lembrete desativado",
        description: `"${reminder.title}" foi ${checked ? "ativado" : "desativado"} com sucesso.`,
      });
    } catch {
      toast({
        title: "Erro",
        description: "Não foi possível alterar o status do lembrete.",
        variant: "destructive",
      });
    } finally {
      setIsToggling(false);
    }
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/ar/${reminder.qr_code_data}`;
    navigator.clipboard.writeText(url);
    toast({
      title: "Link copiado!",
      description: "O link do QR Code foi copiado para a área de transferência.",
    });
  };

  const qrStyle = reminder.qr_code_style as { foreground?: string; background?: string } | null;

  return (
    <Card className="border-border hover:shadow-lg transition-all duration-300 group overflow-hidden">
      <CardContent className="p-0">
        {/* QR Code Preview */}
        <div className="relative bg-muted/30 p-4 flex items-center justify-center border-b border-border">
          <QRCodeDisplay
            data={reminder.qr_code_data}
            size={100}
            style={qrStyle}
            className="shadow-sm"
          />
          <div className="absolute top-2 right-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(reminder)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Editar mensagem
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onCustomizeQR(reminder)}>
                  <Palette className="w-4 h-4 mr-2" />
                  Cores do QR
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate(`/qr-editor/${reminder.id}`)}>
                  <Image className="w-4 h-4 mr-2" />
                  Editor Visual
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onPreviewAR(reminder)}>
                  <Eye className="w-4 h-4 mr-2" />
                  Visualizar AR
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleCopyLink}>
                  <Copy className="w-4 h-4 mr-2" />
                  Copiar link
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate(`/qr-editor/${reminder.id}`)}>
                  <Download className="w-4 h-4 mr-2" />
                  Baixar QR Code
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => onDelete(reminder.id)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground truncate">{reminder.title}</h3>
              {reminder.locations && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                  <MapPin className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">{reminder.locations.name}</span>
                </div>
              )}
            </div>
            <Badge 
              variant={reminder.is_active ? "default" : "secondary"}
              className={reminder.is_active ? "bg-emerald-500 hover:bg-emerald-600" : ""}
            >
              {reminder.is_active ? "Ativo" : "Inativo"}
            </Badge>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2">
            {reminder.message}
          </p>

          {/* Actions */}
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Status:</span>
              <Switch
                checked={reminder.is_active}
                onCheckedChange={handleToggle}
                disabled={isToggling}
              />
            </div>
            <div className="flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onEdit(reminder)}
                className="h-8 px-2"
              >
                <Edit className="w-3.5 h-3.5" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onCustomizeQR(reminder)}
                className="h-8 px-2"
                title="Cores do QR"
              >
                <Palette className="w-3.5 h-3.5" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate(`/qr-editor/${reminder.id}`)}
                className="h-8 px-2"
                title="Editor Visual"
              >
                <Image className="w-3.5 h-3.5" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onPreviewAR(reminder)}
                className="h-8 px-2"
                title="Visualizar AR"
              >
                <Eye className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
