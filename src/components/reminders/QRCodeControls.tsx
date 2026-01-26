import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Upload, RotateCcw } from "lucide-react";
import type { QRVisualConfig } from "@/types/qr-visual-config";

interface QRCodeControlsProps {
  config: QRVisualConfig;
  onChange: (updates: Partial<QRVisualConfig>) => void;
  onUploadImage: (file: File) => void;
  onDownload: () => void;
  onReset: () => void;
  isDownloading?: boolean;
}

export function QRCodeControls({
  config,
  onChange,
  onUploadImage,
  onDownload,
  onReset,
  isDownloading = false,
}: QRCodeControlsProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUploadImage(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Size Control */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Tamanho</Label>
          <span className="text-xs text-muted-foreground">{config.size}px</span>
        </div>
        <Slider
          value={[config.size]}
          onValueChange={([value]) => onChange({ size: value })}
          min={50}
          max={300}
          step={5}
          className="w-full"
        />
      </div>

      {/* Opacity Control */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Opacidade</Label>
          <span className="text-xs text-muted-foreground">{Math.round(config.opacity * 100)}%</span>
        </div>
        <Slider
          value={[config.opacity * 100]}
          onValueChange={([value]) => onChange({ opacity: value / 100 })}
          min={10}
          max={100}
          step={5}
          className="w-full"
        />
      </div>

      {/* Rotation Control */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Rotação</Label>
          <span className="text-xs text-muted-foreground">{config.rotation}°</span>
        </div>
        <Slider
          value={[config.rotation]}
          onValueChange={([value]) => onChange({ rotation: value })}
          min={0}
          max={360}
          step={5}
          className="w-full"
        />
      </div>

      {/* Color Controls */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Cores do QR Code</Label>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Código</Label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={config.foreground}
                onChange={(e) => onChange({ foreground: e.target.value })}
                className="w-10 h-10 rounded border border-border cursor-pointer"
              />
              <Input
                value={config.foreground}
                onChange={(e) => onChange({ foreground: e.target.value })}
                className="h-10 text-xs font-mono"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Fundo</Label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={config.background}
                onChange={(e) => onChange({ background: e.target.value })}
                className="w-10 h-10 rounded border border-border cursor-pointer"
              />
              <Input
                value={config.background}
                onChange={(e) => onChange({ background: e.target.value })}
                className="h-10 text-xs font-mono"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Image Upload */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Imagem Base</Label>
        <div className="flex gap-2">
          <label className="flex-1">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="sr-only"
            />
            <Button variant="outline" className="w-full" asChild>
              <span>
                <Upload className="w-4 h-4 mr-2" />
                Upload
              </span>
            </Button>
          </label>
        </div>
        {config.baseImageUrl && (
          <p className="text-xs text-muted-foreground truncate">
            Imagem carregada
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="space-y-2 pt-4 border-t border-border">
        <Button
          onClick={onDownload}
          disabled={isDownloading}
          className="w-full"
        >
          <Download className="w-4 h-4 mr-2" />
          {isDownloading ? "Gerando..." : "Baixar Imagem"}
        </Button>
        <Button
          variant="outline"
          onClick={onReset}
          className="w-full"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Resetar
        </Button>
      </div>
    </div>
  );
}
