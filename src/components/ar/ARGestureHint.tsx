import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface ARGestureHintProps {
  onDismiss: () => void;
}

const ARGestureHint = ({ onDismiss }: ARGestureHintProps) => {
  return (
    <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-20 p-4">
      <div className="bg-background rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl animate-scale-in">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-foreground">Dicas de Interação</h3>
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-8 w-8 -mt-1 -mr-2"
            onClick={onDismiss}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <span className="text-2xl">👆</span>
            <div>
              <p className="font-medium text-sm text-foreground">Arraste</p>
              <p className="text-xs text-muted-foreground">Gire o avatar arrastando</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <span className="text-2xl">🤏</span>
            <div>
              <p className="font-medium text-sm text-foreground">Pinça</p>
              <p className="text-xs text-muted-foreground">Aproxime ou afaste com dois dedos</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <span className="text-2xl">👆👆</span>
            <div>
              <p className="font-medium text-sm text-foreground">Dois dedos</p>
              <p className="text-xs text-muted-foreground">Mova verticalmente a câmera</p>
            </div>
          </div>
        </div>
        
        <Button 
          className="w-full"
          onClick={onDismiss}
        >
          Entendi!
        </Button>
      </div>
    </div>
  );
};

export default ARGestureHint;
