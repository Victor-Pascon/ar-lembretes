import { AvatarConfig } from "./AvatarModel";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { 
  Palette, 
  User, 
  Scissors, 
  Glasses,
  Circle,
  Square,
  Heart,
  Hexagon,
  Smile,
  Meh,
  Zap,
  Eye
} from "lucide-react";

interface AvatarCustomizerProps {
  config: AvatarConfig;
  onChange: (config: AvatarConfig) => void;
}

const skinColors = [
  { name: "Muito claro", value: "#ffe4c4" },
  { name: "Claro", value: "#f5d0a9" },
  { name: "Médio claro", value: "#deb887" },
  { name: "Médio", value: "#c68642" },
  { name: "Médio escuro", value: "#8d5524" },
  { name: "Escuro", value: "#5c3317" },
];

const hairColors = [
  { name: "Loiro", value: "#d4a574" },
  { name: "Loiro escuro", value: "#8b7355" },
  { name: "Castanho", value: "#6b4423" },
  { name: "Castanho escuro", value: "#3d2314" },
  { name: "Preto", value: "#1a1a1a" },
  { name: "Ruivo", value: "#a0522d" },
  { name: "Grisalho", value: "#9e9e9e" },
  { name: "Fantasia", value: "#9333ea" },
  { name: "Rosa", value: "#ec4899" },
  { name: "Azul", value: "#3b82f6" },
];

const eyeColors = [
  { name: "Castanho escuro", value: "#3d2314" },
  { name: "Castanho", value: "#634e34" },
  { name: "Âmbar", value: "#b8860b" },
  { name: "Verde", value: "#3d5c3a" },
  { name: "Azul", value: "#3b7ea1" },
  { name: "Cinza", value: "#6b7280" },
];

const hairStyles: { name: string; value: AvatarConfig["hairStyle"]; icon: string }[] = [
  { name: "Curto", value: "short", icon: "✂️" },
  { name: "Médio", value: "medium", icon: "💇" },
  { name: "Longo", value: "long", icon: "💁" },
  { name: "Cacheado", value: "curly", icon: "🌀" },
  { name: "Rabo", value: "ponytail", icon: "🎀" },
  { name: "Moicano", value: "mohawk", icon: "🤘" },
  { name: "Careca", value: "bald", icon: "🌙" },
];

const faceShapes: { name: string; value: AvatarConfig["faceShape"]; Icon: typeof Circle }[] = [
  { name: "Redondo", value: "round", Icon: Circle },
  { name: "Oval", value: "oval", Icon: Hexagon },
  { name: "Quadrado", value: "square", Icon: Square },
  { name: "Coração", value: "heart", Icon: Heart },
];

const expressions: { name: string; value: AvatarConfig["expression"]; Icon: typeof Smile }[] = [
  { name: "Feliz", value: "happy", Icon: Smile },
  { name: "Neutro", value: "neutral", Icon: Meh },
  { name: "Surpreso", value: "surprised", Icon: Zap },
  { name: "Piscando", value: "wink", Icon: Eye },
];

const glassesStyles: { name: string; value: AvatarConfig["glassesStyle"] }[] = [
  { name: "Redondo", value: "round" },
  { name: "Quadrado", value: "square" },
  { name: "Cat-eye", value: "cat-eye" },
  { name: "Aviador", value: "aviator" },
];

const hatStyles: { name: string; value: AvatarConfig["hatStyle"] }[] = [
  { name: "Nenhum", value: "none" },
  { name: "Boné", value: "cap" },
  { name: "Gorro", value: "beanie" },
  { name: "Cowboy", value: "cowboy" },
];

const facialHairStyles: { name: string; value: AvatarConfig["facialHairStyle"] }[] = [
  { name: "Nenhum", value: "none" },
  { name: "Barba", value: "beard" },
  { name: "Cavanhaque", value: "goatee" },
  { name: "Bigode", value: "mustache" },
  { name: "Barba por fazer", value: "stubble" },
];

