import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Minus, Plus, RotateCcw } from "lucide-react";

interface ARControlsOverlayProps {
  scale: number;
  onScaleChange: (scale: number) => void;
  onReset: () => void;
}

const ARControlsOverlay = ({ scale, onScaleChange, onReset }: ARControlsOverlayProps) => {
  return (
    <div className="absolute bottom-20 inset-x-0 px-4 z-10">
      <div className="bg-background/80 backdrop-blur-sm rounded-2xl p-4 space-y-3 shadow-lg">
        {/* Scale slider */}
        <div className="space-y-2">
          <span className="text-xs text-muted-foreground">Tamanho</span>
          <div className="flex items-center gap-3">
            <Button 
              size="icon" 
              variant="ghost"
              className="h-8 w-8"
              onClick={() => onScaleChange(Math.max(0.5, scale - 0.1))}
            >
              <Minus className="w-4 h-4" />
            </Button>
            
            <Slider
              value={[scale]}
              onValueChange={([v]) => onScaleChange(v)}
              min={0.5}
              max={2}
              step={0.1}
              className="flex-1"
            />
            
            <Button 
              size="icon" 
              variant="ghost"
              className="h-8 w-8"
              onClick={() => onScaleChange(Math.min(2, scale + 0.1))}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        {/* Reset button */}
        <Button 
          variant="outline" 
          className="w-full"
          onClick={onReset}
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Resetar Posição
        </Button>
      </div>
    </div>
  );
};

export default ARControlsOverlay;
