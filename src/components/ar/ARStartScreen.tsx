import { Button } from "@/components/ui/button";
import { MapPin, Sparkles } from "lucide-react";

interface ARStartScreenProps {
  title: string;
  location?: string;
  onStart: () => void;
}

const ARStartScreen = ({ title, location, onStart }: ARStartScreenProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-accent/20 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8 animate-fade-in">
        {/* Animated AR Icon */}
        <div className="relative mx-auto w-24 h-24">
          <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
          <div className="relative w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center shadow-lg">
            <Sparkles className="w-12 h-12 text-primary-foreground" />
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Você escaneou um lembrete!
          </p>
          <h1 className="text-2xl font-bold text-foreground">
            {title}
          </h1>
        </div>

        {/* Location */}
        {location && (
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{location}</span>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-muted/50 rounded-xl p-4 space-y-2">
          <p className="text-sm text-muted-foreground">
            Posicione seu celular para ver a mensagem em{" "}
            <span className="font-semibold text-primary">realidade aumentada</span>
          </p>
          <p className="text-xs text-muted-foreground/70">
            Será solicitada permissão para usar a câmera
          </p>
        </div>

        {/* Start Button */}
        <Button
          onClick={onStart}
          size="lg"
          className="w-full h-14 text-lg font-semibold shadow-lg hover:scale-105 transition-transform"
        >
          <Sparkles className="w-5 h-5 mr-2" />
          Iniciar experiência AR
        </Button>
      </div>
    </div>
  );
};

export default ARStartScreen;
