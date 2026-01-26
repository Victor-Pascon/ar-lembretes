import { AvatarConfig } from "./AvatarModel";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

interface AvatarCustomizerProps {
  config: AvatarConfig;
  onChange: (config: AvatarConfig) => void;
}

const skinColors = [
  { name: "Claro", value: "#ffe4c4" },
  { name: "Médio claro", value: "#deb887" },
  { name: "Médio", value: "#c68642" },
  { name: "Médio escuro", value: "#8d5524" },
  { name: "Escuro", value: "#5c3317" },
];

const hairColors = [
  { name: "Preto", value: "#1a1a1a" },
  { name: "Castanho escuro", value: "#3d2314" },
  { name: "Castanho", value: "#6b4423" },
  { name: "Loiro escuro", value: "#8b7355" },
  { name: "Loiro", value: "#d4a574" },
  { name: "Ruivo", value: "#a0522d" },
  { name: "Grisalho", value: "#9e9e9e" },
  { name: "Fantasia", value: "#9333ea" },
];

const eyeColors = [
  { name: "Castanho", value: "#634e34" },
  { name: "Verde", value: "#3d5c3a" },
  { name: "Azul", value: "#3b7ea1" },
  { name: "Cinza", value: "#6b7280" },
  { name: "Âmbar", value: "#b8860b" },
];

const hairStyles: { name: string; value: AvatarConfig["hairStyle"] }[] = [
  { name: "Curto", value: "short" },
  { name: "Médio", value: "medium" },
  { name: "Longo", value: "long" },
  { name: "Careca", value: "bald" },
];

const ColorPicker = ({
  colors,
  selected,
  onChange,
}: {
  colors: { name: string; value: string }[];
  selected: string;
  onChange: (value: string) => void;
}) => (
  <div className="flex flex-wrap gap-2">
    {colors.map((color) => (
      <button
        key={color.value}
        onClick={() => onChange(color.value)}
        className={cn(
          "w-8 h-8 rounded-full border-2 transition-all",
          "hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
          selected === color.value
            ? "border-primary ring-2 ring-primary ring-offset-2"
            : "border-border"
        )}
        style={{ backgroundColor: color.value }}
        title={color.name}
      />
    ))}
  </div>
);

const AvatarCustomizer = ({ config, onChange }: AvatarCustomizerProps) => {
  const updateConfig = (updates: Partial<AvatarConfig>) => {
    onChange({ ...config, ...updates });
  };

  return (
    <div className="space-y-6">
      {/* Skin Color */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-foreground">Tom de pele</Label>
        <ColorPicker
          colors={skinColors}
          selected={config.skinColor}
          onChange={(value) => updateConfig({ skinColor: value })}
        />
      </div>

      {/* Hair Color */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-foreground">Cor do cabelo</Label>
        <ColorPicker
          colors={hairColors}
          selected={config.hairColor}
          onChange={(value) => updateConfig({ hairColor: value })}
        />
      </div>

      {/* Hair Style */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-foreground">Estilo do cabelo</Label>
        <div className="flex flex-wrap gap-2">
          {hairStyles.map((style) => (
            <Button
              key={style.value}
              variant={config.hairStyle === style.value ? "default" : "outline"}
              size="sm"
              onClick={() => updateConfig({ hairStyle: style.value })}
              className={cn(
                config.hairStyle === style.value &&
                  "bg-gradient-to-r from-primary to-accent text-white"
              )}
            >
              {style.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Eye Color */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-foreground">Cor dos olhos</Label>
        <ColorPicker
          colors={eyeColors}
          selected={config.eyeColor}
          onChange={(value) => updateConfig({ eyeColor: value })}
        />
      </div>

      {/* Glasses */}
      <div className="flex items-center justify-between">
        <Label htmlFor="glasses" className="text-sm font-medium text-foreground">
          Usar óculos
        </Label>
        <Switch
          id="glasses"
          checked={config.hasGlasses}
          onCheckedChange={(checked) => updateConfig({ hasGlasses: checked })}
        />
      </div>
    </div>
  );
};

export default AvatarCustomizer;