const bodyStyles: { name: string; value: AvatarConfig["bodyStyle"] }[] = [
  { name: "Magro", value: "slim" },
  { name: "Médio", value: "average" },
  { name: "Atlético", value: "athletic" },
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
    <Tabs defaultValue="colors" className="w-full">
      <TabsList className="grid w-full grid-cols-4 mb-4">
        <TabsTrigger value="colors" className="text-xs sm:text-sm">
          <Palette className="w-4 h-4 sm:mr-1" />
          <span className="hidden sm:inline">Cores</span>
        </TabsTrigger>
        <TabsTrigger value="face" className="text-xs sm:text-sm">
          <User className="w-4 h-4 sm:mr-1" />
          <span className="hidden sm:inline">Rosto</span>
        </TabsTrigger>
        <TabsTrigger value="hair" className="text-xs sm:text-sm">
          <Scissors className="w-4 h-4 sm:mr-1" />
          <span className="hidden sm:inline">Cabelo</span>
        </TabsTrigger>
        <TabsTrigger value="accessories" className="text-xs sm:text-sm">
          <Glasses className="w-4 h-4 sm:mr-1" />
          <span className="hidden sm:inline">Acessórios</span>
        </TabsTrigger>
      </TabsList>

      {/* COLORS TAB */}
      <TabsContent value="colors" className="space-y-6">
        <div className="space-y-3">
          <Label className="text-sm font-medium text-foreground">Tom de pele</Label>
          <ColorPicker
            colors={skinColors}
            selected={config.skinColor}
            onChange={(value) => updateConfig({ skinColor: value })}
          />
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium text-foreground">Cor do cabelo</Label>
          <ColorPicker
            colors={hairColors}
            selected={config.hairColor}
            onChange={(value) => updateConfig({ hairColor: value })}
          />
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium text-foreground">Cor dos olhos</Label>
          <ColorPicker
            colors={eyeColors}
            selected={config.eyeColor}
            onChange={(value) => updateConfig({ eyeColor: value })}
          />
        </div>
      </TabsContent>

      {/* FACE TAB */}
      <TabsContent value="face" className="space-y-6">
        <div className="space-y-3">
          <Label className="text-sm font-medium text-foreground">Formato do rosto</Label>
          <div className="grid grid-cols-2 gap-2">
            {faceShapes.map((shape) => (
              <Button
                key={shape.value}
                variant={config.faceShape === shape.value ? "default" : "outline"}
                size="sm"
                onClick={() => updateConfig({ faceShape: shape.value })}
                className={cn(
                  "justify-start gap-2",
                  config.faceShape === shape.value &&
                    "bg-gradient-to-r from-primary to-accent text-white"
                )}
              >
                <shape.Icon className="w-4 h-4" />
                {shape.name}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium text-foreground">Expressão</Label>
          <div className="grid grid-cols-2 gap-2">
            {expressions.map((expr) => (
              <Button
                key={expr.value}
                variant={config.expression === expr.value ? "default" : "outline"}
                size="sm"
                onClick={() => updateConfig({ expression: expr.value })}
                className={cn(
                  "justify-start gap-2",
                  config.expression === expr.value &&
                    "bg-gradient-to-r from-primary to-accent text-white"
                )}
              >
                <expr.Icon className="w-4 h-4" />
                {expr.name}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium text-foreground">Corpo</Label>
          <div className="flex flex-wrap gap-2">
            {bodyStyles.map((style) => (
              <Button
                key={style.value}
                variant={config.bodyStyle === style.value ? "default" : "outline"}
                size="sm"
                onClick={() => updateConfig({ bodyStyle: style.value })}
                className={cn(
                  config.bodyStyle === style.value &&
                    "bg-gradient-to-r from-primary to-accent text-white"
                )}
              >
                {style.name}
              </Button>
            ))}
          </div>
        </div>
      </TabsContent>

      {/* HAIR TAB */}
      <TabsContent value="hair" className="space-y-6">
        <div className="space-y-3">
          <Label className="text-sm font-medium text-foreground">Estilo do cabelo</Label>
          <div className="grid grid-cols-2 gap-2">
            {hairStyles.map((style) => (
              <Button
                key={style.value}
                variant={config.hairStyle === style.value ? "default" : "outline"}
                size="sm"
                onClick={() => updateConfig({ hairStyle: style.value })}
                className={cn(
                  "justify-start gap-2",
                  config.hairStyle === style.value &&
                    "bg-gradient-to-r from-primary to-accent text-white"
                )}
              >
                <span>{style.icon}</span>
                {style.name}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="facialHair" className="text-sm font-medium text-foreground">
              Pelos faciais
            </Label>
            <Switch
              id="facialHair"
              checked={config.hasFacialHair}
              onCheckedChange={(checked) => updateConfig({ 
                hasFacialHair: checked,
                facialHairStyle: checked ? "beard" : "none"
              })}
            />
          </div>
          {config.hasFacialHair && (
            <div className="flex flex-wrap gap-2 mt-2">
              {facialHairStyles.filter(s => s.value !== "none").map((style) => (
                <Button
                  key={style.value}
                  variant={config.facialHairStyle === style.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => updateConfig({ facialHairStyle: style.value })}
                  className={cn(
                    config.facialHairStyle === style.value &&
                      "bg-gradient-to-r from-primary to-accent text-white"
                  )}
                >
                  {style.name}
                </Button>
              ))}
            </div>
          )}
        </div>
      </TabsContent>

      {/* ACCESSORIES TAB */}
      <TabsContent value="accessories" className="space-y-6">
        {/* Glasses */}
        <div className="space-y-3">
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
          {config.hasGlasses && (
            <div className="flex flex-wrap gap-2 mt-2">
              {glassesStyles.map((style) => (
                <Button
                  key={style.value}
                  variant={config.glassesStyle === style.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => updateConfig({ glassesStyle: style.value })}
                  className={cn(
                    config.glassesStyle === style.value &&
                      "bg-gradient-to-r from-primary to-accent text-white"
                  )}
                >
                  {style.name}
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Hats */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="hat" className="text-sm font-medium text-foreground">
              Usar chapéu
            </Label>
            <Switch
              id="hat"
              checked={config.hasHat}
              onCheckedChange={(checked) => updateConfig({ 
                hasHat: checked,
                hatStyle: checked ? "cap" : "none"
              })}
            />
          </div>
          {config.hasHat && (
            <div className="flex flex-wrap gap-2 mt-2">
              {hatStyles.filter(s => s.value !== "none").map((style) => (
                <Button
                  key={style.value}
                  variant={config.hatStyle === style.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => updateConfig({ hatStyle: style.value })}
                  className={cn(
                    config.hatStyle === style.value &&
                      "bg-gradient-to-r from-primary to-accent text-white"
                  )}
                >
                  {style.name}
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Earrings */}
        <div className="flex items-center justify-between">
          <Label htmlFor="earrings" className="text-sm font-medium text-foreground">
            Usar brincos
          </Label>
          <Switch
            id="earrings"
            checked={config.hasEarrings}
            onCheckedChange={(checked) => updateConfig({ hasEarrings: checked })}
          />
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default AvatarCustomizer;
