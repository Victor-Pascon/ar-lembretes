import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Save, Info, Loader2 } from "lucide-react";
import { QRCodeCanvas, QRCodeCanvasRef } from "./QRCodeCanvas";
import { QRCodeControls } from "./QRCodeControls";
import { toast } from "@/hooks/use-toast";
import type { QRVisualConfig } from "@/types/qr-visual-config";
import { defaultQRVisualConfig } from "@/types/qr-visual-config";
import type { ReminderWithLocation } from "@/hooks/useReminders";

interface QRCodeVisualEditorProps {
  reminder: ReminderWithLocation;
  onSave: (config: QRVisualConfig) => Promise<void>;
  onBack: () => void;
}

export function QRCodeVisualEditor({ reminder, onSave, onBack }: QRCodeVisualEditorProps) {
  const canvasRef = useRef<QRCodeCanvasRef>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [baseImage, setBaseImage] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Initialize config from reminder's existing style or defaults
  const [config, setConfig] = useState<QRVisualConfig>(() => {
    const existingStyle = reminder.qr_code_style as Partial<QRVisualConfig> | null;
    return {
      ...defaultQRVisualConfig,
      ...existingStyle,
    };
  });

  // Load base image if it exists
  useEffect(() => {
    if (config.baseImageUrl) {
      setBaseImage(config.baseImageUrl);
    }
  }, []);

  const handleConfigChange = useCallback((updates: Partial<QRVisualConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
    setHasUnsavedChanges(true);
  }, []);

  const handlePositionChange = useCallback((position: { x: number; y: number }) => {
    setConfig((prev) => ({ ...prev, position }));
    setHasUnsavedChanges(true);
  }, []);

  const handleImageUpload = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setBaseImage(result);
      handleConfigChange({ baseImageUrl: result });
    };
    reader.readAsDataURL(file);
  }, [handleConfigChange]);

  const handleDownload = useCallback(async () => {
    if (!canvasRef.current) return;

    setIsDownloading(true);
    try {
      const blob = await canvasRef.current.exportAsImage();
      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `qr-${reminder.title.replace(/\s+/g, "-").toLowerCase()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        toast({
          title: "Download concluído",
          description: "A imagem do QR Code foi salva com sucesso.",
        });
      }
    } catch {
      toast({
        title: "Erro no download",
        description: "Não foi possível gerar a imagem. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  }, [reminder.title]);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      await onSave(config);
      setHasUnsavedChanges(false);
      toast({
        title: "Personalização salva",
        description: "As configurações visuais do QR Code foram atualizadas.",
      });
    } catch {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as configurações. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  }, [config, onSave]);

  const handleReset = useCallback(() => {
    setConfig(defaultQRVisualConfig);
    setBaseImage(null);
    setHasUnsavedChanges(true);
  }, []);

  const handleBack = useCallback(() => {
    if (hasUnsavedChanges) {
      if (confirm("Você tem alterações não salvas. Deseja sair mesmo assim?")) {
        onBack();
      }
    } else {
      onBack();
    }
  }, [hasUnsavedChanges, onBack]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={handleBack}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-lg font-semibold">Personalizar QR Code</h1>
                <p className="text-sm text-muted-foreground truncate max-w-[200px] sm:max-w-none">
                  {reminder.title}
                </p>
              </div>
            </div>
            <Button onClick={handleSave} disabled={isSaving || !hasUnsavedChanges}>
              {isSaving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Salvar
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Canvas Area */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-card rounded-xl border border-border p-4 overflow-x-auto">
              <QRCodeCanvas
                ref={canvasRef}
                qrData={reminder.qr_code_data}
                config={config}
                baseImage={baseImage}
                onPositionChange={handlePositionChange}
              />
            </div>

            {/* Info Alert */}
            <Alert className="border-primary/30 bg-primary/5">
              <Info className="h-4 w-4 text-primary" />
              <AlertDescription className="text-foreground/80">
                <strong>Aviso:</strong> O QR Code é permanente e único. Apenas sua
                aparência visual (posição, tamanho, rotação) pode ser alterada. O código
                em si sempre apontará para o mesmo lembrete.
              </AlertDescription>
            </Alert>
          </div>

          {/* Controls Panel */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-xl border border-border p-6 sticky top-24">
              <h2 className="font-semibold mb-6">Controles</h2>
              <QRCodeControls
                config={config}
                onChange={handleConfigChange}
                onUploadImage={handleImageUpload}
                onDownload={handleDownload}
                onReset={handleReset}
                isDownloading={isDownloading}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
