import { MapPin, FileText, Sparkles } from "lucide-react";
import logo from "@/assets/logo-ar-lembretes.png";

interface ViewModeSelectorProps {
  title: string;
  location?: string;
  onSelectCard: () => void;
  onSelectAR: () => void;
}

const ViewModeSelector = ({
  title,
  location,
  onSelectCard,
  onSelectAR,
}: ViewModeSelectorProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-accent/20 flex flex-col">
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-6">
          {/* Logo */}
          <img src={logo} alt="AR Lembretes" className="h-16 mx-auto" />

          {/* Info do Lembrete */}
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground uppercase tracking-wide">
              Você escaneou um lembrete!
            </p>
            <h1 className="text-2xl font-bold text-foreground">{title}</h1>
            {location && (
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{location}</span>
              </div>
            )}
          </div>

          {/* Pergunta */}
          <p className="text-lg text-muted-foreground">
            Como deseja visualizar?
          </p>

          {/* Botoes de Escolha */}
          <div className="space-y-4">
            {/* Botao Card */}
            <button
              onClick={onSelectCard}
              className="w-full p-6 rounded-2xl bg-card/80 backdrop-blur border border-border
                         shadow-lg hover:shadow-xl hover:scale-[1.02] 
                         transition-all duration-300 text-left group"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center 
                                justify-center group-hover:bg-primary/20 transition-colors">
                  <FileText className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Ver Mensagem</h3>
                  <p className="text-sm text-muted-foreground">
                    Visualização simples em card
                  </p>
                </div>
              </div>
            </button>

            {/* Botao AR */}
            <button
              onClick={onSelectAR}
              className="w-full p-6 rounded-2xl bg-gradient-to-r from-primary/10 to-accent/10 
                         backdrop-blur border border-primary/20
                         shadow-lg hover:shadow-xl hover:scale-[1.02] 
                         transition-all duration-300 text-left group"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-accent 
                                flex items-center justify-center shadow-lg">
                  <Sparkles className="w-7 h-7 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Experiência AR</h3>
                  <p className="text-sm text-muted-foreground">
                    Avatar 3D com realidade aumentada
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} AR Lembretes. By João Victor A.S Pascon
      </footer>
    </div>
  );
};

export default ViewModeSelector;
