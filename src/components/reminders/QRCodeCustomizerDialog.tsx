import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, RotateCcw } from "lucide-react";
import { QRCodeDisplay } from "./QRCodeDisplay";
import type { ReminderWithLocation } from "@/hooks/useReminders";

interface QRCodeStyle {
  foreground: string;
  background: string;
}

interface QRCodeCustomizerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reminder: ReminderWithLocation | null;
  onSave: (id: string, style: QRCodeStyle) => Promise<void>;
}

const presets = [
  { foreground: "#7c3aed", background: "#ffffff", name: "Roxo Clássico" },
  { foreground: "#1f2937", background: "#ffffff", name: "Escuro" },
  { foreground: "#059669", background: "#ecfdf5", name: "Verde Menta" },
  { foreground: "#dc2626", background: "#fef2f2", name: "Vermelho" },
  { foreground: "#0284c7", background: "#f0f9ff", name: "Azul Sky" },
  { foreground: "#7c3aed", background: "#f5f3ff", name: "Lavanda" },
];

export function QRCodeCustomizerDialog({
  open,
  onOpenChange,
  reminder,
  onSave,
}: QRCodeCustomizerDialogProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [style, setStyle] = useState<QRCodeStyle>({
    foreground: "#7c3aed",
    background: "#ffffff",
  });

  useEffect(() => {
    if (reminder?.qr_code_style && typeof reminder.qr_code_style === 'object' && !Array.isArray(reminder.qr_code_style)) {
      const existingStyle = reminder.qr_code_style as Record<string, unknown>;
      setStyle({
        foreground: (existingStyle.foreground as string) || "#7c3aed",
        background: (existingStyle.background as string) || "#ffffff",
      });
    }
  }, [reminder]);

  const handleSave = async () => {
    if (!reminder) return;
    setIsSaving(true);
    try {
      await onSave(reminder.id, style);
      onOpenChange(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setStyle({ foreground: "#7c3aed", background: "#ffffff" });
  };

  if (!reminder) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Personalizar QR Code</DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Preview */}
          <div className="flex justify-center">
            <div className="p-4 bg-muted/30 rounded-xl">
              <QRCodeDisplay
                data={reminder.qr_code_data}
                size={160}
                style={style}
                className="shadow-lg"
              />
            </div>
          </div>

          {/* Presets */}
          <div className="space-y-2">
            <Label>Temas predefinidos</Label>
            <div className="grid grid-cols-3 gap-2">
              {presets.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  className={`p-3 rounded-lg border-2 transition-all ${
                    style.foreground === preset.foreground && style.background === preset.background
                      ? "border-primary shadow-sm"
                      : "border-border hover:border-muted-foreground"
                  }`}
                  onClick={() => setStyle({ foreground: preset.foreground, background: preset.background })}
                >
                  <div
                    className="w-full h-8 rounded-md mb-2"
                    style={{
                      background: `linear-gradient(135deg, ${preset.foreground} 50%, ${preset.background} 50%)`,
                    }}
                  />
                  <span className="text-xs text-muted-foreground">{preset.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Colors */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="foreground">Cor do QR Code</Label>
              <div className="flex gap-2">
                <div
                  className="w-10 h-10 rounded-md border border-border cursor-pointer"
                  style={{ backgroundColor: style.foreground }}
                >
                  <input
                    type="color"
                    id="foreground"
                    value={style.foreground}
                    onChange={(e) => setStyle({ ...style, foreground: e.target.value })}
                    className="opacity-0 w-full h-full cursor-pointer"
                  />
                </div>
                <Input
                  value={style.foreground}
                  onChange={(e) => setStyle({ ...style, foreground: e.target.value })}
                  className="flex-1 font-mono text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="background">Cor de fundo</Label>
              <div className="flex gap-2">
                <div
                  className="w-10 h-10 rounded-md border border-border cursor-pointer"
                  style={{ backgroundColor: style.background }}
                >
                  <input
                    type="color"
                    id="background"
                    value={style.background}
                    onChange={(e) => setStyle({ ...style, background: e.target.value })}
                    className="opacity-0 w-full h-full cursor-pointer"
                  />
                </div>
                <Input
                  value={style.background}
                  onChange={(e) => setStyle({ ...style, background: e.target.value })}
                  className="flex-1 font-mono text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button type="button" variant="outline" onClick={handleReset} className="sm:mr-auto">
            <RotateCcw className="w-4 h-4 mr-2" />
            Resetar
          </Button>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
          >
            {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Salvar alterações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
