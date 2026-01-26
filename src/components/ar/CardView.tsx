import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, User, Sparkles, ArrowLeft } from "lucide-react";
import logo from "@/assets/logo-ar-lembretes.png";

interface CardViewProps {
  title: string;
  message: string;
  location?: string;
  creatorName?: string;
  onClose: () => void;
  onSwitchToAR: () => void;
}

const CardView = ({
  title,
  message,
  location,
  creatorName,
  onClose,
  onSwitchToAR,
}: CardViewProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-accent/20 flex flex-col">
      {/* Header */}
      <header className="p-4">
        <Button variant="ghost" size="icon" onClick={onClose}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-6">
          {/* Logo */}
          <img src={logo} alt="AR Lembretes" className="h-12 mx-auto" />

          {/* Card Principal */}
          <Card className="shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-xl">{title}</CardTitle>
              <div className="flex flex-col items-center gap-1 text-sm text-muted-foreground">
                {location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{location}</span>
                  </div>
                )}
                {creatorName && (
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>Criado por {creatorName}</span>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-foreground whitespace-pre-wrap">{message}</p>
              </div>
            </CardContent>
          </Card>

          {/* Botao para AR */}
          <Button
            onClick={onSwitchToAR}
            size="lg"
            className="w-full h-14 text-lg font-semibold"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Ver em Realidade Aumentada
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} AR Lembretes. By João Victor A.S Pascon
      </footer>
    </div>
  );
};

export default CardView;
