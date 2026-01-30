import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, User, Sparkles, ArrowLeft, QrCode } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Blobs for depth */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-purple-500/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000" />

      {/* Header / Back Button */}
      <div className="absolute top-4 left-4 z-20">
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-white hover:bg-white/10 hover:text-white rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </Button>
      </div>

      <main className="w-full max-w-md z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-white/20 blur-xl rounded-full" />
            <img
              src={logo}
              alt="AR Lembretes"
              className="h-20 w-auto relative drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-transform hover:scale-105 duration-300"
            />
          </div>
        </div>

        {/* Glass Card */}
        <Card className="border-0 bg-black/40 backdrop-blur-xl shadow-2xl overflow-hidden ring-1 ring-white/10 rounded-3xl">
          {/* Card Header Pattern */}
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />

          <CardContent className="p-8 space-y-6 relative">
            {/* Title & Metadata */}
            <div className="space-y-4 text-center">
              <h1 className="text-3xl font-bold text-white tracking-tight drop-shadow-sm">
                {title}
              </h1>

              <div className="flex flex-wrap items-center justify-center gap-3 text-sm font-medium text-slate-300">
                {location && (
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full ring-1 ring-white/10 shadow-sm backdrop-blur-sm">
                    <MapPin className="w-3.5 h-3.5 text-purple-400" />
                    <span>{location}</span>
                  </div>
                )}
                {creatorName && (
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full ring-1 ring-white/10 shadow-sm backdrop-blur-sm">
                    <User className="w-3.5 h-3.5 text-blue-400" />
                    <span>{creatorName}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Divider */}
            <div className="h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            {/* Message Area */}
            <div className="min-h-[120px] max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent pr-2">
              <p className="text-lg leading-relaxed text-slate-100 whitespace-pre-wrap text-center font-light">
                {message}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Action Button */}
        <div className="mt-8 px-4">
          <Button
            onClick={onSwitchToAR}
            size="lg"
            className="w-full h-16 text-lg font-bold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-[0_0_20px_rgba(124,58,237,0.5)] border-0 rounded-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] group"
          >
            <Sparkles className="w-5 h-5 mr-2 animate-pulse" />
            <span className="tracking-wide">Ver em Realidade Aumentada</span>
            <div className="absolute inset-0 rounded-2xl ring-2 ring-white/20 group-hover:ring-white/40 transition-all duration-300" />
          </Button>

          <p className="mt-4 text-center text-xs text-slate-400 font-medium tracking-wider uppercase opacity-60">
            Experiência Imersiva
          </p>
        </div>
      </main>
    </div>
  );
};

export default CardView;
